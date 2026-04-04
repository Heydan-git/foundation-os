/**
 * security-framework.ts - Security Framework for Foundation OS Phase 4
 * Data classification, permissions, and audit trail for 250+ MCP tools
 * Revolutionary security layer for intelligent orchestration
 */

import type { MCPTool } from './mcp-orchestrator'

// ── Security Types ────────────────────────────────────────────────────────

type SecurityLevel = 'public' | 'internal' | 'confidential' | 'restricted' | 'top-secret'
type Permission = 'read' | 'write' | 'execute' | 'admin' | 'delete'
type DataClassification = 'public' | 'sensitive' | 'private' | 'confidential'

interface SecurityPolicy {
  id: string
  name: string
  description: string
  level: SecurityLevel
  permissions: Permission[]
  dataAccess: DataClassification[]
  restrictions: SecurityRestriction[]
  auditLevel: 'none' | 'basic' | 'detailed' | 'comprehensive'
  createdAt: string
  updatedAt: string
}

interface SecurityRestriction {
  type: 'time' | 'location' | 'frequency' | 'data-volume' | 'user-role'
  condition: string
  value: any
  enforcement: 'warn' | 'block' | 'require-approval'
}

interface ToolSecurityProfile {
  toolId: string
  securityLevel: SecurityLevel
  requiredPermissions: Permission[]
  dataClassifications: DataClassification[]
  riskScore: number
  auditRequirements: AuditRequirement[]
  complianceFrameworks: string[]
  lastSecurityReview: string
}

interface AuditRequirement {
  action: string
  level: 'log' | 'alert' | 'approval'
  retention: number // days
  notifications: string[]
}

interface SecurityContext {
  userId: string
  userRole: string
  sessionId: string
  permissions: Permission[]
  dataAccessLevels: DataClassification[]
  ipAddress?: string
  userAgent?: string
  timestamp: string
}

interface AuditEvent {
  id: string
  timestamp: string
  userId: string
  sessionId: string
  toolId: string
  action: string
  parameters: Record<string, any>
  result: 'success' | 'failure' | 'blocked' | 'approved'
  riskScore: number
  securityFlags: string[]
  dataAccessed: DataClassification[]
}

// ── Security Framework Core ───────────────────────────────────────────────

export class SecurityFramework {
  private securityPolicies: Map<string, SecurityPolicy> = new Map()
  private toolProfiles: Map<string, ToolSecurityProfile> = new Map()
  private auditLog: AuditEvent[] = []
  constructor() {
    this.initializeSecurityPolicies()
    this.initializeToolProfiles()
  }

  // ── Security Policy Management ────────────────────────────────────────

  private initializeSecurityPolicies(): void {
    const defaultPolicies: SecurityPolicy[] = [
      {
        id: 'public-access',
        name: 'Public Access Policy',
        description: 'Basic access for public tools and data',
        level: 'public',
        permissions: ['read', 'execute'],
        dataAccess: ['public'],
        restrictions: [],
        auditLevel: 'basic',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'internal-tools',
        name: 'Internal Tools Policy',
        description: 'Standard access for internal productivity tools',
        level: 'internal',
        permissions: ['read', 'write', 'execute'],
        dataAccess: ['public', 'sensitive'],
        restrictions: [
          {
            type: 'frequency',
            condition: 'daily_usage',
            value: 100,
            enforcement: 'warn'
          }
        ],
        auditLevel: 'detailed',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'confidential-data',
        name: 'Confidential Data Policy',
        description: 'Restricted access for confidential data handling',
        level: 'confidential',
        permissions: ['read', 'write'],
        dataAccess: ['confidential'],
        restrictions: [
          {
            type: 'user-role',
            condition: 'min_clearance',
            value: 'senior',
            enforcement: 'block'
          },
          {
            type: 'time',
            condition: 'business_hours_only',
            value: true,
            enforcement: 'require-approval'
          }
        ],
        auditLevel: 'comprehensive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'admin-tools',
        name: 'Administrative Tools Policy',
        description: 'Full access for system administration',
        level: 'restricted',
        permissions: ['read', 'write', 'execute', 'admin', 'delete'],
        dataAccess: ['public', 'sensitive', 'private', 'confidential'],
        restrictions: [
          {
            type: 'user-role',
            condition: 'admin_only',
            value: true,
            enforcement: 'block'
          }
        ],
        auditLevel: 'comprehensive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    defaultPolicies.forEach(policy => {
      this.securityPolicies.set(policy.id, policy)
    })

    console.log(`🔒 Initialized ${defaultPolicies.length} security policies`)
  }

