/**
 * md-parser-engine.ts - Real MD Parser for Foundation OS Phase 2
 * Parses FOS-*.md files into structured data for Supabase sync
 * PHASE 2 IMPLEMENTATION - NOT DOCUMENTATION
 */

import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// ── Types for Parsed Data ─────────────────────────────────────────────────

export interface ParsedSession {
  id: string
  date: string
  title: string
  items: string
  decisions: string
  phase: string | null
  status: 'active' | 'closed'
}

export interface ParsedDecision {
  id: string
  date: string
  title: string
  context: string
  impact: 'high' | 'medium' | 'low'
  status: 'active' | 'superseded' | 'deprecated'
}

export interface ParsedRisk {
  id: string
  risk: string
  impact: 'high' | 'medium' | 'low'
  proba: 'high' | 'medium' | 'low'
  mitigation: string | null
  status: 'open' | 'mitigated' | 'closed'
}

export interface ParsedNextStep {
  id: string
  label: string
  phase: string | null
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'todo' | 'in_progress' | 'done'
  sort_order: number
}

export interface ParsedContextBlock {
  id: string
  label: string
  content: string
  sort_order: number
}

export interface ParsedMDData {
  sessions: ParsedSession[]
  decisions: ParsedDecision[]
  risks: ParsedRisk[]
  nextSteps: ParsedNextStep[]
  contextBlocks: ParsedContextBlock[]
  metadata: {
    fileName: string
    lastParsed: string
    version: string
    lineCount: number
  }
}

// ── MD Parser Engine ─────────────────────────────────────────────────────

export class MDParserEngine {
  private projectRoot: string

  constructor(projectRoot: string = '/Users/kevinnoel/foundation-os') {
    this.projectRoot = projectRoot
  }

  // ── Main Parse Method ─────────────────────────────────────────────────

  parseFile(fileName: string): ParsedMDData | null {
    const filePath = join(this.projectRoot, fileName)

    if (!existsSync(filePath)) {
      console.warn(`⚠️ File not found: ${filePath}`)
      return null
    }

    try {
      const content = readFileSync(filePath, 'utf-8')
      const lines = content.split('\n')

      console.log(`📖 Parsing ${fileName} (${lines.length} lines)`)

      return {
        sessions: this.parseSessions(content, fileName),
        decisions: this.parseDecisions(content, fileName),
        risks: this.parseRisks(content, fileName),
        nextSteps: this.parseNextSteps(content, fileName),
        contextBlocks: this.parseContextBlocks(content, fileName),
        metadata: {
          fileName,
          lastParsed: new Date().toISOString(),
          version: this.extractVersion(content) || '1.0.0',
          lineCount: lines.length
        }
      }
    } catch (error) {
      console.error(`❌ Failed to parse ${fileName}:`, error)
      return null
    }
  }

  // ── Parse All Files ───────────────────────────────────────────────────

  parseAllFiles(): ParsedMDData {
    const filesToParse = [
      'FOS-COMMANDER-DATA.md',
      'FOS-JOURNAL.md',
      'FOS-MONITORING.md'
    ]

    const aggregatedData: ParsedMDData = {
      sessions: [],
      decisions: [],
      risks: [],
      nextSteps: [],
      contextBlocks: [],
      metadata: {
        fileName: 'AGGREGATED',
        lastParsed: new Date().toISOString(),
        version: '2.0.0',
        lineCount: 0
      }
    }

    for (const fileName of filesToParse) {
      const parsed = this.parseFile(fileName)
      if (parsed) {
        aggregatedData.sessions.push(...parsed.sessions)
        aggregatedData.decisions.push(...parsed.decisions)
        aggregatedData.risks.push(...parsed.risks)
        aggregatedData.nextSteps.push(...parsed.nextSteps)
        aggregatedData.contextBlocks.push(...parsed.contextBlocks)
        aggregatedData.metadata.lineCount += parsed.metadata.lineCount
      }
    }

    console.log(`✅ Parsed ${filesToParse.length} files:`)
    console.log(`   Sessions: ${aggregatedData.sessions.length}`)
    console.log(`   Decisions: ${aggregatedData.decisions.length}`)
    console.log(`   Risks: ${aggregatedData.risks.length}`)
    console.log(`   Next Steps: ${aggregatedData.nextSteps.length}`)
    console.log(`   Context Blocks: ${aggregatedData.contextBlocks.length}`)

    return aggregatedData
  }

