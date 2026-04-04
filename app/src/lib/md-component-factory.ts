/**
 * md-component-factory.ts - MD-Driven Component Factory for Foundation OS Phase 3
 * Creates new React components automatically from markdown specifications
 * Revolutionary component generation through documentation-driven development
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
// md-template-engine import available if needed for future template processing

// ── Component Factory Types ───────────────────────────────────────────────

interface ComponentSpec {
  name: string
  type: 'ui' | 'layout' | 'form' | 'data' | 'utility' | 'page'
  description: string
  props: ComponentProp[]
  hooks?: string[]
  dependencies?: string[]
  styling: 'void-glass' | 'custom' | 'minimal'
  complexity: 'simple' | 'medium' | 'complex'
  features: ComponentFeature[]
}

interface ComponentProp {
  name: string
  type: string
  required: boolean
  default?: any
  description?: string
}

interface ComponentFeature {
  name: string
  description: string
  implementation?: string
}

interface GenerationResult {
  success: boolean
  componentPath?: string
  storyPath?: string
  testPath?: string
  documentationPath?: string
  errors: string[]
  warnings: string[]
}

// ── MD Component Factory Core ─────────────────────────────────────────────

export class MDComponentFactory {
  private outputDirectory: string
  private generatedComponents: Map<string, GenerationResult> = new Map()

  constructor(outputDirectory: string = '/Users/kevinnoel/foundation-os/app/src') {
    this.outputDirectory = outputDirectory
  }

  // ── Parse Component from Markdown ─────────────────────────────────────

  parseComponentFromMarkdown(markdown: string, componentName?: string): ComponentSpec | null {
    try {
      // Extract component name
      const nameMatch = componentName ||
        markdown.match(/# (\w+)/)?.[1] ||
        markdown.match(/## (\w+) Component/)?.[1]

      if (!nameMatch) {
        throw new Error('Component name not found in markdown')
      }

      // Extract description
      const descMatch = markdown.match(/(?:## Description|> )(.+)/)?.[1] || 'Auto-generated component'

      // Extract component type
      let type: ComponentSpec['type'] = 'ui'
      if (markdown.toLowerCase().includes('layout')) type = 'layout'
      else if (markdown.toLowerCase().includes('form')) type = 'form'
      else if (markdown.toLowerCase().includes('data')) type = 'data'
      else if (markdown.toLowerCase().includes('page')) type = 'page'

      // Extract props
      const props = this.extractPropsFromMarkdown(markdown)

      // Extract hooks
      const hooks = this.extractHooksFromMarkdown(markdown)

      // Extract dependencies
      const dependencies = this.extractDependenciesFromMarkdown(markdown)

      // Extract features
      const features = this.extractFeaturesFromMarkdown(markdown)

      // Determine styling
      let styling: ComponentSpec['styling'] = 'void-glass'
      if (markdown.includes('custom-styling')) styling = 'custom'
      else if (markdown.includes('minimal-styling')) styling = 'minimal'

      // Determine complexity
      let complexity: ComponentSpec['complexity'] = 'medium'
      if (props.length <= 3 && features.length <= 2) complexity = 'simple'
      else if (props.length > 6 || features.length > 5) complexity = 'complex'

      return {
        name: nameMatch,
        type,
        description: descMatch,
        props,
        hooks,
        dependencies,
        styling,
        complexity,
        features
      }
    } catch (error: any) {
      console.error('Error parsing component from markdown:', error.message)
      return null
    }
  }

  // ── Extract Component Data from Markdown ─────────────────────────────

  private extractPropsFromMarkdown(markdown: string): ComponentProp[] {
    const props: ComponentProp[] = []

    // Look for props section
    const propsSection = markdown.match(/## Props\s*\n((?:.*\n)*?)(?=##|$)/)?.[1]
    if (!propsSection) return props

    // Parse prop lines
    const propLines = propsSection
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-') || line.startsWith('*'))

    for (const line of propLines) {
      const propMatch = line.match(/[-*]\s*`?(\w+)`?\s*:\s*`?([^`\s]+)`?(?:\s*-\s*(.+))?/)
      if (propMatch) {
        const [, name, type, description] = propMatch
        props.push({
          name,
          type: type.replace(/\?$/, ''), // Remove optional marker
          required: !type.endsWith('?'),
          description: description?.trim()
        })
      }
    }

    return props
  }

  private extractHooksFromMarkdown(markdown: string): string[] {
    const hooks: string[] = []

    const hooksSection = markdown.match(/## Hooks\s*\n((?:.*\n)*?)(?=##|$)/)?.[1]
    if (!hooksSection) return hooks

    const hookLines = hooksSection
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-') || line.startsWith('*'))

    for (const line of hookLines) {
      const hookMatch = line.match(/[-*]\s*`?(\w+)`?/)
      if (hookMatch) {
        hooks.push(hookMatch[1])
      }
    }

    return hooks
  }

  private extractDependenciesFromMarkdown(markdown: string): string[] {
    const dependencies: string[] = ['react'] // Always include React

    // Look for imports or dependencies sections
    const importMatches = markdown.match(/import.+from ['"]([^'"]+)['"]/g)
    if (importMatches) {
      for (const importMatch of importMatches) {
        const dep = importMatch.match(/from ['"]([^'"]+)['"]/)?.[1]
        if (dep && !dep.startsWith('.') && !dep.startsWith('/')) {
          dependencies.push(dep)
        }
      }
    }

    // Check for specific mentions
    if (markdown.includes('supabase')) dependencies.push('@supabase/supabase-js')
    if (markdown.includes('router')) dependencies.push('react-router-dom')
    if (markdown.includes('form')) dependencies.push('react-hook-form')

    return [...new Set(dependencies)] // Remove duplicates
  }

  private extractFeaturesFromMarkdown(markdown: string): ComponentFeature[] {
    const features: ComponentFeature[] = []

    // Look for features section
    const featuresSection = markdown.match(/## Features\s*\n((?:.*\n)*?)(?=##|$)/)?.[1]
    if (!featuresSection) return features

    const featureLines = featuresSection
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.startsWith('-') || line.startsWith('*'))

    for (const line of featureLines) {
      const featureMatch = line.match(/[-*]\s*(.+?)(?:\s*-\s*(.+))?$/)
      if (featureMatch) {
        const [, name, description] = featureMatch
        features.push({
          name: name.trim(),
          description: description?.trim() || name.trim()
        })
      }
    }

    return features
  }

  // ── Generate Component from Spec ─────────────────────────────────────

  async generateComponent(spec: ComponentSpec): Promise<GenerationResult> {
    const result: GenerationResult = {
      success: false,
      errors: [],
      warnings: []
    }

    try {
      console.log(`🏭 Generating component: ${spec.name}`)

      // Generate component file
      const componentCode = this.generateComponentCode(spec)
      const componentPath = join(this.outputDirectory, 'components', `${spec.name}.tsx`)

      // Ensure directory exists
      mkdirSync(dirname(componentPath), { recursive: true })

      // Write component
      writeFileSync(componentPath, componentCode, 'utf-8')
      result.componentPath = componentPath

      // Generate Storybook story (optional)
      if (spec.complexity !== 'simple') {
        try {
          const storyCode = this.generateStoryCode(spec)
          const storyPath = join(this.outputDirectory, 'stories', `${spec.name}.stories.tsx`)
          mkdirSync(dirname(storyPath), { recursive: true })
          writeFileSync(storyPath, storyCode, 'utf-8')
          result.storyPath = storyPath
        } catch (error: any) {
          result.warnings.push(`Story generation failed: ${error.message}`)
        }
      }

      // Generate test file
      try {
        const testCode = this.generateTestCode(spec)
        const testPath = join(this.outputDirectory, '__tests__', `${spec.name}.test.tsx`)
        mkdirSync(dirname(testPath), { recursive: true })
        writeFileSync(testPath, testCode, 'utf-8')
        result.testPath = testPath
      } catch (error: any) {
        result.warnings.push(`Test generation failed: ${error.message}`)
      }

      // Generate documentation
      try {
        const docCode = this.generateDocumentationMarkdown(spec)
        const docPath = join(this.outputDirectory, 'components', `${spec.name}.md`)
        writeFileSync(docPath, docCode, 'utf-8')
        result.documentationPath = docPath
      } catch (error: any) {
        result.warnings.push(`Documentation generation failed: ${error.message}`)
      }

      result.success = true
      this.generatedComponents.set(spec.name, result)

      console.log(`✅ Component generated: ${spec.name}`)

    } catch (error: any) {
      result.errors.push(error.message)
      console.error(`❌ Component generation failed for ${spec.name}:`, error.message)
    }

    return result
  }

  // ── Generate Component Code ──────────────────────────────────────────

  private generateComponentCode(spec: ComponentSpec): string {
    const { name, description, props, hooks, dependencies, styling } = spec

    // Generate imports
    const imports = ['React']
    if (hooks && hooks.length > 0) {
      const reactHooks = hooks.filter(h => ['useState', 'useEffect', 'useCallback', 'useMemo'].includes(h))
      if (reactHooks.length > 0) {
        imports.push(`{ ${reactHooks.join(', ')} }`)
      }
    }

    const importStatements = [
      `import ${imports.join(', ')} from 'react'`,
      ...(dependencies || [])
        .filter(dep => dep !== 'react')
        .map(dep => `import ${dep}`)
    ].join('\n')

    // Generate interface
    const propsInterface = props.length > 0 ? `
interface ${name}Props {
${props.map(prop =>
  `  ${prop.name}${prop.required ? '' : '?'}: ${prop.type}${prop.description ? ` // ${prop.description}` : ''}`
).join('\n')}
}` : ''

    // Generate component body
    const componentBody = this.generateComponentBody(spec)

    // Generate Void Glass styles if applicable
    const voidGlassStyles = styling === 'void-glass' ? `
  const styles = {
    container: "bg-[#06070C] text-white font-['Figtree']",
    primary: "text-[#5EEAD4]",
    secondary: "text-gray-400 font-['JetBrains_Mono']",
    border: "border-gray-700",
    hover: "hover:border-[#5EEAD4] transition-colors"
  }` : ''

    return `/**
 * ${name}.tsx - ${description}
 * Auto-generated by Foundation OS MD Component Factory
 * Type: ${spec.type} | Complexity: ${spec.complexity} | Styling: ${styling}
 */