  // ── Tool Security Profiling ──────────────────────────────────────────

  private initializeToolProfiles(): void {
    // These would be dynamically generated based on tool analysis
    const profiles: ToolSecurityProfile[] = [
      {
        toolId: 'claude-ai-asana',
        securityLevel: 'internal',
        requiredPermissions: ['read', 'write'],
        dataClassifications: ['sensitive'],
        riskScore: 3.2,
        auditRequirements: [
          {
            action: 'create_task',
            level: 'log',
            retention: 90,
            notifications: []
          }
        ],
        complianceFrameworks: ['SOC2', 'GDPR'],
        lastSecurityReview: '2026-04-01'
      },
      {
        toolId: 'claude-ai-slack',
        securityLevel: 'internal',
        requiredPermissions: ['read', 'write'],
        dataClassifications: ['public', 'sensitive'],
        riskScore: 2.8,
        auditRequirements: [
          {
            action: 'send_message',
            level: 'log',
            retention: 365,
            notifications: ['compliance@company.com']
          }
        ],
        complianceFrameworks: ['SOC2', 'HIPAA'],
        lastSecurityReview: '2026-04-01'
      },
      {
        toolId: 'computer-use',
        securityLevel: 'restricted',
        requiredPermissions: ['execute', 'admin'],
        dataClassifications: ['private', 'confidential'],
        riskScore: 8.5,
        auditRequirements: [
          {
            action: '*',
            level: 'alert',
            retention: 2555, // 7 years
            notifications: ['security@company.com', 'admin@company.com']
          }
        ],
        complianceFrameworks: ['SOC2', 'ISO27001'],
        lastSecurityReview: '2026-04-01'
      }
    ]

    profiles.forEach(profile => {
      this.toolProfiles.set(profile.toolId, profile)
    })

    console.log(`🛡️ Initialized ${profiles.length} tool security profiles`)
  }

  // ── Access Control ───────────────────────────────────────────────────

  async validateAccess(
    tool: MCPTool,
    context: SecurityContext,
    action: string,
    parameters: Record<string, any>
  ): Promise<{ allowed: boolean; reason?: string; requiresApproval?: boolean }> {
    console.log(`🔍 Validating access: ${tool.id} action: ${action}`)

    const profile = this.toolProfiles.get(tool.id)
    if (!profile) {
      return { allowed: false, reason: 'No security profile found for tool' }
    }

    // Check user permissions
    const hasRequiredPermissions = profile.requiredPermissions.every(perm =>
      context.permissions.includes(perm)
    )

    if (!hasRequiredPermissions) {
      return {
        allowed: false,
        reason: 'Insufficient permissions'
      }
    }

    // Check data access levels
    const hasDataAccess = profile.dataClassifications.every(classification =>
      context.dataAccessLevels.includes(classification)
    )

    if (!hasDataAccess) {
      return {
        allowed: false,
        reason: 'Insufficient data access clearance'
      }
    }

    // Check security restrictions
    const restrictionCheck = await this.checkRestrictions(profile, context, action, parameters)
    if (!restrictionCheck.allowed) {
      return restrictionCheck
    }

    // Calculate risk score
    const riskScore = this.calculateRiskScore(profile, context, action, parameters)

    // High-risk actions may require approval
    if (riskScore > 7.0) {
      return {
        allowed: true,
        requiresApproval: true,
        reason: 'High-risk action requires approval'
      }
    }

    return { allowed: true }
  }

