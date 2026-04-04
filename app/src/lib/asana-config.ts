/**
 * asana-config.ts — Foundation OS Phase 5 "Connected"
 * Asana Configuration Management & Database Schemas
 * Production + Development workspace configurations
 */

// ── Asana Workspace Configuration ────────────────────────────────────────────

export interface AsanaWorkspaceConfig {
  workspaceId: string
  workspaceName: string
  environment: 'development' | 'staging' | 'production'
  apiVersion: string
  baseUrl: string
}

export const asanaWorkspaceConfigs: Record<string, AsanaWorkspaceConfig> = {
  development: {
    workspaceId: 'foundation-os-dev',
    workspaceName: 'Foundation OS Development',
    environment: 'development',
    apiVersion: '1.0',
    baseUrl: 'https://app.asana.com/api/1.0'
  },
  staging: {
    workspaceId: 'foundation-os-staging',
    workspaceName: 'Foundation OS Staging',
    environment: 'staging',
    apiVersion: '1.0',
    baseUrl: 'https://app.asana.com/api/1.0'
  },
  production: {
    workspaceId: 'foundation-os-prod',
    workspaceName: 'Foundation OS Production',
    environment: 'production',
    apiVersion: '1.0',
    baseUrl: 'https://app.asana.com/api/1.0'
  }
}

// ── Team Configurations ──────────────────────────────────────────────────────

export interface AsanaTeamConfig {
  teamId: string
  name: string
  description: string
  defaultAssignees: string[]
  permissions: {
    createProjects: boolean
    manageTasks: boolean
    viewReports: boolean
  }
}

export const asanaTeamConfigs: Record<string, AsanaTeamConfig> = {
  architecture: {
    teamId: 'team-architecture',
    name: 'Architecture Team',
    description: 'System architecture, ADRs, and technical decisions',
    defaultAssignees: ['architect-lead', 'senior-architect'],
    permissions: {
      createProjects: true,
      manageTasks: true,
      viewReports: true
    }
  },
  development: {
    teamId: 'team-development',
    name: 'Development Team',
    description: 'Feature development and implementation',
    defaultAssignees: ['dev-lead', 'senior-dev'],
    permissions: {
      createProjects: true,
      manageTasks: true,
      viewReports: true
    }
  },
  qa: {
    teamId: 'team-qa',
    name: 'Quality Assurance',
    description: 'Testing, validation, and quality control',
    defaultAssignees: ['qa-lead', 'senior-qa'],
    permissions: {
      createProjects: false,
      manageTasks: true,
      viewReports: true
    }
  },
  documentation: {
    teamId: 'team-docs',
    name: 'Documentation Team',
    description: 'Documentation, knowledge base, and training',
    defaultAssignees: ['doc-lead', 'technical-writer'],
    permissions: {
      createProjects: false,
      manageTasks: true,
      viewReports: false
    }
  }
}

// ── Project Templates ────────────────────────────────────────────────────────

export interface AsanaProjectTemplate {
  templateId: string
  name: string
  description: string
  sections: AsanaProjectSection[]
  customFields: AsanaCustomField[]
  defaultAssignees: string[]
}

export interface AsanaProjectSection {
  name: string
  description?: string
  tasks?: AsanaTaskTemplate[]
}

export interface AsanaTaskTemplate {
  name: string
  description?: string
  assignee?: string
  dueOffset?: number // Days from project start
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  dependencies?: string[]
}

export interface AsanaCustomField {
  name: string
  type: 'text' | 'number' | 'select' | 'multi_select' | 'date' | 'people'
  options?: Array<{
    name: string
    color?: string
    enabled?: boolean
  }>
  isRequired?: boolean
  description?: string
}

