/**
 * md-to-seed.ts - MD to SQL Parser for Foundation OS Phase 2
 * Parses FOS-*.md files and generates SQL INSERT statements
 * Unified Source: MD files become the single source of truth
 */

import fs from 'fs'
import path from 'path'

// ── Types for parsed data ─────────────────────────────────────────────────

interface ParsedSession {
  id: string
  date: string
  title: string
  items: string
  decisions: string
  phase: string
  status: 'active' | 'closed'
}

interface ParsedDecision {
  id: string
  date: string
  title: string
  context: string
  impact: 'high' | 'medium' | 'low'
  status: 'active' | 'superseded' | 'deprecated'
}

interface ParsedRisk {
  id: string
  risk: string
  impact: 'high' | 'medium' | 'low'
  proba: 'high' | 'medium' | 'low'
  mitigation: string
  status: 'open' | 'mitigated' | 'closed'
}

interface ParsedNextStep {
  id: string
  label: string
  phase: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'todo' | 'in_progress' | 'done'
  sort_order: number
}

interface ParsedContextBlock {
  id: string
  label: string
  content: string
  sort_order: number
}

// ── Session Parser (from FOS-JOURNAL.md) ─────────────────────────────────

export function parseSessionsFromJournal(journalPath: string): ParsedSession[] {
  const content = fs.readFileSync(journalPath, 'utf-8')
  const sessions: ParsedSession[] = []

  // Match session blocks: ### CONV-XX · DATE · Title
  const sessionRegex = /### (CONV-\d+) · (\d{4}-\d{2}-\d{2}) · (.+?)(?=###|$)/gs

  let match
  while ((match = sessionRegex.exec(content)) !== null) {
    const [fullMatch, convId, date, title] = match
    const sessionBlock = fullMatch

    // Extract items (after **Items :**)
    const itemsMatch = sessionBlock.match(/\*\*Items :\*\*\s*\n((?:- .+?\n)*)/s)
    const items = itemsMatch ? itemsMatch[1].trim() : ''

    // Extract decisions (after **Décisions :**)
    const decisionsMatch = sessionBlock.match(/\*\*Décisions :\*\*\s*\n((?:- .+?\n)*)/s)
    const decisions = decisionsMatch ? decisionsMatch[1].trim() : ''

    // Determine phase from title or content
    let phase = '01'
    if (title.includes('Phase 0')) phase = '00'
    else if (title.includes('Phase 1')) phase = '01'
    else if (title.includes('Phase 2')) phase = '02'

    // Determine status
    const status = title.includes('TERMINÉE') || title.includes('COMPLET') ? 'closed' : 'active'

    sessions.push({
      id: convId,
      date,
      title: title.trim(),
      items,
      decisions,
      phase,
      status
    })
  }

  return sessions
}

// ── ADR Parser (from FOS-JOURNAL.md ADR section) ─────────────────────────

