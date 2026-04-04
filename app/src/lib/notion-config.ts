/**
 * notion-config.ts — Notion Integration Configuration
 * Foundation OS Phase 5 "Connected" — Centralized config management
 */

// ── Production Notion Configuration ──────────────────────────────────────

export interface NotionWorkspaceConfig {
  workspaceId: string
  workspaceName: string
  databases: {
    sessions: NotionDatabaseConfig
    decisions: NotionDatabaseConfig
    risks: NotionDatabaseConfig
    nextSteps: NotionDatabaseConfig
    docs: NotionDatabaseConfig
  }
  webhooks: {
    incomingUrl: string
    secret: string
    enabled: boolean
  }
  apiLimits: {
    requestsPerSecond: number
    batchSize: number
    retryAttempts: number
    retryDelay: number
  }
}

export interface NotionDatabaseConfig {
  id: string
  name: string
  schema: string
  properties: NotionPropertyConfig[]
  views: NotionViewConfig[]
  permissions: NotionPermissionConfig
}

export interface NotionPropertyConfig {
  name: string
  type: 'title' | 'rich_text' | 'select' | 'multi_select' | 'date' | 'number' | 'checkbox' | 'relation' | 'rollup' | 'formula'
  options?: string[]
  colors?: Record<string, string>
  format?: string
  formula?: string
  relation?: {
    database: string
    property?: string
  }
}

export interface NotionViewConfig {
  id: string
  name: string
  type: 'table' | 'board' | 'timeline' | 'calendar' | 'list' | 'gallery'
  filters: any[]
  sorts: any[]
  properties: string[]
}

export interface NotionPermissionConfig {
  read: string[]
  write: string[]
  admin: string[]
  public: boolean
}

// ── Foundation OS → Notion Database Schemas ──────────────────────────────