export const asanaProjectTemplates: Record<string, AsanaProjectTemplate> = {
  phase: {
    templateId: 'template-phase',
    name: 'Foundation OS Phase',
    description: 'Template for Foundation OS development phases',
    sections: [
      {
        name: '📋 Planning',
        description: 'Phase planning and requirements',
        tasks: [
          {
            name: 'Phase Requirements Analysis',
            description: 'Analyze and document phase requirements',
            priority: 'high',
            dueOffset: 3
          },
          {
            name: 'Architecture Design Review',
            description: 'Review and approve architecture design',
            priority: 'high',
            dueOffset: 7
          }
        ]
      },
      {
        name: '🚀 Development',
        description: 'Implementation and development tasks',
        tasks: [
          {
            name: 'Core Implementation',
            description: 'Implement core phase features',
            priority: 'high',
            dueOffset: 14
          },
          {
            name: 'Integration Testing',
            description: 'Test integrations with existing systems',
            priority: 'medium',
            dueOffset: 21
          }
        ]
      },
      {
        name: '🧪 Testing',
        description: 'Quality assurance and validation',
        tasks: [
          {
            name: 'Automated Testing Suite',
            description: 'Create and run automated tests',
            priority: 'high',
            dueOffset: 18
          },
          {
            name: 'User Acceptance Testing',
            description: 'Conduct user acceptance testing',
            priority: 'medium',
            dueOffset: 25
          }
        ]
      },
      {
        name: '📦 Deployment',
        description: 'Release and deployment',
        tasks: [
          {
            name: 'Production Deployment',
            description: 'Deploy to production environment',
            priority: 'urgent',
            dueOffset: 28
          },
          {
            name: 'Post-Deployment Monitoring',
            description: 'Monitor system after deployment',
            priority: 'high',
            dueOffset: 30
          }
        ]
      }
    ],
    customFields: [
      {
        name: 'Phase',
        type: 'select',
        isRequired: true,
        options: [
          { name: 'Phase 01 - Setup', color: 'blue' },
          { name: 'Phase 02 - Foundation', color: 'green' },
          { name: 'Phase 03 - Core', color: 'orange' },
          { name: 'Phase 04 - Smart', color: 'red' },
          { name: 'Phase 05 - Connected', color: 'purple' }
        ]
      },
      {
        name: 'Priority Level',
        type: 'select',
        isRequired: true,
        options: [
          { name: 'Critical', color: 'red' },
          { name: 'High', color: 'orange' },
          { name: 'Medium', color: 'yellow' },
          { name: 'Low', color: 'green' }
        ]
      },
      {
        name: 'Foundation ID',
        type: 'text',
        isRequired: false,
        description: 'Original Foundation OS entity ID'
      }
    ],
    defaultAssignees: ['project-manager', 'tech-lead']
  },

  session: {
    templateId: 'template-session',
    name: 'Foundation OS Session',
    description: 'Template for Foundation OS working sessions',
    sections: [
      {
        name: '🎯 Session Goals',
        description: 'Objectives and expected outcomes'
      },
      {
        name: '📝 Action Items',
        description: 'Tasks and follow-up actions'
      },
      {
        name: '🔍 Decisions Made',
        description: 'Key decisions and ADRs'
      },
      {
        name: '⚡ Next Steps',
        description: 'Immediate next actions'
      }
    ],
    customFields: [
      {
        name: 'Session Date',
        type: 'date',
        isRequired: true
      },
      {
        name: 'Session Phase',
        type: 'select',
        isRequired: true,
        options: [
          { name: 'Phase 01', color: 'blue' },
          { name: 'Phase 02', color: 'green' },
          { name: 'Phase 03', color: 'orange' },
          { name: 'Phase 04', color: 'red' },
          { name: 'Phase 05', color: 'purple' }
        ]
      },
      {
        name: 'Session Status',
        type: 'select',
        isRequired: true,
        options: [
          { name: 'Active', color: 'green' },
          { name: 'Completed', color: 'blue' },
          { name: 'On Hold', color: 'yellow' },
          { name: 'Cancelled', color: 'red' }
        ]
      }
    ],
    defaultAssignees: ['session-lead']
  },

  milestone: {
    templateId: 'template-milestone',
    name: 'Foundation OS Milestone',
    description: 'Template for tracking key milestones and ADRs',
    sections: [
      {
        name: '📍 Milestone Definition',
        description: 'Clear definition and success criteria'
      },
      {
        name: '🎯 Implementation Tasks',
        description: 'Tasks required to achieve milestone'
      },
      {
        name: '📊 Progress Tracking',
        description: 'Progress monitoring and metrics'
      },
      {
        name: '✅ Validation',
        description: 'Validation and sign-off tasks'
      }
    ],
    customFields: [
      {
        name: 'Milestone Type',
        type: 'select',
        isRequired: true,
        options: [
          { name: 'ADR Implementation', color: 'blue' },
          { name: 'Phase Completion', color: 'green' },
          { name: 'Feature Release', color: 'purple' },
          { name: 'Integration Complete', color: 'orange' }
        ]
      },
      {
        name: 'Impact Level',
        type: 'select',
        isRequired: true,
        options: [
          { name: 'Critical', color: 'red' },
          { name: 'High', color: 'orange' },
          { name: 'Medium', color: 'yellow' },
          { name: 'Low', color: 'green' }
        ]
      },
      {
        name: 'Target Date',
        type: 'date',
        isRequired: false
      },
      {
        name: 'Progress Percentage',
        type: 'number',
        isRequired: false,
        description: 'Completion percentage (0-100)'
      }
    ],
    defaultAssignees: ['milestone-owner']
  }
}

