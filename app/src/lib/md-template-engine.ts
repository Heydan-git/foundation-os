/**
 * md-template-engine.ts - MD Template Engine for Foundation OS Phase 3
 * Self-Modifying Architecture: Generate code from markdown templates
 * Foundation OS can create its own components by writing documentation
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname, basename } from 'path'
import { mkdirSync } from 'fs'

// ── Template Types ─────────────────────────────────────────────────────────

interface TemplateContext {
  name: string
  description?: string
  props?: Record<string, any>
  hooks?: string[]
  imports?: string[]
  methods?: string[]
  voidGlassCompliant?: boolean
  [key: string]: any
}

interface CodeTemplate {
  id: string
  name: string
  pattern: RegExp
  generator: (context: TemplateContext) => string
  outputPath: (context: TemplateContext) => string
  dependencies?: string[]
}

// ── Built-in Templates ─────────────────────────────────────────────────────

export const BUILTIN_TEMPLATES: CodeTemplate[] = [
  {
    id: 'react-component',
    name: 'React Component Template',
    pattern: /```component\s+(\w+)\s*\n([\s\S]*?)\n```/g,
    generator: (ctx) => generateReactComponent(ctx),
    outputPath: (ctx) => `src/components/${ctx.name}.tsx`,
    dependencies: ['react']
  },
  {
    id: 'react-hook',
    name: 'React Hook Template',
    pattern: /```hook\s+(\w+)\s*\n([\s\S]*?)\n```/g,
    generator: (ctx) => generateReactHook(ctx),
    outputPath: (ctx) => `src/hooks/${ctx.name}.ts`,
    dependencies: ['react']
  },
  {
    id: 'data-types',
    name: 'TypeScript Types Template',
    pattern: /```types\s+(\w+)\s*\n([\s\S]*?)\n```/g,
    generator: (ctx) => generateTypeDefinitions(ctx),
    outputPath: (ctx) => `src/types/${ctx.name}.ts`
  },
  {
    id: 'api-endpoint',
    name: 'API Endpoint Template',
    pattern: /```api\s+(\w+)\s*\n([\s\S]*?)\n```/g,
    generator: (ctx) => generateAPIEndpoint(ctx),
    outputPath: (ctx) => `src/api/${ctx.name}.ts`,
    dependencies: ['supabase']
  },
  {
    id: 'void-glass-page',
    name: 'Void Glass Page Template',
    pattern: /```page\s+(\w+)\s*\n([\s\S]*?)\n```/g,
    generator: (ctx) => generateVoidGlassPage(ctx),
    outputPath: (ctx) => `src/pages/${ctx.name}Page.tsx`,
    dependencies: ['react', 'void-glass']
  }
]

// ── Template Engine Core ─────────────────────────────────────────────────

export class MDTemplateEngine {
  private templates: Map<string, CodeTemplate> = new Map()
  private generatedFiles: Set<string> = new Set()

  constructor() {
    // Register built-in templates
    BUILTIN_TEMPLATES.forEach(template => {
      this.templates.set(template.id, template)
    })
  }

  // ── Register Custom Template ─────────────────────────────────────────

  registerTemplate(template: CodeTemplate): void {
    this.templates.set(template.id, template)
    console.log(`📝 Registered template: ${template.name}`)
  }

  // ── Parse MD File for Templates ─────────────────────────────────────

  parseMarkdownFile(filePath: string): TemplateContext[] {
    if (!existsSync(filePath)) {
      throw new Error(`MD file not found: ${filePath}`)
    }

    const content = readFileSync(filePath, 'utf-8')
    const contexts: TemplateContext[] = []

    // Process each registered template
    for (const template of this.templates.values()) {
      const matches = Array.from(content.matchAll(template.pattern))

      for (const match of matches) {
        const context = this.extractContextFromMatch(match, template)
        if (context) {
          contexts.push(context)
        }
      }
    }

    return contexts
  }

  // ── Extract Context from Regex Match ───────────────────────────────

  private extractContextFromMatch(match: RegExpMatchArray, template: CodeTemplate): TemplateContext | null {
    const [_fullMatch, name, content] = match

    if (!name || !content) return null

    // Parse the content block for properties
    const context: TemplateContext = { name }

    // Extract description
    const descMatch = content.match(/description:\s*(.+)/i)
    if (descMatch) context.description = descMatch[1].trim()

    // Extract props
    const propsMatch = content.match(/props:\s*\n((?:\s*-\s*.+\n)*)/i)
    if (propsMatch) {
      context.props = this.parsePropsFromList(propsMatch[1])
    }

    // Extract hooks
    const hooksMatch = content.match(/hooks:\s*\n((?:\s*-\s*.+\n)*)/i)
    if (hooksMatch) {
      context.hooks = this.parseListItems(hooksMatch[1])
    }

    // Extract imports
    const importsMatch = content.match(/imports:\s*\n((?:\s*-\s*.+\n)*)/i)
    if (importsMatch) {
      context.imports = this.parseListItems(importsMatch[1])
    }

    // Extract methods
    const methodsMatch = content.match(/methods:\s*\n((?:\s*-\s*.+\n)*)/i)
    if (methodsMatch) {
      context.methods = this.parseListItems(methodsMatch[1])
    }

    // Void Glass compliance
    context.voidGlassCompliant = content.includes('void-glass: true') || template.dependencies?.includes('void-glass')

    // Template-specific context
    context.templateId = template.id
    context.templateName = template.name

    return context
  }

  // ── Parse List Items from MD ─────────────────────────────────────────

  private parseListItems(listContent: string): string[] {
    return listContent
      .split('\n')
      .map(line => line.replace(/^\s*-\s*/, '').trim())
      .filter(line => line.length > 0)
  }

  private parsePropsFromList(listContent: string): Record<string, any> {
    const props: Record<string, any> = {}
    const lines = this.parseListItems(listContent)

    for (const line of lines) {
      const [name, type, ...rest] = line.split(':').map(s => s.trim())
      if (name && type) {
        props[name] = {
          type,
          description: rest.join(':').trim() || undefined
        }
      }
    }

    return props
  }

  // ── Generate Code from Contexts ─────────────────────────────────────

  generateFromContexts(contexts: TemplateContext[], outputDir: string = '.'): string[] {
    const generatedFiles: string[] = []

    for (const context of contexts) {
      const template = this.templates.get(context.templateId!)
      if (!template) continue

      try {
        // Generate code
        const code = template.generator(context)

        // Determine output path
        const relativePath = template.outputPath(context)
        const fullPath = join(outputDir, relativePath)

        // Ensure directory exists
        mkdirSync(dirname(fullPath), { recursive: true })

        // Write file
        writeFileSync(fullPath, code, 'utf-8')

        generatedFiles.push(fullPath)
        this.generatedFiles.add(fullPath)

        console.log(`✅ Generated: ${relativePath}`)
      } catch (error) {
        console.error(`❌ Error generating ${context.name}:`, error)
      }
    }

    return generatedFiles
  }

  // ── Process MD File End-to-End ─────────────────────────────────────

  processMarkdownFile(mdFilePath: string, outputDir: string = '.'): string[] {
    console.log(`🔄 Processing MD file: ${basename(mdFilePath)}`)

    const contexts = this.parseMarkdownFile(mdFilePath)
    console.log(`📋 Found ${contexts.length} template contexts`)

    return this.generateFromContexts(contexts, outputDir)
  }

  // ── Batch Process Multiple Files ──────────────────────────────────

  processDirectory(mdDirectory: string, outputDir: string = '.'): string[] {
    const { readdirSync } = require('fs')
    const files = readdirSync(mdDirectory).filter((f: string) => f.endsWith('.md'))

    const allGeneratedFiles: string[] = []

    for (const file of files) {
      const filePath = join(mdDirectory, file)
      const generated = this.processMarkdownFile(filePath, outputDir)
      allGeneratedFiles.push(...generated)
    }

    return allGeneratedFiles
  }

  // ── Get Generation Stats ────────────────────────────────────────────

  getStats() {
    return {
      registeredTemplates: this.templates.size,
      generatedFiles: this.generatedFiles.size,
      templates: Array.from(this.templates.values()).map(t => ({
        id: t.id,
        name: t.name,
        dependencies: t.dependencies || []
      }))
    }
  }
}

