/**
 * self-modifying-generator.ts - Self-Modifying Code Generator for Foundation OS Phase 3
 * Foundation OS can analyze its own needs and automatically generate new functionality
 * Revolutionary self-evolving architecture
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs'
import { join, basename, extname } from 'path'
import { mdTemplateEngine } from './md-template-engine'
import { supabase } from './supabase'

// ── Self-Analysis Types ───────────────────────────────────────────────────

interface SystemNeed {
  id: string
  type: 'component' | 'hook' | 'page' | 'api' | 'feature'
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  context: string
  suggestedImplementation?: string
  dependencies: string[]
  generatedAt: string
}

interface GenerationPlan {
  id: string
  needs: SystemNeed[]
  generatedFiles: string[]
  mdDocuments: string[]
  success: boolean
  errors: string[]
  timestamp: string
}

// ── Self-Modifying Generator Core ─────────────────────────────────────────

export class SelfModifyingGenerator {
  private analysisCache: Map<string, SystemNeed[]> = new Map()
  private generationHistory: GenerationPlan[] = []

  // ── Analyze Foundation OS Current State ─────────────────────────────

  async analyzeSystemNeeds(scanDirectory: string = '/Users/kevinnoel/foundation-os'): Promise<SystemNeed[]> {
    console.log('🔍 Analyzing Foundation OS system needs...')

    const needs: SystemNeed[] = []

    // Analyze existing documentation for gaps
    const documentationNeeds = await this.analyzeDocumentationGaps(scanDirectory)
    needs.push(...documentationNeeds)

    // Analyze code structure for missing components
    const componentNeeds = await this.analyzeComponentGaps(scanDirectory)
    needs.push(...componentNeeds)

    // Analyze user patterns from database
    const usageNeeds = await this.analyzeUsagePatterns()
    needs.push(...usageNeeds)

    // Analyze TODOs and comments in codebase
    const todoNeeds = await this.analyzeTodoComments(scanDirectory)
    needs.push(...todoNeeds)

    // Cache results
    this.analysisCache.set(scanDirectory, needs)

    console.log(`📊 Identified ${needs.length} system needs`)
    return needs
  }

  // ── Analyze Documentation Gaps ────────────────────────────────────────

  private async analyzeDocumentationGaps(directory: string): Promise<SystemNeed[]> {
    const needs: SystemNeed[] = []

    try {
      // Look for missing MD files for existing components
      const srcPath = join(directory, 'app/src')
      if (existsSync(srcPath)) {
        const components = this.findComponentFiles(srcPath)

        for (const component of components) {
          const mdPath = component.replace(/\.(tsx?|jsx?)$/, '.md')
          if (!existsSync(mdPath)) {
            needs.push({
              id: `doc-${basename(component, extname(component))}`,
              type: 'component',
              description: `Missing documentation for ${basename(component)}`,
              priority: 'medium',
              context: `Component ${basename(component)} lacks proper documentation`,
              dependencies: [],
              generatedAt: new Date().toISOString()
            })
          }
        }
      }

      // Check for missing FOS documentation
      const fosFiles = ['FOS-API-REFERENCE.md', 'FOS-DEPLOYMENT.md', 'FOS-TESTING.md']
      for (const file of fosFiles) {
        if (!existsSync(join(directory, file))) {
          needs.push({
            id: `doc-${file.replace('.md', '')}`,
            type: 'feature',
            description: `Missing ${file} documentation`,
            priority: 'high',
            context: 'Foundation OS lacks comprehensive documentation',
            dependencies: [],
            generatedAt: new Date().toISOString()
          })
        }
      }
    } catch (error) {
      console.warn('Documentation analysis error:', error)
    }

    return needs
  }

  // ── Analyze Component Gaps ────────────────────────────────────────────

  private async analyzeComponentGaps(directory: string): Promise<SystemNeed[]> {
    const needs: SystemNeed[] = []

    try {
      // Analyze import statements for missing components
      const tsxFiles = this.findComponentFiles(join(directory, 'app/src'))

      for (const file of tsxFiles) {
        const content = readFileSync(file, 'utf-8')

        // Look for TODO comments indicating missing components
        const componentTodos = content.match(/\/\/ TODO:.*component.*(\w+)/gi)
        if (componentTodos) {
          for (const todo of componentTodos) {
            const match = todo.match(/(\w+)/g)
            const componentName = match ? match[match.length - 1] : 'Unknown'

            needs.push({
              id: `comp-${componentName.toLowerCase()}`,
              type: 'component',
              description: `Missing component: ${componentName}`,
              priority: 'medium',
              context: `Referenced in ${basename(file)}`,
              suggestedImplementation: `Create React component ${componentName} with Void Glass styling`,
              dependencies: ['react', 'void-glass'],
              generatedAt: new Date().toISOString()
            })
          }
        }

        // Look for missing import references
        const importErrors = content.match(/import.*from ['"]\.\/components\/(\w+)['"]/g)
        if (importErrors) {
          for (const importRef of importErrors) {
            const componentName = importRef.match(/\/(\w+)['"]$/)?.[1]
            if (componentName) {
              const componentPath = join(directory, 'app/src/components', `${componentName}.tsx`)
              if (!existsSync(componentPath)) {
                needs.push({
                  id: `missing-${componentName.toLowerCase()}`,
                  type: 'component',
                  description: `Missing imported component: ${componentName}`,
                  priority: 'high',
                  context: `Import found in ${basename(file)} but file doesn't exist`,
                  suggestedImplementation: `Create ${componentName}.tsx component`,
                  dependencies: ['react'],
                  generatedAt: new Date().toISOString()
                })
              }
            }
          }
        }
      }
    } catch (error) {
      console.warn('Component gap analysis error:', error)
    }

    return needs
  }

  // ── Analyze Usage Patterns from Database ─────────────────────────────

  private async analyzeUsagePatterns(): Promise<SystemNeed[]> {
    const needs: SystemNeed[] = []

    try {
      // Analyze session data for feature requests
      const { data: sessions } = await (supabase as any)
        .from('sessions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (sessions) {
        for (const session of sessions) {
          // Look for feature requests in session items
          if (session.items && session.items.includes('nouvelle')) {
            const featureMatch = session.items.match(/nouvelle?\s+(\w+)/gi)
            if (featureMatch) {
              for (const match of featureMatch) {
                const feature = match.replace(/nouvelle?\s+/i, '')
                needs.push({
                  id: `request-${feature.toLowerCase()}`,
                  type: 'feature',
                  description: `User requested feature: ${feature}`,
                  priority: 'medium',
                  context: `Found in session ${session.id}`,
                  dependencies: [],
                  generatedAt: new Date().toISOString()
                })
              }
            }
          }
        }
      }

      // Analyze decisions for technical debt
      const { data: decisions } = await (supabase as any)
        .from('decisions')
        .select('*')
        .eq('status', 'active')

      if (decisions) {
        for (const decision of decisions) {
          if (decision.context && decision.context.includes('TODO')) {
            needs.push({
              id: `debt-${decision.id}`,
              type: 'feature',
              description: `Technical debt from ADR: ${decision.title}`,
              priority: decision.impact === 'high' ? 'high' : 'medium',
              context: decision.context,
              dependencies: [],
              generatedAt: new Date().toISOString()
            })
          }
        }
      }
    } catch (error) {
      console.warn('Usage pattern analysis error:', error)
    }

    return needs
  }

  // ── Analyze TODO Comments in Codebase ────────────────────────────────

  private async analyzeTodoComments(directory: string): Promise<SystemNeed[]> {
    const needs: SystemNeed[] = []

    try {
      const codeFiles = this.findCodeFiles(join(directory, 'app/src'))

      for (const file of codeFiles) {
        const content = readFileSync(file, 'utf-8')
        const todos = content.match(/\/\/\s*TODO:?(.+)/gi)

        if (todos) {
          for (const todo of todos) {
            const description = todo.replace(/\/\/\s*TODO:?\s*/i, '').trim()

            // Determine type based on todo content
            let type: SystemNeed['type'] = 'feature'
            if (description.toLowerCase().includes('component')) type = 'component'
            else if (description.toLowerCase().includes('hook')) type = 'hook'
            else if (description.toLowerCase().includes('api')) type = 'api'
            else if (description.toLowerCase().includes('page')) type = 'page'

            // Determine priority
            let priority: SystemNeed['priority'] = 'medium'
            if (description.toLowerCase().includes('urgent') || description.toLowerCase().includes('critical')) {
              priority = 'critical'
            } else if (description.toLowerCase().includes('important')) {
              priority = 'high'
            }

            needs.push({
              id: `todo-${Math.random().toString(36).substr(2, 9)}`,
              type,
              description,
              priority,
              context: `TODO in ${basename(file)}`,
              dependencies: [],
              generatedAt: new Date().toISOString()
            })
          }
        }
      }
    } catch (error) {
      console.warn('TODO analysis error:', error)
    }

    return needs
  }

  // ── Generate Code from Identified Needs ──────────────────────────────

  async generateFromNeeds(needs: SystemNeed[], outputDirectory: string = '/Users/kevinnoel/foundation-os'): Promise<GenerationPlan> {
    const plan: GenerationPlan = {
      id: `gen-${Date.now()}`,
      needs,
      generatedFiles: [],
      mdDocuments: [],
      success: true,
      errors: [],
      timestamp: new Date().toISOString()
    }

    console.log(`🚀 Starting self-modification for ${needs.length} needs...`)

    for (const need of needs) {
      try {
        const generated = await this.generateForNeed(need, outputDirectory)
        plan.generatedFiles.push(...generated.files)
        plan.mdDocuments.push(...generated.docs)
      } catch (error: any) {
        plan.errors.push(`${need.id}: ${error.message}`)
        plan.success = false
      }
    }

    // Save generation plan
    this.generationHistory.push(plan)

    console.log(`✅ Self-modification complete: ${plan.generatedFiles.length} files, ${plan.errors.length} errors`)
    return plan
  }

  // ── Generate for Individual Need ──────────────────────────────────────

  private async generateForNeed(need: SystemNeed, outputDir: string): Promise<{files: string[], docs: string[]}> {
    const result = { files: [] as string[], docs: [] as string[] }

    // First, generate MD documentation for the need
    const mdContent = this.generateNeedDocumentation(need)
    const mdPath = join(outputDir, 'generated-docs', `${need.id}.md`)
    writeFileSync(mdPath, mdContent, 'utf-8')
    result.docs.push(mdPath)

    // Then use template engine to generate code from the documentation
    try {
      const generatedFiles = mdTemplateEngine.processMarkdownFile(mdPath, outputDir)
      result.files.push(...generatedFiles)
    } catch (error) {
      console.warn(`Could not generate code for need ${need.id}:`, error)
    }

    return result
  }

  // ── Generate MD Documentation for Need ────────────────────────────────

  private generateNeedDocumentation(need: SystemNeed): string {
    const timestamp = new Date().toLocaleString()

    if (need.type === 'component') {
      return `# ${need.description.replace('Missing component: ', '')}

> Auto-generated by Foundation OS Self-Modifying Generator
> Generated: ${timestamp}

## Description
${need.description}

## Context
${need.context}

\`\`\`component ${need.description.replace('Missing component: ', '').replace(/[^a-zA-Z0-9]/g, '')}
description: ${need.description}
props:
  - children: React.ReactNode
  - className: string: Additional CSS classes
void-glass: true
\`\`\``
    }

    if (need.type === 'hook') {
      return `# ${need.description.replace('Missing hook: ', '')}

> Auto-generated by Foundation OS Self-Modifying Generator
> Generated: ${timestamp}

## Description
${need.description}

## Context
${need.context}

\`\`\`hook ${need.description.replace('Missing hook: ', '').replace(/[^a-zA-Z0-9]/g, '')}
description: ${need.description}
methods:
  - initialize
  - cleanup
\`\`\``
    }

    if (need.type === 'page') {
      return `# ${need.description.replace('Missing page: ', '')}

> Auto-generated by Foundation OS Self-Modifying Generator
> Generated: ${timestamp}

## Description
${need.description}

## Context
${need.context}

\`\`\`page ${need.description.replace('Missing page: ', '').replace(/[^a-zA-Z0-9]/g, '')}
description: ${need.description}
void-glass: true
\`\`\``
    }

    // Default documentation template
    return `# ${need.description}

> Auto-generated by Foundation OS Self-Modifying Generator
> Generated: ${timestamp}

## Description
${need.description}

## Context
${need.context}

## Priority
${need.priority}

## Dependencies
${need.dependencies.join(', ') || 'None'}

## Suggested Implementation
${need.suggestedImplementation || 'Implementation details to be determined.'}

## TODO
- [ ] Implement basic functionality
- [ ] Add proper error handling
- [ ] Write tests
- [ ] Update documentation`
  }

  // ── Utility Methods ───────────────────────────────────────────────────

  private findComponentFiles(directory: string): string[] {
    if (!existsSync(directory)) return []

    const files: string[] = []
    const items = readdirSync(directory, { withFileTypes: true })

    for (const item of items) {
      const fullPath = join(directory, item.name)

      if (item.isDirectory()) {
        files.push(...this.findComponentFiles(fullPath))
      } else if (item.name.match(/\.(tsx|jsx)$/)) {
        files.push(fullPath)
      }
    }

    return files
  }

  private findCodeFiles(directory: string): string[] {
    if (!existsSync(directory)) return []

    const files: string[] = []
    const items = readdirSync(directory, { withFileTypes: true })

    for (const item of items) {
      const fullPath = join(directory, item.name)

      if (item.isDirectory()) {
        files.push(...this.findCodeFiles(fullPath))
      } else if (item.name.match(/\.(tsx?|jsx?)$/)) {
        files.push(fullPath)
      }
    }

    return files
  }

  // ── Get Generator Stats ───────────────────────────────────────────────

  getStats() {
    return {
      cacheSizes: this.analysisCache.size,
      generationHistory: this.generationHistory.length,
      lastAnalysis: this.generationHistory[this.generationHistory.length - 1]?.timestamp,
      totalGenerated: this.generationHistory.reduce((sum, plan) => sum + plan.generatedFiles.length, 0)
    }
  }

  // ── Trigger Full Self-Modification Cycle ─────────────────────────────

  async selfModify(scanDirectory: string = '/Users/kevinnoel/foundation-os'): Promise<GenerationPlan> {
    console.log('🧠 Foundation OS initiating self-modification...')

    // Analyze needs
    const needs = await this.analyzeSystemNeeds(scanDirectory)

    // Filter high-priority needs
    const priorityNeeds = needs.filter(need =>
      need.priority === 'high' || need.priority === 'critical'
    )

    console.log(`🎯 Processing ${priorityNeeds.length} high-priority needs`)

    // Generate solutions
    return await this.generateFromNeeds(priorityNeeds, scanDirectory)
  }
}

// ── Singleton Instance ───────────────────────────────────────────────────

export const selfModifyingGenerator = new SelfModifyingGenerator()

export default selfModifyingGenerator