// ── Automation Rules Configuration ───────────────────────────────────────────

export interface AsanaAutomationRule {
  id: string
  name: string
  description: string
  trigger: {
    type: 'task_created' | 'task_completed' | 'project_created' | 'custom_field_changed'
    conditions: Record<string, any>
  }
  actions: Array<{
    type: 'assign_task' | 'update_status' | 'create_subtask' | 'send_notification'
    parameters: Record<string, any>
  }>
  enabled: boolean
}

export const asanaAutomationRules: AsanaAutomationRule[] = [
  {
    id: 'auto-assign-high-priority',
    name: 'Auto-assign High Priority Tasks',
    description: 'Automatically assign high priority tasks to team leads',
    trigger: {
      type: 'task_created',
      conditions: {
        priority: 'high',
        assignee: null
      }
    },
    actions: [
      {
        type: 'assign_task',
        parameters: {
          assignee: 'team-lead',
          notify: true
        }
      }
    ],
    enabled: true
  },
  {
    id: 'milestone-progress-update',
    name: 'Update Milestone Progress',
    description: 'Update milestone progress when subtasks are completed',
    trigger: {
      type: 'task_completed',
      conditions: {
        parent_task_type: 'milestone'
      }
    },
    actions: [
      {
        type: 'update_status',
        parameters: {
          field: 'progress_percentage',
          calculation: 'completed_subtasks_percentage'
        }
      }
    ],
    enabled: true
  },
  {
    id: 'risk-escalation',
    name: 'Risk Escalation',
    description: 'Escalate high-impact risks to architecture team',
    trigger: {
      type: 'custom_field_changed',
      conditions: {
        field: 'impact_level',
        value: 'critical'
      }
    },
    actions: [
      {
        type: 'assign_task',
        parameters: {
          team: 'architecture',
          priority: 'urgent'
        }
      },
      {
        type: 'send_notification',
        parameters: {
          recipients: ['architecture-lead', 'project-manager'],
          message: 'Critical risk identified - immediate attention required'
        }
      }
    ],
    enabled: true
  }
]

// ── API Rate Limits & Retry Policies ─────────────────────────────────────────

export interface AsanaApiConfig {
  rateLimits: {
    requestsPerMinute: number
    burstLimit: number
    cooldownPeriod: number
  }
  retryPolicy: {
    maxRetries: number
    backoffMultiplier: number
    maxBackoffTime: number
    retryableStatusCodes: number[]
  }
  timeout: {
    connect: number
    read: number
    total: number
  }
}