// ── Template Generators ───────────────────────────────────────────────────

function generateReactComponent(ctx: TemplateContext): string {
  const { name, description, props = {}, imports = [], methods = [], voidGlassCompliant } = ctx

  const propTypes = Object.entries(props)
    .map(([key, prop]: [string, any]) => `  ${key}: ${prop.type}`)
    .join('\n')

  const propDefaults = Object.entries(props)
    .filter(([, prop]: [string, any]) => prop.default)
    .map(([key, prop]: [string, any]) => `  ${key} = ${prop.default}`)
    .join(',\n')

  const customImports = imports.map(imp => `import ${imp}`).join('\n')

  const componentMethods = methods.map(method =>
    `  const ${method} = () => {\n    // TODO: Implement ${method}\n  }`
  ).join('\n\n')

  const voidGlassStyles = voidGlassCompliant ? `
  const styles = {
    container: "bg-[#06070C] text-white min-h-screen font-['Figtree']",
    primary: "text-[#5EEAD4]",
    secondary: "text-gray-400 font-['JetBrains_Mono']"
  }` : ''

  return `/**
 * ${name}.tsx - ${description || `Generated component ${name}`}
 * Auto-generated by Foundation OS MD Template Engine
 * ${voidGlassCompliant ? 'Void Glass Design System Compliant' : ''}
 */

import React from 'react'
${customImports}

interface ${name}Props {
${propTypes}
}

export const ${name}: React.FC<${name}Props> = ({
${propDefaults}
}) => {${voidGlassStyles}

${componentMethods}

  return (
    <div className="${voidGlassCompliant ? 'bg-[#06070C] text-white' : ''}">
      <h1 className="${voidGlassCompliant ? "text-[#5EEAD4] font-['Figtree']" : ''}">
        ${name}
      </h1>
      {/* TODO: Implement component content */}
    </div>
  )
}

export default ${name}`
}