export const notionDatabaseSchemas = {
  sessions: `
    CREATE TABLE Foundation_Sessions (
      "Title" TITLE,
      "Date" DATE,
      "Phase" SELECT(
        'Phase 1: Setup':blue,
        'Phase 2: Core':green,
        'Phase 3: Scale':orange,
        'Phase 4: Smart':purple,
        'Phase 5: Connected':red
      ),
      "Status" SELECT('Active':green, 'Closed':gray),
      "Items" RICH_TEXT,
      "Decisions" RICH_TEXT,
      "Foundation ID" RICH_TEXT,
      "Created At" CREATED_TIME,
      "Last Modified" LAST_EDITED_TIME
    )
  `,

  decisions: `
    CREATE TABLE Foundation_Decisions (
      "Title" TITLE,
      "Date" DATE,
      "Context" RICH_TEXT,
      "Impact" SELECT('High':red, 'Medium':orange, 'Low':green),
      "Status" SELECT(
        'Active':green,
        'Superseded':orange,
        'Deprecated':gray
      ),
      "Session" RELATION('sessions_db_id'),
      "Foundation ID" RICH_TEXT,
      "ADR Number" UNIQUE_ID PREFIX 'ADR',
      "Created At" CREATED_TIME,
      "Last Modified" LAST_EDITED_TIME
    )
  `,

  risks: `
    CREATE TABLE Foundation_Risks (
      "Risk Description" TITLE,
      "Impact" SELECT('High':red, 'Medium':orange, 'Low':green),
      "Probability" SELECT('High':red, 'Medium':orange, 'Low':green),
      "Risk Score" FORMULA('
        if(prop("Impact") == "High" and prop("Probability") == "High", "Critical",
        if(prop("Impact") == "High" or prop("Probability") == "High", "High",
        if(prop("Impact") == "Medium" and prop("Probability") == "Medium", "Medium", "Low")))
      '),
      "Mitigation Strategy" RICH_TEXT,
      "Status" SELECT(
        'Open':red,
        'Mitigated':orange,
        'Closed':green
      ),
      "Owner" PEOPLE,
      "Session" RELATION('sessions_db_id'),
      "Foundation ID" RICH_TEXT,
      "Created At" CREATED_TIME,
      "Due Date" DATE,
      "Last Review" DATE
    )
  `,

  nextSteps: `
    CREATE TABLE Foundation_Next_Steps (
      "Task" TITLE,
      "Phase" SELECT(
        'Phase 1: Setup':blue,
        'Phase 2: Core':green,
        'Phase 3: Scale':orange,
        'Phase 4: Smart':purple,
        'Phase 5: Connected':red
      ),
      "Priority" SELECT(
        'Critical':red,
        'High':orange,
        'Medium':yellow,
        'Low':green
      ),
      "Status" SELECT(
        'To Do':gray,
        'In Progress':blue,
        'Blocked':red,
        'Done':green
      ),
      "Assignee" PEOPLE,
      "Due Date" DATE,
      "Estimated Hours" NUMBER,
      "Actual Hours" NUMBER,
      "Session" RELATION('sessions_db_id'),
      "Dependencies" RELATION('next_steps_db_id', DUAL),
      "Sort Order" NUMBER,
      "Foundation ID" RICH_TEXT,
      "Created At" CREATED_TIME,
      "Completed At" DATE
    )
  `,

  docs: `
    CREATE TABLE Foundation_Docs (
      "Document Name" TITLE,
      "Type" SELECT(
        'Markdown':blue,
        'JSON Config':green,
        'Text':gray,
        'Specification':purple,
        'Architecture':orange
      ),
      "Status" SELECT(
        'Draft':orange,
        'Review':yellow,
        'Published':green,
        'Archived':gray
      ),
      "Content Preview" RICH_TEXT,
      "Knowledge Base" RICH_TEXT,
      "File Size (KB)" NUMBER,
      "Word Count" NUMBER,
      "Session" RELATION('sessions_db_id'),
      "Tags" MULTI_SELECT(
        'documentation':blue,
        'architecture':purple,
        'phase1':blue,
        'phase2':green,
        'phase3':orange,
        'phase4':purple,
        'phase5':red,
        'sync':yellow
      ),
      "Foundation ID" RICH_TEXT,
      "Created At" CREATED_TIME,
      "Last Modified" LAST_EDITED_TIME,
      "Version" NUMBER FORMAT 'decimal'
    )
  `
}

// ── Production Configuration Template ─────────────────────────────────────