export const asanaApiConfig: AsanaApiConfig = {
  rateLimits: {
    requestsPerMinute: 1500, // Asana API limit
    burstLimit: 50,
    cooldownPeriod: 60000 // 1 minute
  },
  retryPolicy: {
    maxRetries: 3,
    backoffMultiplier: 2,
    maxBackoffTime: 30000, // 30 seconds
    retryableStatusCodes: [429, 500, 502, 503, 504]
  },
  timeout: {
    connect: 10000, // 10 seconds
    read: 30000,    // 30 seconds
    total: 60000    // 1 minute
  }
}

// ── Permission Management ─────────────────────────────────────────────────────

export interface AsanaPermissionConfig {
  roles: Record<string, {
    name: string
    description: string
    permissions: string[]
  }>
  defaultRole: string
  adminUsers: string[]
}

export const asanaPermissionConfig: AsanaPermissionConfig = {
  roles: {
    admin: {
      name: 'Administrator',
      description: 'Full access to all features and configuration',
      permissions: [
        'project.create',
        'project.delete',
        'project.manage',
        'task.create',
        'task.delete',
        'task.assign',
        'team.manage',
        'user.manage',
        'automation.configure'
      ]
    },
    lead: {
      name: 'Team Lead',
      description: 'Manage team projects and tasks',
      permissions: [
        'project.create',
        'project.manage',
        'task.create',
        'task.assign',
        'task.manage',
        'team.view',
        'automation.view'
      ]
    },
    member: {
      name: 'Team Member',
      description: 'Create and manage own tasks',
      permissions: [
        'project.view',
        'task.create',
        'task.manage_own',
        'team.view'
      ]
    },
    readonly: {
      name: 'Read Only',
      description: 'View-only access for reporting',
      permissions: [
        'project.view',
        'task.view',
        'team.view'
      ]
    }
  },
  defaultRole: 'member',
  adminUsers: ['foundation-os-admin', 'system-admin']
}

// ── Export Configuration Getters ─────────────────────────────────────────────

export function getAsanaWorkspaceConfig(environment: string = 'development'): AsanaWorkspaceConfig {
  return asanaWorkspaceConfigs[environment] || asanaWorkspaceConfigs.development
}

export function getAsanaTeamConfig(teamName: string): AsanaTeamConfig | null {
  return asanaTeamConfigs[teamName] || null
}

export function getAsanaProjectTemplate(templateName: string): AsanaProjectTemplate | null {
  return asanaProjectTemplates[templateName] || null
}

export function getAsanaApiConfig(): AsanaApiConfig {
  return asanaApiConfig
}

export function getAsanaPermissionConfig(): AsanaPermissionConfig {
  return asanaPermissionConfig
}

// ── Configuration Validation ─────────────────────────────────────────────────

export function validateAsanaConfig(config: any): { valid: boolean, errors: string[] } {
  const errors: string[] = []

  if (!config.workspaceId) {
    errors.push('Workspace ID is required')
  }

  if (!config.teamIds || Object.keys(config.teamIds).length === 0) {
    errors.push('At least one team configuration is required')
  }

  if (!config.syncInterval || config.syncInterval < 1000) {
    errors.push('Sync interval must be at least 1000ms')
  }

  if (!config.retryAttempts || config.retryAttempts < 1) {
    errors.push('Retry attempts must be at least 1')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// ── Default Export ────────────────────────────────────────────────────────────

export default {
  workspaceConfigs: asanaWorkspaceConfigs,
  teamConfigs: asanaTeamConfigs,
  projectTemplates: asanaProjectTemplates,
  automationRules: asanaAutomationRules,
  apiConfig: asanaApiConfig,
  permissionConfig: asanaPermissionConfig,
  getWorkspaceConfig: getAsanaWorkspaceConfig,
  getTeamConfig: getAsanaTeamConfig,
  getProjectTemplate: getAsanaProjectTemplate,
  getApiConfig: getAsanaApiConfig,
  getPermissionConfig: getAsanaPermissionConfig,
  validateConfig: validateAsanaConfig
}