  private async checkRestrictions(
    profile: ToolSecurityProfile,
    context: SecurityContext,
    action: string,
    parameters: Record<string, any>
  ): Promise<{ allowed: boolean; reason?: string; requiresApproval?: boolean }> {
    const policy = this.getSecurityPolicy(profile.securityLevel)
    if (!policy) {
      return { allowed: false, reason: 'Security policy not found' }
    }

    for (const restriction of policy.restrictions) {
      const check = this.evaluateRestriction(restriction, context, action, parameters)

      if (!check.passed) {
        switch (restriction.enforcement) {
          case 'block':
            return { allowed: false, reason: check.reason }
          case 'warn':
            console.warn(`⚠️ Security warning: ${check.reason}`)
            break
          case 'require-approval':
            return { allowed: true, requiresApproval: true, reason: check.reason }
        }
      }
    }

    return { allowed: true }
  }

  private evaluateRestriction(
    restriction: SecurityRestriction,
    context: SecurityContext,
    action: string,
    parameters: Record<string, any>
  ): { passed: boolean; reason?: string } {
    switch (restriction.type) {
      case 'time':
        if (restriction.condition === 'business_hours_only') {
          const hour = new Date().getHours()
          if (hour < 9 || hour > 17) {
            return { passed: false, reason: 'Action not allowed outside business hours' }
          }
        }
        break

      case 'user-role':
        if (restriction.condition === 'admin_only' && context.userRole !== 'admin') {
          return { passed: false, reason: 'Admin role required' }
        }
        if (restriction.condition === 'min_clearance' && context.userRole === 'junior') {
          return { passed: false, reason: 'Insufficient clearance level' }
        }
        break

      case 'frequency':
        // Would check usage frequency from audit log
        const recentUsage = this.getRecentUsage(context.userId, action)
        if (recentUsage > restriction.value) {
          return { passed: false, reason: 'Usage frequency limit exceeded' }
        }
        break

      case 'data-volume':
        // Check data volume in parameters
        const dataSize = this.estimateDataSize(parameters)
        if (dataSize > restriction.value) {
          return { passed: false, reason: 'Data volume limit exceeded' }
        }
        break
    }

    return { passed: true }
  }

  // ── Risk Assessment ──────────────────────────────────────────────────

  private calculateRiskScore(
    profile: ToolSecurityProfile,
    context: SecurityContext,
    action: string,
    parameters: Record<string, any>
  ): number {
    let riskScore = profile.riskScore

    // Adjust risk based on context
    if (context.userRole === 'admin') riskScore -= 1.0
    if (context.userRole === 'junior') riskScore += 1.5

    // Adjust risk based on action
    if (action.includes('delete') || action.includes('remove')) riskScore += 2.0
    if (action.includes('create') || action.includes('add')) riskScore += 0.5

    // Adjust risk based on data sensitivity
    const hasConfidentialData = Object.values(parameters).some(value =>
      typeof value === 'string' && this.detectSensitiveData(value)
    )
    if (hasConfidentialData) riskScore += 1.5

    return Math.max(0, Math.min(10, riskScore))
  }

  private detectSensitiveData(data: string): boolean {
    // Basic sensitive data patterns
    const patterns = [
      /\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b/, // Credit card
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email (if in large quantity)
      /password|secret|key|token/i // Credential keywords
    ]

    return patterns.some(pattern => pattern.test(data))
  }

  // ── Audit Trail ──────────────────────────────────────────────────────

  async logAuditEvent(
    tool: MCPTool,
    context: SecurityContext,
    action: string,
    parameters: Record<string, any>,
    result: 'success' | 'failure' | 'blocked' | 'approved'
  ): Promise<void> {
    const profile = this.toolProfiles.get(tool.id)
    const riskScore = profile ? this.calculateRiskScore(profile, context, action, parameters) : 5.0

    const auditEvent: AuditEvent = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      userId: context.userId,
      sessionId: context.sessionId,
      toolId: tool.id,
      action,
      parameters: this.sanitizeParameters(parameters),
      result,
      riskScore,
      securityFlags: this.generateSecurityFlags(tool, context, action, parameters),
      dataAccessed: this.classifyDataAccessed(parameters)
    }

    this.auditLog.push(auditEvent)

    // Trigger alerts for high-risk events
    if (riskScore > 7.0 || result === 'blocked') {
      await this.triggerSecurityAlert(auditEvent)
    }