export function parseDecisionsFromJournal(journalPath: string): ParsedDecision[] {
  const content = fs.readFileSync(journalPath, 'utf-8')
  const decisions: ParsedDecision[] = []

  // Find ADR section
  const adrSection = content.match(/## ADR — Architecture Decision Records\s*\n(.*?)(?=\n##|$)/s)
  if (!adrSection) return decisions

  // Match ADR table rows: | ADR-XXX | DATE | Title | Impact | Status |
  const adrRegex = /\|\s*(ADR-\d+)\s*\|\s*(\d{4}-\d{2}-\d{2})\s*\|\s*(.+?)\s*\|\s*(.+?)\s*\|\s*(active|superseded|deprecated)\s*\|/g

  let match
  while ((match = adrRegex.exec(adrSection[1])) !== null) {
    const [, id, date, title, impactRaw, status] = match

    // Normalize impact
    let impact: 'high' | 'medium' | 'low' = 'medium'
    if (impactRaw.toLowerCase().includes('high')) impact = 'high'
    else if (impactRaw.toLowerCase().includes('low')) impact = 'low'

    decisions.push({
      id,
      date,
      title: title.trim(),
      context: `Décision architecturale ${id} - voir FOS-JOURNAL.md pour contexte complet`,
      impact,
      status: status as 'active' | 'superseded' | 'deprecated'
    })
  }

  return decisions
}

// ── Risk Parser (from FOS-MONITORING.md) ─────────────────────────────────

export function parseRisksFromMonitoring(monitoringPath: string): ParsedRisk[] {
  const content = fs.readFileSync(monitoringPath, 'utf-8')
  const risks: ParsedRisk[] = []

  // Find risks section
  const risksSection = content.match(/## Risques actifs\s*\n(.*?)(?=\n##|$)/s)
  if (!risksSection) return risks

  // Match risk table rows: | R-XX | Risk | Impact | Proba | Mitigation | Status |
  const riskRegex = /\|\s*(R-\d+)\s*\|\s*(.+?)\s*\|\s*(high|medium|low)\s*\|\s*(high|medium|low)\s*\|\s*(.+?)\s*\|\s*(open|mitigated|closed)\s*\|/g

  let match
  while ((match = riskRegex.exec(risksSection[1])) !== null) {
    const [, id, risk, impact, proba, mitigation, status] = match

    risks.push({
      id,
      risk: risk.trim(),
      impact: impact as 'high' | 'medium' | 'low',
      proba: proba as 'high' | 'medium' | 'low',
      mitigation: mitigation.trim(),
      status: status as 'open' | 'mitigated' | 'closed'
    })
  }

  return risks
}

// ── Next Steps Parser (from FOS-PLAN-MASTER-v2.md) ─────────────────────

export function parseNextStepsFromPlan(planPath: string): ParsedNextStep[] {
  const content = fs.readFileSync(planPath, 'utf-8')
  const nextSteps: ParsedNextStep[] = []

  // Match task items like "- ✅ Task description"
  const taskRegex = /- ([✅❌⏳])\s*(.+?)(?:→|$)/g

  let match
  let sortOrder = 0
  while ((match = taskRegex.exec(content)) !== null) {
    const [, statusIcon, taskText] = match

    let status: 'todo' | 'in_progress' | 'done' = 'todo'
    if (statusIcon === '✅') status = 'done'
    else if (statusIcon === '⏳') status = 'in_progress'

    // Determine phase from context
    let phase = '02' // Default to Phase 2
    if (taskText.includes('Phase 0')) phase = '00'
    else if (taskText.includes('Phase 1')) phase = '01'

    // Determine priority from keywords
    let priority: 'critical' | 'high' | 'medium' | 'low' = 'medium'
    if (taskText.toLowerCase().includes('urgent') || taskText.toLowerCase().includes('critical')) {
      priority = 'critical'
    } else if (taskText.toLowerCase().includes('important') || taskText.toLowerCase().includes('first')) {
      priority = 'high'
    }

    nextSteps.push({
      id: `STEP-${Date.now()}-${sortOrder}`,
      label: taskText.trim(),
      phase,
      priority,
      status,
      sort_order: sortOrder++
    })
  }

  return nextSteps
}

// ── Context Blocks Parser (from multiple FOS-*.md) ─────────────────────

export function parseContextBlocks(fosDirectory: string): ParsedContextBlock[] {
  const contextBlocks: ParsedContextBlock[] = []
  let sortOrder = 0

  // Read all FOS-*-DATA.md files
  const files = fs.readdirSync(fosDirectory).filter(f =>
    f.startsWith('FOS-') && f.endsWith('-DATA.md')
  )

  for (const file of files) {
    const content = fs.readFileSync(path.join(fosDirectory, file), 'utf-8')

    // Extract title as label
    const titleMatch = content.match(/^# (.+)$/m)
    const label = titleMatch ? titleMatch[1] : file.replace('.md', '')

    // Use first paragraph as content
    const lines = content.split('\n')
    const contentStart = lines.findIndex(line => line.trim() && !line.startsWith('#') && !line.startsWith('>'))
    const contentEnd = lines.findIndex((line, i) => i > contentStart && (line.startsWith('#') || line.trim() === ''))

    const contentLines = lines.slice(contentStart, contentEnd === -1 ? undefined : contentEnd)
    const content_text = contentLines.join('\n').trim()

    if (content_text) {
      contextBlocks.push({
        id: `CTX-${file.replace('.md', '').replace('FOS-', '')}`,
        label,
        content: content_text,
        sort_order: sortOrder++
      })
    }
  }

  return contextBlocks
}

// ── SQL Generation ─────────────────────────────────────────────────────

export function generateSessionsSQL(sessions: ParsedSession[]): string {
  if (sessions.length === 0) return ''

  const values = sessions.map(s =>
    `('${s.id}', '${s.date}', '${s.title.replace(/'/g, "''")}', '${s.items.replace(/'/g, "''")}', '${s.decisions.replace(/'/g, "''")}', '${s.phase}', '${s.status}')`
  ).join(',\n  ')

  return `-- Sessions from MD files
INSERT INTO sessions (id, date, title, items, decisions, phase, status) VALUES
  ${values}
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date,
  title = EXCLUDED.title,
  items = EXCLUDED.items,
  decisions = EXCLUDED.decisions,
  phase = EXCLUDED.phase,
  status = EXCLUDED.status;`
}

export function generateDecisionsSQL(decisions: ParsedDecision[]): string {
  if (decisions.length === 0) return ''

  const values = decisions.map(d =>
    `('${d.id}', '${d.date}', '${d.title.replace(/'/g, "''")}', '${d.context.replace(/'/g, "''")}', '${d.impact}', '${d.status}')`
  ).join(',\n  ')

  return `-- Decisions from MD files
INSERT INTO decisions (id, date, title, context, impact, status) VALUES
  ${values}
ON CONFLICT (id) DO UPDATE SET
  date = EXCLUDED.date,
  title = EXCLUDED.title,
  context = EXCLUDED.context,
  impact = EXCLUDED.impact,
  status = EXCLUDED.status;`
}

export function generateRisksSQL(risks: ParsedRisk[]): string {
  if (risks.length === 0) return ''

  const values = risks.map(r =>
    `('${r.id}', '${r.risk.replace(/'/g, "''")}', '${r.impact}', '${r.proba}', '${r.mitigation.replace(/'/g, "''")}', '${r.status}')`
  ).join(',\n  ')

  return `-- Risks from MD files
INSERT INTO risks (id, risk, impact, proba, mitigation, status) VALUES
  ${values}
ON CONFLICT (id) DO UPDATE SET
  risk = EXCLUDED.risk,
  impact = EXCLUDED.impact,
  proba = EXCLUDED.proba,
  mitigation = EXCLUDED.mitigation,
  status = EXCLUDED.status;`
}

export function generateNextStepsSQL(nextSteps: ParsedNextStep[]): string {
  if (nextSteps.length === 0) return ''

  const values = nextSteps.map(n =>
    `('${n.id}', '${n.label.replace(/'/g, "''")}', '${n.phase}', '${n.priority}', '${n.status}', ${n.sort_order})`
  ).join(',\n  ')

  return `-- Next Steps from MD files
INSERT INTO next_steps (id, label, phase, priority, status, sort_order) VALUES
  ${values}
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  phase = EXCLUDED.phase,
  priority = EXCLUDED.priority,
  status = EXCLUDED.status,
  sort_order = EXCLUDED.sort_order;`
}

export function generateContextBlocksSQL(contextBlocks: ParsedContextBlock[]): string {
  if (contextBlocks.length === 0) return ''

  const values = contextBlocks.map(c =>
    `('${c.id}', '${c.label.replace(/'/g, "''")}', '${c.content.replace(/'/g, "''")}', ${c.sort_order})`
  ).join(',\n  ')

  return `-- Context Blocks from MD files
INSERT INTO context_blocks (id, label, content, sort_order) VALUES
  ${values}
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  content = EXCLUDED.content,
  sort_order = EXCLUDED.sort_order;`
}

// ── Main Parser Function ─────────────────────────────────────────────────

export function generateSeedFromMD(fosDirectory: string): string {
  const journalPath = path.join(fosDirectory, 'FOS-JOURNAL.md')
  const monitoringPath = path.join(fosDirectory, 'FOS-MONITORING.md')
  const planPath = path.join(fosDirectory, 'FOS-PLAN-MASTER-v2.md')

  console.log('🔍 Parsing MD files...')

  const sessions = fs.existsSync(journalPath) ? parseSessionsFromJournal(journalPath) : []
  const decisions = fs.existsSync(journalPath) ? parseDecisionsFromJournal(journalPath) : []
  const risks = fs.existsSync(monitoringPath) ? parseRisksFromMonitoring(monitoringPath) : []
  const nextSteps = fs.existsSync(planPath) ? parseNextStepsFromPlan(planPath) : []
  const contextBlocks = parseContextBlocks(fosDirectory)

  console.log(`📊 Parsed: ${sessions.length} sessions, ${decisions.length} decisions, ${risks.length} risks, ${nextSteps.length} next steps, ${contextBlocks.length} context blocks`)

  const sqlParts = [
    '-- Foundation OS - Generated from MD files',
    `-- Generated at: ${new Date().toISOString()}`,
    '',
    generateSessionsSQL(sessions),
    '',
    generateDecisionsSQL(decisions),
    '',
    generateRisksSQL(risks),
    '',
    generateNextStepsSQL(nextSteps),
    '',
    generateContextBlocksSQL(contextBlocks),
    ''
  ].filter(Boolean)

  return sqlParts.join('\n')
}

// ── CLI Usage ─────────────────────────────────────────────────────────────

if (require.main === module) {
  const fosDirectory = process.argv[2] || '../..'
  const outputPath = process.argv[3] || './generated-seed.sql'

  try {
    const sql = generateSeedFromMD(fosDirectory)
    fs.writeFileSync(outputPath, sql)
    console.log(`✅ Generated SQL seed at: ${outputPath}`)
  } catch (error) {
    console.error('❌ Error generating seed:', error)
    process.exit(1)
  }
}