export const productionNotionConfig: NotionWorkspaceConfig = {
  workspaceId: 'foundation-os-prod',
  workspaceName: 'Foundation OS - Production',

  databases: {
    sessions: {
      id: '', // To be configured during setup
      name: 'Foundation OS Sessions',
      schema: notionDatabaseSchemas.sessions,
      properties: [
        {
          name: 'Title',
          type: 'title'
        },
        {
          name: 'Date',
          type: 'date'
        },
        {
          name: 'Phase',
          type: 'select',
          options: ['Phase 1: Setup', 'Phase 2: Core', 'Phase 3: Scale', 'Phase 4: Smart', 'Phase 5: Connected'],
          colors: {
            'Phase 1: Setup': 'blue',
            'Phase 2: Core': 'green',
            'Phase 3: Scale': 'orange',
            'Phase 4: Smart': 'purple',
            'Phase 5: Connected': 'red'
          }
        },
        {
          name: 'Status',
          type: 'select',
          options: ['Active', 'Closed'],
          colors: {
            'Active': 'green',
            'Closed': 'gray'
          }
        },
        {
          name: 'Items',
          type: 'rich_text'
        },
        {
          name: 'Decisions',
          type: 'rich_text'
        },
        {
          name: 'Foundation ID',
          type: 'rich_text'
        }
      ],
      views: [
        {
          id: 'active-sessions',
          name: 'Active Sessions',
          type: 'table',
          filters: [{ property: 'Status', select: { equals: 'Active' } }],
          sorts: [{ property: 'Date', direction: 'descending' }],
          properties: ['Title', 'Date', 'Phase', 'Status']
        },
        {
          id: 'phase-5-sessions',
          name: 'Phase 5 Sessions',
          type: 'board',
          filters: [{ property: 'Phase', select: { equals: 'Phase 5: Connected' } }],
          sorts: [{ property: 'Date', direction: 'descending' }],
          properties: ['Title', 'Date', 'Status', 'Items']
        }
      ],
      permissions: {
        read: ['everyone'],
        write: ['admin', 'developer'],
        admin: ['kevin.noel'],
        public: false
      }
    },

    decisions: {
      id: '',
      name: 'Foundation OS Decisions (ADRs)',
      schema: notionDatabaseSchemas.decisions,
      properties: [
        {
          name: 'Title',
          type: 'title'
        },
        {
          name: 'Date',
          type: 'date'
        },
        {
          name: 'Context',
          type: 'rich_text'
        },
        {
          name: 'Impact',
          type: 'select',
          options: ['High', 'Medium', 'Low'],
          colors: {
            'High': 'red',
            'Medium': 'orange',
            'Low': 'green'
          }
        },
        {
          name: 'Status',
          type: 'select',
          options: ['Active', 'Superseded', 'Deprecated'],
          colors: {
            'Active': 'green',
            'Superseded': 'orange',
            'Deprecated': 'gray'
          }
        }
      ],
      views: [
        {
          id: 'active-decisions',
          name: 'Active Decisions',
          type: 'table',
          filters: [{ property: 'Status', select: { equals: 'Active' } }],
          sorts: [{ property: 'Impact', direction: 'ascending' }, { property: 'Date', direction: 'descending' }],
          properties: ['Title', 'Date', 'Impact', 'Status', 'Context']
        },
        {
          id: 'high-impact',
          name: 'High Impact Decisions',
          type: 'list',
          filters: [{ property: 'Impact', select: { equals: 'High' } }],
          sorts: [{ property: 'Date', direction: 'descending' }],
          properties: ['Title', 'Date', 'Status', 'Context']
        }
      ],
      permissions: {
        read: ['everyone'],
        write: ['admin', 'architect'],
        admin: ['kevin.noel'],
        public: true
      }
    },

    risks: {
      id: '',
      name: 'Foundation OS Risk Register',
      schema: notionDatabaseSchemas.risks,
      properties: [
        {
          name: 'Risk Description',
          type: 'title'
        },
        {
          name: 'Impact',
          type: 'select',
          options: ['High', 'Medium', 'Low'],
          colors: {
            'High': 'red',
            'Medium': 'orange',
            'Low': 'green'
          }
        },
        {
          name: 'Probability',
          type: 'select',
          options: ['High', 'Medium', 'Low'],
          colors: {
            'High': 'red',
            'Medium': 'orange',
            'Low': 'green'
          }
        },
        {
          name: 'Risk Score',
          type: 'formula',
          formula: 'if(prop("Impact") == "High" and prop("Probability") == "High", "Critical", if(prop("Impact") == "High" or prop("Probability") == "High", "High", if(prop("Impact") == "Medium" and prop("Probability") == "Medium", "Medium", "Low")))'
        },
        {
          name: 'Status',
          type: 'select',
          options: ['Open', 'Mitigated', 'Closed'],
          colors: {
            'Open': 'red',
            'Mitigated': 'orange',
            'Closed': 'green'
          }
        }
      ],
      views: [
        {
          id: 'critical-risks',
          name: 'Critical & High Risks',
          type: 'table',
          filters: [
            { or: [
              { property: 'Risk Score', formula: { string: { equals: 'Critical' } } },
              { property: 'Risk Score', formula: { string: { equals: 'High' } } }
            ]}
          ],
          sorts: [{ property: 'Risk Score', direction: 'ascending' }],
          properties: ['Risk Description', 'Impact', 'Probability', 'Risk Score', 'Status', 'Owner']
        },
        {
          id: 'open-risks',
          name: 'Open Risks',
          type: 'board',
          filters: [{ property: 'Status', select: { equals: 'Open' } }],
          sorts: [{ property: 'Risk Score', direction: 'ascending' }],
          properties: ['Risk Description', 'Impact', 'Probability', 'Due Date', 'Owner']
        }
      ],
      permissions: {
        read: ['everyone'],
        write: ['admin', 'risk-manager'],
        admin: ['kevin.noel'],
        public: false
      }
    },

    nextSteps: {
      id: '',
      name: 'Foundation OS Roadmap & Tasks',
      schema: notionDatabaseSchemas.nextSteps,
      properties: [
        {
          name: 'Task',
          type: 'title'
        },
        {
          name: 'Phase',
          type: 'select',
          options: ['Phase 1: Setup', 'Phase 2: Core', 'Phase 3: Scale', 'Phase 4: Smart', 'Phase 5: Connected']
        },
        {
          name: 'Priority',
          type: 'select',
          options: ['Critical', 'High', 'Medium', 'Low'],
          colors: {
            'Critical': 'red',
            'High': 'orange',
            'Medium': 'yellow',
            'Low': 'green'
          }
        },
        {
          name: 'Status',
          type: 'select',
          options: ['To Do', 'In Progress', 'Blocked', 'Done'],
          colors: {
            'To Do': 'gray',
            'In Progress': 'blue',
            'Blocked': 'red',
            'Done': 'green'
          }
        }
      ],
      views: [
        {
          id: 'phase-5-roadmap',
          name: 'Phase 5: Connected Roadmap',
          type: 'timeline',
          filters: [{ property: 'Phase', select: { equals: 'Phase 5: Connected' } }],
          sorts: [{ property: 'Priority', direction: 'ascending' }, { property: 'Due Date', direction: 'ascending' }],
          properties: ['Task', 'Priority', 'Status', 'Assignee', 'Due Date', 'Estimated Hours']
        },
        {
          id: 'active-tasks',
          name: 'Active Tasks',
          type: 'board',
          filters: [
            { or: [
              { property: 'Status', select: { equals: 'To Do' } },
              { property: 'Status', select: { equals: 'In Progress' } }
            ]}
          ],
          sorts: [{ property: 'Priority', direction: 'ascending' }],
          properties: ['Task', 'Phase', 'Priority', 'Assignee', 'Due Date']
        }
      ],
      permissions: {
        read: ['everyone'],
        write: ['admin', 'developer', 'project-manager'],
        admin: ['kevin.noel'],
        public: true
      }
    },

    docs: {
      id: '',
      name: 'Foundation OS Documentation',
      schema: notionDatabaseSchemas.docs,
      properties: [
        {
          name: 'Document Name',
          type: 'title'
        },
        {
          name: 'Type',
          type: 'select',
          options: ['Markdown', 'JSON Config', 'Text', 'Specification', 'Architecture'],
          colors: {
            'Markdown': 'blue',
            'JSON Config': 'green',
            'Text': 'gray',
            'Specification': 'purple',
            'Architecture': 'orange'
          }
        },
        {
          name: 'Status',
          type: 'select',
          options: ['Draft', 'Review', 'Published', 'Archived'],
          colors: {
            'Draft': 'orange',
            'Review': 'yellow',
            'Published': 'green',
            'Archived': 'gray'
          }
        },
        {
          name: 'Tags',
          type: 'multi_select',
          options: ['documentation', 'architecture', 'phase1', 'phase2', 'phase3', 'phase4', 'phase5', 'sync']
        }
      ],
      views: [
        {
          id: 'published-docs',
          name: 'Published Documentation',
          type: 'table',
          filters: [{ property: 'Status', select: { equals: 'Published' } }],
          sorts: [{ property: 'Last Modified', direction: 'descending' }],
          properties: ['Document Name', 'Type', 'Status', 'Tags', 'Word Count']
        },
        {
          id: 'architecture-docs',
          name: 'Architecture Documentation',
          type: 'gallery',
          filters: [{ property: 'Type', select: { equals: 'Architecture' } }],
          sorts: [{ property: 'Last Modified', direction: 'descending' }],
          properties: ['Document Name', 'Status', 'Content Preview']
        }
      ],
      permissions: {
        read: ['everyone'],
        write: ['admin', 'developer', 'technical-writer'],
        admin: ['kevin.noel'],
        public: true
      }
    }
  },

  webhooks: {
    incomingUrl: 'https://foundation-os.vercel.app/api/notion/webhook',
    secret: process.env.NOTION_WEBHOOK_SECRET || '',
    enabled: true
  },

  apiLimits: {
    requestsPerSecond: 3, // Notion API limit
    batchSize: 100,
    retryAttempts: 3,
    retryDelay: 1000 // 1 second
  }
}