function generateReactHook(ctx: TemplateContext): string {
  const { name, description, methods = [], imports = [] } = ctx

  const customImports = imports.map(imp => `import ${imp}`).join('\n')
  const hookMethods = methods.map(method =>
    `  const ${method} = () => {\n    // TODO: Implement ${method}\n  }`
  ).join('\n\n')

  const returnStatement = methods.length > 0
    ? `  return {\n    ${methods.join(',\n    ')}\n  }`
    : '  return {}'

  return `/**
 * ${name}.ts - ${description || `Generated hook ${name}`}
 * Auto-generated by Foundation OS MD Template Engine
 */

import { useState, useEffect } from 'react'
${customImports}

export const ${name} = () => {
  const [state, setState] = useState<any>(null)

${hookMethods}

${returnStatement}
}

export default ${name}`
}

function generateTypeDefinitions(ctx: TemplateContext): string {
  const { name, description, props = {} } = ctx

  const typeDefinition = Object.entries(props)
    .map(([key, prop]: [string, any]) => `  ${key}: ${prop.type}${prop.description ? ` // ${prop.description}` : ''}`)
    .join('\n')

  return `/**
 * ${name}.ts - ${description || `Generated types ${name}`}
 * Auto-generated by Foundation OS MD Template Engine
 */

export interface ${name} {
${typeDefinition}
}

export default ${name}`
}

function generateAPIEndpoint(ctx: TemplateContext): string {
  const { name, description, methods = [] } = ctx

  const apiMethods = methods.map(method => `
export const ${method} = async () => {
  try {
    // TODO: Implement ${method}
    return { success: true }
  } catch (error) {
    console.error('${method} error:', error)
    return { success: false, error }
  }
}`).join('\n')

  return `/**
 * ${name}.ts - ${description || `Generated API ${name}`}
 * Auto-generated by Foundation OS MD Template Engine
 */

import { supabase } from '../lib/supabase'

${apiMethods}

export default {
  ${methods.join(',\n  ')}
}`
}

function generateVoidGlassPage(ctx: TemplateContext): string {
  const { name, description } = ctx

  return `/**
 * ${name}Page.tsx - ${description || `Generated page ${name}`}
 * Auto-generated by Foundation OS MD Template Engine
 * Void Glass Design System Compliant
 */

import React from 'react'

export const ${name}Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#06070C] text-white p-8">
      {/* Background orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-[#5EEAD4] rounded-full filter blur-3xl opacity-10 -top-20 -right-20 animate-pulse" />
        <div className="absolute w-64 h-64 bg-[#A78BFA] rounded-full filter blur-3xl opacity-10 bottom-20 -left-20 animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold text-[#5EEAD4] mb-4 font-['Figtree']">
            ${name}
          </h1>
          <p className="text-gray-400 text-lg font-['JetBrains_Mono']">
            ${description || `Foundation OS ${name} Page`}
          </p>
        </header>

        <main>
          {/* TODO: Implement page content */}
          <div className="bg-black/20 border border-gray-700 rounded-lg p-6">
            <p className="text-gray-300">
              Page content will be implemented here.
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ${name}Page`
}

// ── Singleton Instance ───────────────────────────────────────────────────

export const mdTemplateEngine = new MDTemplateEngine()

// ── Export for direct usage ──────────────────────────────────────────────

export default mdTemplateEngine