${importStatements}
${propsInterface}

export const ${name}: React.FC${props.length > 0 ? `<${name}Props>` : ''} = (${
      props.length > 0 ? `{
  ${props.map(prop =>
    prop.default ? `${prop.name} = ${JSON.stringify(prop.default)}` : prop.name
  ).join(',\n  ')}
}` : ''
    }) => {${voidGlassStyles}

${componentBody}
}

export default ${name}`
  }

  private generateComponentBody(spec: ComponentSpec): string {
    const { name, type, features, styling } = spec

    // Initialize hooks if needed
    const hookInits = (spec.hooks || []).map(hook => {
      if (hook === 'useState') return '  const [state, setState] = useState(null)'
      if (hook === 'useEffect') return '  useEffect(() => {\n    // Component initialization\n  }, [])'
      return `  // TODO: Implement ${hook}`
    }).join('\n')

    // Generate feature implementations
    const featureImplementations = features.map(feature =>
      `  // Feature: ${feature.name}\n  // ${feature.description}`
    ).join('\n\n')

    // Generate return JSX based on type
    let jsx = ''

    if (type === 'layout') {
      jsx = `    <div className="${styling === 'void-glass' ? 'min-h-screen bg-[#06070C] text-white' : ''} ${name.toLowerCase()}-layout">
      {/* Layout Header */}
      <header className="${styling === 'void-glass' ? 'border-b border-gray-700 p-6' : ''}">
        <h1 className="${styling === 'void-glass' ? "text-[#5EEAD4] text-2xl font-['Figtree']" : ''}">
          ${name} Layout
        </h1>
      </header>

      {/* Layout Content */}
      <main className="${styling === 'void-glass' ? 'p-6' : ''}">
        {children || <div>Content area</div>}
      </main>
    </div>`
    } else if (type === 'form') {
      jsx = `    <form className="${styling === 'void-glass' ? 'bg-black/20 border border-gray-700 rounded-lg p-6' : ''} ${name.toLowerCase()}-form">
      <h2 className="${styling === 'void-glass' ? "text-[#5EEAD4] text-xl font-['Figtree'] mb-4" : ''}">
        ${name} Form
      </h2>

      {/* Form fields will be generated based on props */}
      <div className="space-y-4">
        <div>
          <label className="${styling === 'void-glass' ? "block text-gray-300 mb-1 font-['Figtree']" : ''}">
            Input Field
          </label>
          <input
            type="text"
            className="${styling === 'void-glass' ? 'w-full px-3 py-2 bg-black/30 border border-gray-700 rounded text-white' : ''}"
            placeholder="Enter value..."
          />
        </div>
      </div>

      <button
        type="submit"
        className="${styling === 'void-glass' ? 'mt-6 px-6 py-2 bg-[#5EEAD4] text-[#06070C] rounded font-medium hover:bg-[#4FD1C7] transition-colors' : ''}"
      >
        Submit
      </button>
    </form>`
    } else {
      jsx = `    <div className="${styling === 'void-glass' ? 'bg-black/20 border border-gray-700 rounded-lg p-6' : ''} ${name.toLowerCase()}-component">
      <h3 className="${styling === 'void-glass' ? "text-[#5EEAD4] font-['Figtree'] mb-2" : ''}">
        ${name}
      </h3>
      <p className="${styling === 'void-glass' ? "text-gray-300 font-['JetBrains_Mono'] text-sm" : ''}">
        ${spec.description}
      </p>

      {/* Component features */}
      <div className="mt-4 space-y-2">
        ${features.map(feature =>
          `<div className="${styling === 'void-glass' ? 'text-gray-400 text-sm' : ''}">\n          ${feature.name}\n        </div>`
        ).join('\n        ')}
      </div>
    </div>`
    }

    return `${hookInits}

${featureImplementations}

  return (
${jsx}
  )`
  }

  // ── Generate Supporting Files ────────────────────────────────────────

  private generateStoryCode(spec: ComponentSpec): string {
    return `/**
 * ${spec.name}.stories.tsx - Storybook stories
 * Auto-generated by Foundation OS MD Component Factory
 */

import type { Meta, StoryObj } from '@storybook/react'
import { ${spec.name} } from '../components/${spec.name}'

const meta: Meta<typeof ${spec.name}> = {
  title: 'Components/${spec.name}',
  component: ${spec.name},
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    ${spec.props.map(prop =>
      `${prop.name}: ${prop.default ? JSON.stringify(prop.default) :
        prop.type === 'string' ? `'Sample ${prop.name}'` :
        prop.type === 'number' ? '42' :
        prop.type === 'boolean' ? 'true' :
        'undefined'
      }`
    ).join(',\n    ')}
  },
}

export const Interactive: Story = {
  args: {
    ...Default.args,
  },
}`
  }

  private generateTestCode(spec: ComponentSpec): string {
    return `/**
 * ${spec.name}.test.tsx - Component tests
 * Auto-generated by Foundation OS MD Component Factory
 */

import { render, screen } from '@testing-library/react'
import { ${spec.name} } from '../components/${spec.name}'

describe('${spec.name}', () => {
  it('renders successfully', () => {
    render(<${spec.name}${spec.props.length > 0 ? ` ${spec.props.filter(p => p.required).map(p => `${p.name}="test"`).join(' ')}` : ''} />)
    expect(screen.getByText('${spec.name}')).toBeInTheDocument()
  })

  ${spec.features.map(feature => `
  it('implements ${feature.name}', () => {
    // TODO: Test ${feature.description}
  })`).join('\n')}
})`
  }

  private generateDocumentationMarkdown(spec: ComponentSpec): string {
    return `# ${spec.name}

> ${spec.description}
> Auto-generated by Foundation OS MD Component Factory

## Overview

The ${spec.name} component is a ${spec.complexity} ${spec.type} component with ${spec.styling} styling.

## Props

${spec.props.length > 0 ?
  spec.props.map(prop =>
    `- \`${prop.name}\`: \`${prop.type}\` ${prop.required ? '(required)' : '(optional)'} ${prop.description ? `- ${prop.description}` : ''}`
  ).join('\n') :
  'This component has no props.'
}