// ── Development/Testing Configuration ─────────────────────────────────────

export const developmentNotionConfig: NotionWorkspaceConfig = {
  ...productionNotionConfig,
  workspaceId: 'foundation-os-dev',
  workspaceName: 'Foundation OS - Development',
  webhooks: {
    incomingUrl: 'http://localhost:3000/api/notion/webhook',
    secret: 'dev-secret-123',
    enabled: true
  }
}

// ── Configuration Helpers ────────────────────────────────────────────────

export function getNotionConfig(): NotionWorkspaceConfig {
  const isDevelopment = process.env.NODE_ENV === 'development'
  return isDevelopment ? developmentNotionConfig : productionNotionConfig
}

export function validateNotionConfig(config: NotionWorkspaceConfig): boolean {
  // Validate required fields
  if (!config.workspaceId || !config.workspaceName) {
    console.error('❌ Notion config missing workspace info')
    return false
  }

  // Validate database IDs
  const requiredDatabases = ['sessions', 'decisions', 'risks', 'nextSteps', 'docs']
  for (const dbName of requiredDatabases) {
    const db = config.databases[dbName as keyof typeof config.databases]
    if (!db || !db.name || !db.schema) {
      console.error(`❌ Notion config missing database: ${dbName}`)
      return false
    }
  }

  // Validate webhook configuration
  if (config.webhooks.enabled) {
    if (!config.webhooks.incomingUrl || !config.webhooks.secret) {
      console.error('❌ Notion config missing webhook configuration')
      return false
    }
  }

  console.log('✅ Notion configuration validated successfully')
  return true
}