    console.log(`📋 Audit event logged: ${auditEvent.id}`)
  }

  private sanitizeParameters(parameters: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {}

    for (const [key, value] of Object.entries(parameters)) {
      if (typeof value === 'string') {
        // Remove sensitive data from audit logs
        if (this.detectSensitiveData(value)) {
          sanitized[key] = '[REDACTED]'
        } else {
          sanitized[key] = value
        }
      } else {
        sanitized[key] = value
      }
    }

    return sanitized
  }

  private generateSecurityFlags(
    _tool: MCPTool,
    context: SecurityContext,
    action: string,
    parameters: Record<string, any>
  ): string[] {
    const flags: string[] = []

    if (context.userRole === 'admin') flags.push('ADMIN_USER')
    if (action.includes('delete')) flags.push('DESTRUCTIVE_ACTION')
    if (this.isOutsideBusinessHours()) flags.push('AFTER_HOURS')

    const dataSize = this.estimateDataSize(parameters)
    if (dataSize > 1000000) flags.push('LARGE_DATA_VOLUME') // > 1MB

    const hasSensitiveData = Object.values(parameters).some(value =>
      typeof value === 'string' && this.detectSensitiveData(value)
    )
    if (hasSensitiveData) flags.push('SENSITIVE_DATA')

    return flags
  }

  private classifyDataAccessed(parameters: Record<string, any>): DataClassification[] {
    const classifications: Set<DataClassification> = new Set()

    for (const value of Object.values(parameters)) {
      if (typeof value === 'string') {
        if (this.detectSensitiveData(value)) {
          classifications.add('confidential')
        } else {
          classifications.add('public')
        }
      }
    }

    return Array.from(classifications)
  }

  // ── Security Alerts ──────────────────────────────────────────────────

  private async triggerSecurityAlert(event: AuditEvent): Promise<void> {
    console.log(`🚨 Security alert triggered for event: ${event.id}`)

    const alert = {
      id: `alert-${Date.now()}`,
      timestamp: new Date().toISOString(),
      severity: event.riskScore > 8.0 ? 'critical' : 'warning',
      event,
      message: `High-risk activity detected: ${event.action} on ${event.toolId}`,
      recommendations: this.generateSecurityRecommendations(event)
    }

    // In a real implementation, this would send notifications
    console.log(`📧 Security alert: ${JSON.stringify(alert, null, 2)}`)
  }

  private generateSecurityRecommendations(event: AuditEvent): string[] {
    const recommendations: string[] = []

    if (event.securityFlags.includes('AFTER_HOURS')) {
      recommendations.push('Consider restricting this action to business hours')
    }

    if (event.securityFlags.includes('LARGE_DATA_VOLUME')) {
      recommendations.push('Implement data volume limits for this tool')
    }

    if (event.securityFlags.includes('SENSITIVE_DATA')) {
      recommendations.push('Enable additional approval requirements for sensitive data')
    }

    if (event.riskScore > 8.0) {
      recommendations.push('Review user permissions and access levels')
    }

    return recommendations
  }

  // ── Utility Methods ──────────────────────────────────────────────────

  private getSecurityPolicy(level: SecurityLevel): SecurityPolicy | undefined {
    for (const policy of Array.from(this.securityPolicies.values())) {
      if (policy.level === level) {
        return policy
      }
    }
    return undefined
  }

  private getRecentUsage(userId: string, action: string): number {
    const twentyFourHoursAgo = Date.now() - 24 * 60 * 60 * 1000
    return this.auditLog.filter(event =>
      event.userId === userId &&
      event.action === action &&
      new Date(event.timestamp).getTime() > twentyFourHoursAgo
    ).length
  }

  private estimateDataSize(parameters: Record<string, any>): number {
    return JSON.stringify(parameters).length
  }

  private isOutsideBusinessHours(): boolean {
    const hour = new Date().getHours()
    return hour < 9 || hour > 17
  }

  // ── Public API ───────────────────────────────────────────────────────

  getToolSecurityProfile(toolId: string): ToolSecurityProfile | undefined {
    return this.toolProfiles.get(toolId)
  }

  getSecurityPolicies(): SecurityPolicy[] {
    return Array.from(this.securityPolicies.values())
  }

  getAuditLog(filters?: {
    userId?: string
    toolId?: string
    startDate?: string
    endDate?: string
  }): AuditEvent[] {
    let filteredLog = this.auditLog

    if (filters?.userId) {
      filteredLog = filteredLog.filter(event => event.userId === filters.userId)
    }

    if (filters?.toolId) {
      filteredLog = filteredLog.filter(event => event.toolId === filters.toolId)
    }

    if (filters?.startDate) {
      filteredLog = filteredLog.filter(event =>
        new Date(event.timestamp) >= new Date(filters.startDate!)
      )
    }

    if (filters?.endDate) {
      filteredLog = filteredLog.filter(event =>
        new Date(event.timestamp) <= new Date(filters.endDate!)
      )
    }

    return filteredLog
  }

  async createSecurityProfile(tool: MCPTool): Promise<ToolSecurityProfile> {
    // Auto-generate security profile for new tools
    const profile: ToolSecurityProfile = {
      toolId: tool.id,
      securityLevel: this.inferSecurityLevel(tool),
      requiredPermissions: this.inferRequiredPermissions(tool),
      dataClassifications: this.inferDataClassifications(tool),
      riskScore: this.inferRiskScore(tool),
      auditRequirements: this.inferAuditRequirements(tool),
      complianceFrameworks: ['SOC2'], // Default compliance
      lastSecurityReview: new Date().toISOString()
    }

    this.toolProfiles.set(tool.id, profile)
    console.log(`🔐 Created security profile for tool: ${tool.id}`)

    return profile
  }

  private inferSecurityLevel(tool: MCPTool): SecurityLevel {
    if (tool.capabilities.includes('admin') || tool.capabilities.includes('delete')) {
      return 'restricted'
    }
    if (tool.capabilities.includes('api-interaction') || tool.capabilities.includes('data-processing')) {
      return 'confidential'
    }
    if (tool.capabilities.includes('communication') || tool.capabilities.includes('task-management')) {
      return 'internal'
    }
    return 'public'
  }

  private inferRequiredPermissions(tool: MCPTool): Permission[] {
    const permissions: Permission[] = ['read']

    if (tool.capabilities.includes('task-management') || tool.capabilities.includes('content-sync')) {
      permissions.push('write')
    }
    if (tool.capabilities.includes('automation') || tool.capabilities.includes('workflow')) {
      permissions.push('execute')
    }
    if (tool.capabilities.includes('admin') || tool.capabilities.includes('user-management')) {
      permissions.push('admin')
    }
    if (tool.capabilities.includes('delete') || tool.name.toLowerCase().includes('delete')) {
      permissions.push('delete')
    }

    return permissions
  }

  private inferDataClassifications(tool: MCPTool): DataClassification[] {
    if (tool.capabilities.includes('admin') || tool.capabilities.includes('user-management')) {
      return ['confidential', 'private']
    }
    if (tool.capabilities.includes('task-management') || tool.capabilities.includes('documentation')) {
      return ['sensitive', 'public']
    }
    return ['public']
  }

  private inferRiskScore(tool: MCPTool): number {
    let score = 2.0 // Base risk

    if (tool.capabilities.includes('admin')) score += 3.0
    if (tool.capabilities.includes('delete')) score += 2.5
    if (tool.capabilities.includes('automation')) score += 1.5
    if (tool.capabilities.includes('api-interaction')) score += 1.0
    if (tool.performance.complexity === 'high') score += 1.0
    if (tool.performance.resourceUsage === 'heavy') score += 0.5

    return Math.min(10, score)
  }

  private inferAuditRequirements(tool: MCPTool): AuditRequirement[] {
    const requirements: AuditRequirement[] = []

    // High-risk tools need comprehensive auditing
    if (tool.capabilities.includes('admin') || tool.capabilities.includes('delete')) {
      requirements.push({
        action: '*',
        level: 'alert',
        retention: 2555, // 7 years
        notifications: ['security@company.com']
      })
    } else if (tool.capabilities.includes('data-processing')) {
      requirements.push({
        action: 'process_data',
        level: 'log',
        retention: 365,
        notifications: []
      })
    }

    return requirements
  }
}

// ── Singleton Instance ───────────────────────────────────────────────────

export const securityFramework = new SecurityFramework()

export default securityFramework

// Export types for other modules
export type { SecurityContext }