## Features

${spec.features.length > 0 ?
  spec.features.map(feature => `- **${feature.name}**: ${feature.description}`).join('\n') :
  'No special features.'
}

## Usage

\`\`\`tsx
import { ${spec.name} } from './components/${spec.name}'

function App() {
  return (
    <${spec.name}${spec.props.filter(p => p.required).length > 0 ?
      `\n      ${spec.props.filter(p => p.required).map(p =>
        `${p.name}="${p.type === 'string' ? 'example' : 'value'}"`
      ).join('\n      ')}\n    ` : ' '
    }/>
  )
}
\`\`\`

## Dependencies

${(spec.dependencies || []).map(dep => `- ${dep}`).join('\n')}

---

*Generated by Foundation OS MD Component Factory v3.0*`
  }

  // ── Batch Component Generation ───────────────────────────────────────

  async generateFromMarkdownFile(filePath: string): Promise<GenerationResult[]> {
    const { readFileSync } = require('fs')

    if (!existsSync(filePath)) {
      throw new Error(`Markdown file not found: ${filePath}`)
    }

    const content = readFileSync(filePath, 'utf-8')
    const results: GenerationResult[] = []

    // Look for multiple component specs in one file
    const componentSections = content.split(/^# /m).filter((section: string) => section.trim())

    for (const section of componentSections) {
      const spec = this.parseComponentFromMarkdown('# ' + section)
      if (spec) {
        const result = await this.generateComponent(spec)
        results.push(result)
      }
    }

    return results
  }

  async generateFromSpecs(specs: ComponentSpec[]): Promise<GenerationResult[]> {
    const results: GenerationResult[] = []

    for (const spec of specs) {
      const result = await this.generateComponent(spec)
      results.push(result)
    }

    return results
  }

  // ── Factory Statistics ──────────────────────────────────────────────

  getStats() {
    const results = Array.from(this.generatedComponents.values())
    return {
      totalGenerated: results.length,
      successful: results.filter(r => r.success).length,
      withTests: results.filter(r => r.testPath).length,
      withStories: results.filter(r => r.storyPath).length,
      withDocs: results.filter(r => r.documentationPath).length,
      totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0),
      totalWarnings: results.reduce((sum, r) => sum + r.warnings.length, 0)
    }
  }
}

// ── Singleton Instance ───────────────────────────────────────────────────

export const mdComponentFactory = new MDComponentFactory()

export default mdComponentFactory