export function generateNotionSetupScript(config: NotionWorkspaceConfig): string {
  return `
# Notion Workspace Setup Script
# Foundation OS Phase 5 "Connected"

## 1. Create Workspace: ${config.workspaceName}

## 2. Create Databases:

${Object.entries(config.databases).map(([_key, db]) => `
### ${db.name}
${db.schema}

**Views:**
${db.views.map(view => `- ${view.name} (${view.type})`).join('\n')}

**Permissions:**
- Read: ${db.permissions.read.join(', ')}
- Write: ${db.permissions.write.join(', ')}
- Admin: ${db.permissions.admin.join(', ')}
- Public: ${db.permissions.public ? 'Yes' : 'No'}

`).join('\n')}

## 3. Configure Webhooks:
- URL: ${config.webhooks.incomingUrl}
- Secret: [REDACTED]
- Enabled: ${config.webhooks.enabled ? 'Yes' : 'No'}

## 4. API Rate Limits:
- Requests/sec: ${config.apiLimits.requestsPerSecond}
- Batch size: ${config.apiLimits.batchSize}
- Retry attempts: ${config.apiLimits.retryAttempts}
- Retry delay: ${config.apiLimits.retryDelay}ms
  `
}

export default {
  productionNotionConfig,
  developmentNotionConfig,
  getNotionConfig,
  validateNotionConfig,
  generateNotionSetupScript,
  notionDatabaseSchemas
}