  // ── Session Parser ─────────────────────────────────────────────────────

  private parseSessions(content: string, fileName: string): ParsedSession[] {
    const sessions: ParsedSession[] = []
    const lines = content.split('\n')
    let currentSession: Partial<ParsedSession> | null = null
    let inSessionsSection = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Detect sessions section
      if (line.includes('## SESSIONS') || line.includes('## SESSION')) {
        inSessionsSection = true
        continue
      }

      // Exit sessions section
      if (inSessionsSection && line.startsWith('##') && !line.includes('SESSION')) {
        inSessionsSection = false
        if (currentSession) {
          sessions.push(this.finalizeSession(currentSession, fileName))
          currentSession = null
        }
        continue
      }

      if (!inSessionsSection) continue

      // Parse session header (### SESSION-001 · 2026-04-02)
      const sessionMatch = line.match(/###\s*(SESSION-\w+)\s*[·•]\s*([0-9-]+)/)
      if (sessionMatch) {
        if (currentSession) {
          sessions.push(this.finalizeSession(currentSession, fileName))
        }
        currentSession = {
          id: `${fileName}-${sessionMatch[1]}`,
          date: sessionMatch[2],
          status: 'closed'
        }
        continue
      }

      // Parse session content
      if (currentSession && line.length > 0) {
        if (line.startsWith('Titre :')) {
          currentSession.title = line.replace('Titre :', '').trim()
        } else if (line.startsWith('Items :')) {
          currentSession.items = line.replace('Items :', '').trim()
        } else if (line.startsWith('Décisions :')) {
          currentSession.decisions = line.replace('Décisions :', '').trim()
        }
      }
    }

    // Finalize last session
    if (currentSession) {
      sessions.push(this.finalizeSession(currentSession, fileName))
    }

    return sessions
  }

  private finalizeSession(partial: Partial<ParsedSession>, fileName: string): ParsedSession {
    return {
      id: partial.id || `${fileName}-session-${Date.now()}`,
      date: partial.date || new Date().toISOString().split('T')[0],
      title: partial.title || 'Untitled Session',
      items: partial.items || '',
      decisions: partial.decisions || '',
      phase: this.extractPhase(fileName),
      status: partial.status || 'active'
    }
  }

  // ── Decision Parser (ADR) ──────────────────────────────────────────────

  private parseDecisions(content: string, fileName: string): ParsedDecision[] {
    const decisions: ParsedDecision[] = []
    const lines = content.split('\n')

    // Find ADR table
    let inADRTable = false
    let headerPassed = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Detect ADR section
      if (line.includes('## DÉCISIONS') || line.includes('## ADR')) {
        inADRTable = true
        continue
      }

      // Exit ADR section
      if (inADRTable && line.startsWith('##') && !line.includes('DÉCISIONS') && !line.includes('ADR')) {
        break
      }

      if (!inADRTable) continue

      // Skip table header
      if (line.includes('ID') && line.includes('Date') && line.includes('Titre')) {
        headerPassed = true
        continue
      }

      // Skip separator
      if (line.includes('---') || line.includes('===')) {
        continue
      }

      // Parse ADR row: | ADR-001 | 2026-04-02 | Coopération > exploitation | Philosophie Foundation OS | high | active |
      if (headerPassed && line.startsWith('|') && line.split('|').length >= 6) {
        const parts = line.split('|').map(p => p.trim()).filter(p => p.length > 0)
        if (parts.length >= 6) {
          decisions.push({
            id: `${fileName}-${parts[0]}`,
            date: parts[1],
            title: parts[2],
            context: parts[3],
            impact: this.normalizeImpact(parts[4]),
            status: this.normalizeDecisionStatus(parts[5])
          })
        }
      }
    }

    return decisions
  }

  // ── Risk Parser ────────────────────────────────────────────────────────

  private parseRisks(content: string, fileName: string): ParsedRisk[] {
    const risks: ParsedRisk[] = []
    const lines = content.split('\n')

    let inRiskTable = false
    let headerPassed = false

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Detect risks section
      if (line.includes('## RISQUES') || line.includes('## RISK')) {
        inRiskTable = true
        continue
      }

      // Exit risks section
      if (inRiskTable && line.startsWith('##') && !line.includes('RISQUES') && !line.includes('RISK')) {
        break
      }

      if (!inRiskTable) continue

      // Skip table header
      if (line.includes('ID') && line.includes('Risque') && line.includes('Impact')) {
        headerPassed = true
        continue
      }

      if (line.includes('---')) continue

      // Parse risk row: | R-01 | Artifacts trop lourds | medium | high | Consolidation 10→6 artifacts | open |
      if (headerPassed && line.startsWith('|') && line.split('|').length >= 6) {
        const parts = line.split('|').map(p => p.trim()).filter(p => p.length > 0)
        if (parts.length >= 6) {
          risks.push({
            id: `${fileName}-${parts[0]}`,
            risk: parts[1],
            impact: this.normalizeImpact(parts[2]),
            proba: this.normalizeImpact(parts[3]),
            mitigation: parts[4] || null,
            status: this.normalizeRiskStatus(parts[5])
          })
        }
      }
    }

    return risks
  }

  // ── Next Steps Parser ──────────────────────────────────────────────────

  private parseNextSteps(content: string, fileName: string): ParsedNextStep[] {
    const nextSteps: ParsedNextStep[] = []
    const lines = content.split('\n')

    let inNextStepsTable = false
    let headerPassed = false
    let sortOrder = 1

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Detect next steps section
      if (line.includes('## NEXT STEPS') || line.includes('## ACTIONS')) {
        inNextStepsTable = true
        continue
      }

      // Exit section
      if (inNextStepsTable && line.startsWith('##') && !line.includes('NEXT') && !line.includes('ACTIONS')) {
        break
      }

      if (!inNextStepsTable) continue

      // Skip table header
      if (line.includes('ID') && line.includes('Label') && line.includes('Priorité')) {
        headerPassed = true
        continue
      }

      if (line.includes('---')) continue

      // Parse next step row: | NS-01 | Créer projet Claude.ai Foundation OS | critical | Kévin | ☐ |
      if (headerPassed && line.startsWith('|') && line.split('|').length >= 5) {
        const parts = line.split('|').map(p => p.trim()).filter(p => p.length > 0)
        if (parts.length >= 5) {
          nextSteps.push({
            id: `${fileName}-${parts[0]}`,
            label: parts[1],
            phase: this.extractPhase(fileName),
            priority: this.normalizePriority(parts[2]),
            status: this.parseTaskStatus(parts[4]),
            sort_order: sortOrder++
          })
        }
      }
    }

    return nextSteps
  }

  // ── Context Blocks Parser ──────────────────────────────────────────────

  private parseContextBlocks(content: string, fileName: string): ParsedContextBlock[] {
    const contextBlocks: ParsedContextBlock[] = []
    const lines = content.split('\n')

    let inContextSection = false
    let currentBlock: Partial<ParsedContextBlock> | null = null
    let sortOrder = 1

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()

      // Detect context section
      if (line.includes('## CONTEXT BLOCKS') || line.includes('## MÉTA PROJET')) {
        inContextSection = true
        continue
      }

      // Exit section
      if (inContextSection && line.startsWith('##') && !line.includes('CONTEXT') && !line.includes('MÉTA')) {
        if (currentBlock && currentBlock.label && currentBlock.content) {
          contextBlocks.push({
            id: `${fileName}-context-${currentBlock.label}`,
            label: currentBlock.label,
            content: currentBlock.content,
            sort_order: sortOrder++
          })
        }
        break
      }

      if (!inContextSection) continue

      // Parse context block header: ### C-01 · Persistance mémoire
      const blockMatch = line.match(/###\s*([^·]+)[·•]\s*(.+)/)
      if (blockMatch) {
        if (currentBlock && currentBlock.label && currentBlock.content) {
          contextBlocks.push({
            id: `${fileName}-context-${currentBlock.label}`,
            label: currentBlock.label,
            content: currentBlock.content,
            sort_order: sortOrder++
          })
        }
        currentBlock = {
          label: blockMatch[2].trim(),
          content: ''
        }
        continue
      }

      // Add content to current block
      if (currentBlock && line.length > 0 && !line.startsWith('#')) {
        currentBlock.content = (currentBlock.content || '') + line + '\n'
      }
    }

    // Finalize last block
    if (currentBlock && currentBlock.label && currentBlock.content) {
      contextBlocks.push({
        id: `${fileName}-context-${currentBlock.label}`,
        label: currentBlock.label,
        content: currentBlock.content,
        sort_order: sortOrder
      })
    }

    return contextBlocks
  }

  // ── Utility Methods ────────────────────────────────────────────────────

  private extractVersion(content: string): string | null {
    const versionMatch = content.match(/DATA_VERSION\s*:\s*([0-9.]+)/)
    return versionMatch ? versionMatch[1] : null
  }

  private extractPhase(fileName: string): string | null {
    if (fileName.includes('COMMANDER')) return 'Phase 0'
    if (fileName.includes('JOURNAL')) return 'Foundation'
    return null
  }

  private normalizeImpact(impact: string): 'high' | 'medium' | 'low' {
    const normalized = impact.toLowerCase().trim()
    if (normalized.includes('high') || normalized.includes('critical')) return 'high'
    if (normalized.includes('low')) return 'low'
    return 'medium'
  }

  private normalizePriority(priority: string): 'critical' | 'high' | 'medium' | 'low' {
    const normalized = priority.toLowerCase().trim()
    if (normalized.includes('critical')) return 'critical'
    if (normalized.includes('high')) return 'high'
    if (normalized.includes('low')) return 'low'
    return 'medium'
  }

  private normalizeDecisionStatus(status: string): 'active' | 'superseded' | 'deprecated' {
    const normalized = status.toLowerCase().trim()
    if (normalized.includes('superseded')) return 'superseded'
    if (normalized.includes('deprecated')) return 'deprecated'
    return 'active'
  }

  private normalizeRiskStatus(status: string): 'open' | 'mitigated' | 'closed' {
    const normalized = status.toLowerCase().trim()
    if (normalized.includes('mitigated')) return 'mitigated'
    if (normalized.includes('closed')) return 'closed'
    return 'open'
  }

  private parseTaskStatus(statusCell: string): 'todo' | 'in_progress' | 'done' {
    if (statusCell.includes('✅') || statusCell.includes('done')) return 'done'
    if (statusCell.includes('🔄') || statusCell.includes('progress')) return 'in_progress'
    return 'todo'
  }

  // ── Demo/Testing Methods ───────────────────────────────────────────────

  async demonstrateParsing(): Promise<void> {
    console.log('🚀 Starting MD Parser Demo...')

    const parsedData = this.parseAllFiles()

    console.log('\n📊 Parsing Results:')
    console.log(`  Sessions parsed: ${parsedData.sessions.length}`)
    console.log(`  Decisions parsed: ${parsedData.decisions.length}`)
    console.log(`  Risks parsed: ${parsedData.risks.length}`)
    console.log(`  Next Steps parsed: ${parsedData.nextSteps.length}`)
    console.log(`  Context Blocks parsed: ${parsedData.contextBlocks.length}`)

    if (parsedData.sessions.length > 0) {
      console.log('\n📝 Sample Session:')
      console.log(`  Title: ${parsedData.sessions[0].title}`)
      console.log(`  Date: ${parsedData.sessions[0].date}`)
      console.log(`  Items: ${parsedData.sessions[0].items?.substring(0, 100)}...`)
    }

    if (parsedData.decisions.length > 0) {
      console.log('\n📋 Sample Decision:')
      console.log(`  Title: ${parsedData.decisions[0].title}`)
      console.log(`  Impact: ${parsedData.decisions[0].impact}`)
      console.log(`  Status: ${parsedData.decisions[0].status}`)
    }

    console.log('\n✅ MD Parser Demo Complete!')

    return
  }
}

// ── Export Singleton ─────────────────────────────────────────────────────

export const mdParserEngine = new MDParserEngine()
export default mdParserEngine