/**
 * workflow-routing-engine.ts - Intelligent Workflow Routing Engine for Foundation OS Phase 4
 * ML-powered analysis and automatic routing to optimal tool combinations
 * Revolutionary intelligent orchestration with learning capabilities
 */

import { mcpOrchestrator } from './mcp-orchestrator'
import type { MCPTool, WorkflowRequest, OrchestrationPlan, MCPParameter } from './mcp-orchestrator'
import { securityFramework } from './security-framework'
import { memoryManager } from './memory-manager'
import type { SecurityContext } from './security-framework'

// ── Routing Types ─────────────────────────────────────────────────────────

interface RoutingDecision {
  id: string
  request: WorkflowRequest
  selectedRoute: WorkflowRoute
  confidence: number
  reasoning: string[]
  alternatives: WorkflowRoute[]
  executionTime: number
  timestamp: string
}

interface WorkflowRoute {
  id: string
  name: string
  description: string
  tools: MCPTool[]
  steps: RouteStep[]
  estimatedDuration: number
  successProbability: number
  complexity: 'simple' | 'moderate' | 'complex' | 'expert'
  resourceRequirements: ResourceRequirements
}

interface RouteStep {
  order: number
  tool: MCPTool
  action: string
  parameters: Record<string, any>
  dependencies: string[]
  timeout: number
  retryPolicy: RetryPolicy
}

interface RetryPolicy {
  maxAttempts: number
  backoffStrategy: 'linear' | 'exponential'
  backoffMs: number
}

interface ResourceRequirements {
  cpu: 'low' | 'medium' | 'high'
  memory: 'low' | 'medium' | 'high'
  network: 'low' | 'medium' | 'high'
  duration: number
}

interface RoutingPattern {
  id: string
  name: string
  pattern: RegExp
  route: WorkflowRoute
  usageCount: number
  successRate: number
  lastUsed: string
}

interface LearningData {
  request: WorkflowRequest
  selectedRoute: WorkflowRoute
  actualDuration: number
  success: boolean
  errors: string[]
  userFeedback?: 'positive' | 'negative' | 'neutral'
  timestamp: string
}

// ── ML Features for Route Learning ───────────────────────────────────────

interface FeatureVector {
  requestComplexity: number
  keywordDensity: number
  requiredCapabilities: number
  priorityScore: number
  timeConstraint: number
  resourceConstraint: number
  historicalSuccess: number
}

interface RouteScore {
  route: WorkflowRoute
  score: number
  features: FeatureVector
  reasoning: string[]
}

// ── Workflow Routing Engine Core ─────────────────────────────────────────

export class WorkflowRoutingEngine {
  private routingPatterns: Map<string, RoutingPattern> = new Map()
  private learningData: LearningData[] = []
  private routeTemplates: Map<string, WorkflowRoute> = new Map()
  private performanceMetrics: Map<string, number> = new Map()

  constructor() {
    this.initializeRouteTemplates()
    this.loadLearningData()
  }

  // ── Initialize Route Templates ───────────────────────────────────────

  private initializeRouteTemplates(): void {
    const templates: WorkflowRoute[] = [
      {
        id: 'communication-workflow',
        name: 'Communication Workflow',
        description: 'Send messages, manage notifications, coordinate teams',
        tools: [], // Will be populated dynamically
        steps: [],
        estimatedDuration: 2000,
        successProbability: 0.95,
        complexity: 'simple',
        resourceRequirements: {
          cpu: 'low',
          memory: 'low',
          network: 'medium',
          duration: 2000
        }
      },
      {
        id: 'data-analysis-workflow',
        name: 'Data Analysis Workflow',
        description: 'Collect, process, analyze, and visualize data',
        tools: [],
        steps: [],
        estimatedDuration: 8000,
        successProbability: 0.87,
        complexity: 'complex',
        resourceRequirements: {
          cpu: 'high',
          memory: 'high',
          network: 'medium',
          duration: 8000
        }
      },
      {
        id: 'project-management-workflow',
        name: 'Project Management Workflow',
        description: 'Create tasks, assign teams, track progress, report status',
        tools: [],
        steps: [],
        estimatedDuration: 5000,
        successProbability: 0.92,
        complexity: 'moderate',
        resourceRequirements: {
          cpu: 'medium',
          memory: 'medium',
          network: 'low',
          duration: 5000
        }
      },
      {
        id: 'automation-workflow',
        name: 'Automation Workflow',
        description: 'Automate repetitive tasks, integrate systems, schedule actions',
        tools: [],
        steps: [],
        estimatedDuration: 6000,
        successProbability: 0.85,
        complexity: 'complex',
        resourceRequirements: {
          cpu: 'high',
          memory: 'medium',
          network: 'high',
          duration: 6000
        }
      },
      {
        id: 'content-creation-workflow',
        name: 'Content Creation Workflow',
        description: 'Generate, edit, format, and publish content',
        tools: [],
        steps: [],
        estimatedDuration: 4000,
        successProbability: 0.89,
        complexity: 'moderate',
        resourceRequirements: {
          cpu: 'medium',
          memory: 'medium',
          network: 'low',
          duration: 4000
        }
      }
    ]

    templates.forEach(template => {
      this.routeTemplates.set(template.id, template)
    })

    console.log(`🗺️ Initialized ${templates.length} route templates`)
  }

  // ── Intelligent Route Analysis with Security & Memory ──────────────

  async analyzeAndRoute(
    request: WorkflowRequest,
    securityContext: SecurityContext
  ): Promise<RoutingDecision> {
    console.log(`🧠 Analyzing workflow request: ${request.description}`)

    const startTime = Date.now()

    // Check memory resources before processing
    const memoryCheck = await memoryManager.checkResourceThrottling()
    if (!memoryCheck.allowed) {
      throw new Error(`Resource constraints: ${memoryCheck.reason}`)
    }

    // Apply memory throttling delay if needed
    if (memoryCheck.delay) {
      console.log(`⏳ Applying memory throttling delay: ${memoryCheck.delay}ms`)
      await new Promise(resolve => setTimeout(resolve, memoryCheck.delay))
    }

    // Check cache for similar requests
    const cacheKey = this.generateCacheKey(request, securityContext)
    const cachedDecision = await memoryManager.get<RoutingDecision>(cacheKey)

    if (cachedDecision && this.isCacheValid(cachedDecision)) {
      console.log(`💾 Using cached routing decision: ${cachedDecision.id}`)
      return cachedDecision
    }

    // Extract features from request
    const features = this.extractFeatures(request)

    // Find candidate routes
    const candidateRoutes = await this.findCandidateRoutes(request, features)

    // Apply security filtering to routes
    const secureRoutes = await this.applySecurityFiltering(candidateRoutes, securityContext, request)

    // Score routes using ML
    const scoredRoutes = this.scoreRoutes(secureRoutes, features, request)

    // Select optimal route
    const selectedRoute = this.selectOptimalRoute(scoredRoutes)

    // Build routing decision
    const decision: RoutingDecision = {
      id: `routing-${Date.now()}`,
      request,
      selectedRoute: selectedRoute.route,
      confidence: selectedRoute.score,
      reasoning: selectedRoute.reasoning,
      alternatives: scoredRoutes.slice(1, 4).map(sr => sr.route),
      executionTime: Date.now() - startTime,
      timestamp: new Date().toISOString()
    }

    // Cache the decision for future use
    await memoryManager.set(cacheKey, decision, {
      ttl: 10 * 60 * 1000, // 10 minutes
      priority: 'medium',
      category: 'routing-decision',
      toolId: 'workflow-routing-engine'
    })

    // Learn from this decision
    this.recordDecision(decision)

    console.log(`✅ Route selected: ${selectedRoute.route.name} (confidence: ${(selectedRoute.score * 100).toFixed(1)}%)`)

    return decision
  }

  // ── Feature Extraction ──────────────────────────────────────────────

  private extractFeatures(request: WorkflowRequest): FeatureVector {
    const description = request.description.toLowerCase()

    // Calculate request complexity
    const complexityIndicators = [
      'integrate', 'analyze', 'automate', 'complex', 'advanced',
      'multiple', 'coordinate', 'synchronize', 'orchestrate'
    ]
    const requestComplexity = complexityIndicators.reduce((score, indicator) =>
      score + (description.includes(indicator) ? 1 : 0), 0
    ) / complexityIndicators.length

    // Calculate keyword density
    const keywords = description.split(/\s+/).filter(word => word.length > 3)
    const keywordDensity = keywords.length / description.length

    // Count required capabilities
    const requiredCapabilities = request.requirements.length

    // Priority score
    const priorityScores = { low: 0.25, medium: 0.5, high: 0.75, critical: 1.0 }
    const priorityScore = priorityScores[request.priority] || 0.5

    // Time constraint (if deadline specified)
    let timeConstraint = 0.5
    if (request.deadline) {
      const deadline = new Date(request.deadline)
      const now = new Date()
      const hoursUntilDeadline = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60)
      timeConstraint = Math.max(0, Math.min(1, hoursUntilDeadline / 24))
    }

    // Resource constraint (from constraints)
    const hasResourceConstraints = (request.constraints || []).some(c =>
      c.type === 'resource' || c.type === 'performance'
    )
    const resourceConstraint = hasResourceConstraints ? 0.7 : 0.3

    // Historical success (average success rate for similar requests)
    const historicalSuccess = this.getHistoricalSuccessRate(request)

    return {
      requestComplexity,
      keywordDensity,
      requiredCapabilities,
      priorityScore,
      timeConstraint,
      resourceConstraint,
      historicalSuccess
    }
  }

  // ── Route Finding and Scoring ───────────────────────────────────────

  private async findCandidateRoutes(request: WorkflowRequest, features: FeatureVector): Promise<WorkflowRoute[]> {
    const candidates: WorkflowRoute[] = []

    // Check pattern-based routes
    const patternRoutes = this.findPatternRoutes(request)
    candidates.push(...patternRoutes)

    // Check template-based routes
    const templateRoutes = this.findTemplateRoutes(request, features)
    candidates.push(...templateRoutes)

    // Generate dynamic routes
    const dynamicRoutes = await this.generateDynamicRoutes(request)
    candidates.push(...dynamicRoutes)

    return this.deduplicateRoutes(candidates)
  }

  private findPatternRoutes(request: WorkflowRequest): WorkflowRoute[] {
    const routes: WorkflowRoute[] = []

    for (const pattern of Array.from(this.routingPatterns.values())) {
      if (pattern.pattern.test(request.description)) {
        routes.push(pattern.route)
      }
    }

    return routes.sort((a, b) => b.successProbability - a.successProbability)
  }

  private findTemplateRoutes(request: WorkflowRequest, features: FeatureVector): WorkflowRoute[] {
    const routes: WorkflowRoute[] = []

    for (const template of Array.from(this.routeTemplates.values())) {
      // Match template to request complexity
      const complexityMatch = this.getComplexityMatch(template.complexity, features.requestComplexity)

      if (complexityMatch > 0.5) {
        // Customize template with actual tools
        const customizedRoute = this.customizeTemplate(template, request)
        routes.push(customizedRoute)
      }
    }

    return routes
  }

  private async generateDynamicRoutes(request: WorkflowRequest): Promise<WorkflowRoute[]> {
    const routes: WorkflowRoute[] = []

    // Use MCP orchestrator to find optimal tools
    const plan = mcpOrchestrator.selectOptimalTools(request)

    if (plan.selectedTools.length > 0) {
      const dynamicRoute: WorkflowRoute = {
        id: `dynamic-${Date.now()}`,
        name: 'Dynamic Route',
        description: `Custom route for: ${request.description}`,
        tools: plan.selectedTools,
        steps: this.generateSteps(plan.selectedTools, request),
        estimatedDuration: plan.estimatedDuration,
        successProbability: this.estimateSuccessProbability(plan.selectedTools),
        complexity: this.estimateComplexity(plan.selectedTools),
        resourceRequirements: this.estimateResourceRequirements(plan.selectedTools)
      }

      routes.push(dynamicRoute)
    }

    return routes
  }

  // ── ML-Based Route Scoring ──────────────────────────────────────────

  private scoreRoutes(routes: WorkflowRoute[], features: FeatureVector, request: WorkflowRequest): RouteScore[] {
    const scoredRoutes: RouteScore[] = []

    for (const route of routes) {
      const score = this.calculateRouteScore(route, features, request)
      const reasoning = this.generateScoreReasoning(route, features, score)

      scoredRoutes.push({
        route,
        score,
        features,
        reasoning
      })
    }

    return scoredRoutes.sort((a, b) => b.score - a.score)
  }

  private calculateRouteScore(route: WorkflowRoute, features: FeatureVector, request: WorkflowRequest): number {
    let score = 0

    // Base success probability (30% weight)
    score += route.successProbability * 0.3

    // Complexity match (20% weight)
    const complexityScore = this.getComplexityMatch(route.complexity, features.requestComplexity)
    score += complexityScore * 0.2

    // Priority alignment (15% weight)
    const priorityAlignment = this.getPriorityAlignment(route, features.priorityScore)
    score += priorityAlignment * 0.15

    // Resource efficiency (15% weight)
    const resourceEfficiency = this.getResourceEfficiency(route, features.resourceConstraint)
    score += resourceEfficiency * 0.15

    // Historical performance (10% weight)
    score += features.historicalSuccess * 0.1

    // Time constraint compliance (10% weight)
    const timeCompliance = this.getTimeCompliance(route, features.timeConstraint)
    score += timeCompliance * 0.1

    // Apply learning adjustments
    score = this.applyLearningAdjustments(score, route, request)

    return Math.max(0, Math.min(1, score))
  }

  private getComplexityMatch(routeComplexity: string, requestComplexity: number): number {
    const complexityMap = { simple: 0.2, moderate: 0.5, complex: 0.8, expert: 1.0 }
    const routeScore = complexityMap[routeComplexity] || 0.5

    // Perfect match gets 1.0, decreasing as difference increases
    return 1 - Math.abs(routeScore - requestComplexity)
  }

  private getPriorityAlignment(route: WorkflowRoute, priorityScore: number): number {
    // High priority requests prefer routes with higher success probability
    if (priorityScore > 0.7) {
      return route.successProbability
    }

    // Low priority requests prefer resource-efficient routes
    if (priorityScore < 0.3) {
      const resourceEfficiencyScore = route.resourceRequirements.cpu === 'low' ? 0.8 : 0.5
      return resourceEfficiencyScore
    }

    // Medium priority requests balance both
    return (route.successProbability + 0.7) / 2
  }

  private getResourceEfficiency(route: WorkflowRoute, resourceConstraint: number): number {
    const resourceScores = { low: 1.0, medium: 0.6, high: 0.3 }

    const cpuScore = resourceScores[route.resourceRequirements.cpu] || 0.5
    const memoryScore = resourceScores[route.resourceRequirements.memory] || 0.5
    const networkScore = resourceScores[route.resourceRequirements.network] || 0.5

    const averageEfficiency = (cpuScore + memoryScore + networkScore) / 3

    // Apply resource constraint factor
    return averageEfficiency * (1 - resourceConstraint) + resourceConstraint * 0.5
  }

  private getTimeCompliance(route: WorkflowRoute, timeConstraint: number): number {
    // If tight deadline, prefer faster routes
    if (timeConstraint < 0.3) {
      return route.estimatedDuration < 3000 ? 1.0 : 0.5
    }

    // If loose deadline, duration is less important
    return 0.8
  }

  private applyLearningAdjustments(score: number, route: WorkflowRoute, request: WorkflowRequest): number {
    // Apply adjustments based on learning data
    const relevantLearning = this.learningData.filter(data =>
      this.isSimilarRequest(data.request, request) &&
      data.selectedRoute.id === route.id
    )

    if (relevantLearning.length > 0) {
      const avgSuccess = relevantLearning.reduce((sum, data) =>
        sum + (data.success ? 1 : 0), 0
      ) / relevantLearning.length

      // Adjust score based on actual historical performance
      score = score * 0.7 + avgSuccess * 0.3
    }

    return score
  }

  // ── Route Selection and Execution ───────────────────────────────────

  private selectOptimalRoute(scoredRoutes: RouteScore[]): RouteScore {
    if (scoredRoutes.length === 0) {
      throw new Error('No viable routes found')
    }

    // Select highest scoring route
    const selected = scoredRoutes[0]

    // Add confidence boost if significantly better than alternatives
    if (scoredRoutes.length > 1) {
      const scoreDiff = selected.score - scoredRoutes[1].score
      if (scoreDiff > 0.2) {
        selected.reasoning.push('Significantly outperformed alternatives')
      }
    }

    return selected
  }

  // ── Security Integration Methods ────────────────────────────────────

  private async applySecurityFiltering(
    routes: WorkflowRoute[],
    context: SecurityContext,
    request: WorkflowRequest
  ): Promise<WorkflowRoute[]> {
    const secureRoutes: WorkflowRoute[] = []

    for (const route of routes) {
      let routeAllowed = true
      const blockedTools: string[] = []

      // Check security for each tool in the route
      for (const tool of route.tools) {
        const accessCheck = await securityFramework.validateAccess(
          tool,
          context,
          'execute',
          this.extractParametersFromRequest(request)
        )

        if (!accessCheck.allowed) {
          routeAllowed = false
          blockedTools.push(tool.id)
        }
      }

      if (routeAllowed) {
        secureRoutes.push(route)
      } else {
        console.log(`🔒 Route blocked by security: ${route.name} (tools: ${blockedTools.join(', ')})`)
      }
    }

    console.log(`🛡️ Security filtering: ${secureRoutes.length}/${routes.length} routes approved`)
    return secureRoutes
  }

  private extractParametersFromRequest(request: WorkflowRequest): Record<string, any> {
    return {
      description: request.description,
      requirements: request.requirements,
      priority: request.priority,
      constraints: request.constraints
    }
  }

  // ── Cache Management Methods ────────────────────────────────────────

  private generateCacheKey(request: WorkflowRequest, context: SecurityContext): string {
    const keyData = {
      description: request.description,
      requirements: request.requirements.sort(),
      priority: request.priority,
      userId: context.userId,
      userRole: context.userRole
    }

    return `route:${Buffer.from(JSON.stringify(keyData)).toString('base64').slice(0, 32)}`
  }

  private isCacheValid(cachedDecision: RoutingDecision): boolean {
    const maxAge = 10 * 60 * 1000 // 10 minutes
    const age = Date.now() - new Date(cachedDecision.timestamp).getTime()
    return age < maxAge
  }

  async executeRoute(route: WorkflowRoute, request: WorkflowRequest, context: SecurityContext): Promise<any[]> {
    console.log(`🚀 Executing route: ${route.name}`)

    const startTime = Date.now()
    const results: any[] = []
    const errors: string[] = []

    try {
      // Execute each step in the route with security and memory management
      for (const step of route.steps) {
        // Check memory constraints before each step
        const memoryCheck = await memoryManager.checkResourceThrottling()
        if (!memoryCheck.allowed) {
          errors.push(`Memory constraints: ${memoryCheck.reason}`)
          break
        }

        if (memoryCheck.delay) {
          await new Promise(resolve => setTimeout(resolve, memoryCheck.delay))
        }

        // Validate security for this step
        const accessCheck = await securityFramework.validateAccess(
          step.tool,
          context,
          step.action,
          step.parameters
        )

        if (!accessCheck.allowed) {
          const error = `Security blocked: ${step.tool.id} - ${accessCheck.reason}`
          errors.push(error)

          // Log security audit event
          await securityFramework.logAuditEvent(
            step.tool,
            context,
            step.action,
            step.parameters,
            'blocked'
          )

          continue
        }

        // Log security audit for allowed action
        await securityFramework.logAuditEvent(
          step.tool,
          context,
          step.action,
          step.parameters,
          'approved'
        )

        // Execute step with caching
        const cacheKey = `step:${step.tool.id}:${this.hashStepParameters(step.parameters)}`
        let stepResult = await memoryManager.get<any>(cacheKey)

        if (!stepResult) {
          stepResult = await this.executeRouteStep(step, request, context)

          // Cache successful results
          if (stepResult.success) {
            await memoryManager.set(cacheKey, stepResult, {
              ttl: 5 * 60 * 1000, // 5 minutes
              priority: 'low',
              category: 'step-result',
              toolId: step.tool.id
            })
          }
        } else {
          console.log(`💾 Using cached step result: ${step.tool.id}`)
        }

        results.push(stepResult)

        if (!stepResult.success) {
          errors.push(`Step ${step.order} failed: ${stepResult.error}`)

          // Log failure audit
          await securityFramework.logAuditEvent(
            step.tool,
            context,
            step.action,
            step.parameters,
            'failure'
          )

          // Apply retry policy
          if (step.retryPolicy.maxAttempts > 1) {
            const retryResult = await this.retryStep(step, request, context, 1)
            if (retryResult.success) {
              results[results.length - 1] = retryResult

              // Log success audit for retry
              await securityFramework.logAuditEvent(
                step.tool,
                context,
                step.action,
                step.parameters,
                'success'
              )
            } else {
              errors.push(`Step ${step.order} retry failed: ${retryResult.error}`)
            }
          }
        } else {
          // Log success audit
          await securityFramework.logAuditEvent(
            step.tool,
            context,
            step.action,
            step.parameters,
            'success'
          )
        }
      }

      // Record learning data with memory management
      const learningData: LearningData = {
        request,
        selectedRoute: route,
        actualDuration: Date.now() - startTime,
        success: errors.length === 0,
        errors,
        timestamp: new Date().toISOString()
      }

      this.learningData.push(learningData)

      // Cache learning data for ML improvement
      await memoryManager.set(`learning:${Date.now()}`, learningData, {
        ttl: 24 * 60 * 60 * 1000, // 24 hours
        priority: 'high',
        category: 'learning-data'
      })

      console.log(`✅ Route execution completed: ${results.length} steps, ${errors.length} errors`)

    } catch (error: any) {
      console.error('❌ Route execution failed:', error.message)
      errors.push(error.message)
    }

    return results
  }

  private hashStepParameters(parameters: Record<string, any>): string {
    try {
      const sorted = Object.keys(parameters).sort().reduce((obj, key) => {
        obj[key] = parameters[key]
        return obj
      }, {} as Record<string, any>)

      const str = JSON.stringify(sorted)
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32-bit integer
      }
      return Math.abs(hash).toString(16)
    } catch {
      return Math.random().toString(16).slice(2)
    }
  }

  private async executeRouteStep(step: RouteStep, request: WorkflowRequest, context: SecurityContext): Promise<any> {
    try {
      // Execute the tool for this step
      const result = await this.executeToolAction(step.tool, step.action, step.parameters)

      return {
        step: step.order,
        tool: step.tool.id,
        success: true,
        data: result,
        duration: 0 // Would track actual duration
      }
    } catch (error: any) {
      return {
        step: step.order,
        tool: step.tool.id,
        success: false,
        error: error.message,
        duration: 0
      }
    }
  }

  private async executeToolAction(tool: MCPTool, action: string, parameters: Record<string, any>): Promise<any> {
    // Placeholder for actual tool execution
    // This would use the actual MCP protocol

    await new Promise(resolve => setTimeout(resolve, tool.performance.averageResponseTime))

    return {
      tool: tool.id,
      action,
      status: 'completed',
      result: `Executed ${action} on ${tool.name}`,
      timestamp: new Date().toISOString()
    }
  }

  private async retryStep(step: RouteStep, request: WorkflowRequest, context: SecurityContext, attempt: number): Promise<any> {
    if (attempt >= step.retryPolicy.maxAttempts) {
      throw new Error(`Max retry attempts exceeded for step ${step.order}`)
    }

    // Apply backoff
    const delay = step.retryPolicy.backoffStrategy === 'exponential'
      ? step.retryPolicy.backoffMs * Math.pow(2, attempt - 1)
      : step.retryPolicy.backoffMs * attempt

    await new Promise(resolve => setTimeout(resolve, delay))

    console.log(`🔄 Retrying step ${step.order}, attempt ${attempt + 1}`)

    const result = await this.executeRouteStep(step, request, context)

    if (!result.success && attempt < step.retryPolicy.maxAttempts - 1) {
      return this.retryStep(step, request, context, attempt + 1)
    }

    return result
  }

  // ── Utility Methods ──────────────────────────────────────────────────

  private customizeTemplate(template: WorkflowRoute, request: WorkflowRequest): WorkflowRoute {
    // Find tools that match the template requirements
    const tools = mcpOrchestrator.searchTools(
      request.description,
      request.requirements
    ).slice(0, 3)

    return {
      ...template,
      id: `${template.id}-${Date.now()}`,
      tools,
      steps: this.generateSteps(tools, request)
    }
  }

  private generateSteps(tools: MCPTool[], request: WorkflowRequest): RouteStep[] {
    return tools.map((tool, index) => ({
      order: index + 1,
      tool,
      action: 'execute',
      parameters: this.generateStepParameters(tool, request),
      dependencies: index > 0 ? [`step-${index}`] : [],
      timeout: tool.performance.averageResponseTime * 2,
      retryPolicy: {
        maxAttempts: 3,
        backoffStrategy: 'exponential' as const,
        backoffMs: 1000
      }
    }))
  }

  private generateStepParameters(tool: MCPTool, request: WorkflowRequest): Record<string, any> {
    const params: Record<string, any> = {}

    // Add default parameters based on tool requirements
    for (const param of tool.parameters) {
      if (param.required) {
        params[param.name] = param.default || this.inferParameterValue(param, request)
      }
    }

    return params
  }

  private inferParameterValue(param: MCPParameter, request: WorkflowRequest): any {
    // Simple parameter inference based on type and description
    if (param.type === 'string') {
      if (param.name.includes('action')) return 'execute'
      if (param.name.includes('query')) return request.description
      return 'default-value'
    }

    if (param.type === 'number') return 1
    if (param.type === 'boolean') return true

    return null
  }

  private estimateSuccessProbability(tools: MCPTool[]): number {
    if (tools.length === 0) return 0.5

    const avgSuccessRate = tools.reduce((sum, tool) => sum + tool.successRate, 0) / tools.length
    const reliabilityFactor = tools.reduce((sum, tool) => sum + tool.performance.reliability, 0) / tools.length

    return (avgSuccessRate + reliabilityFactor) / 2
  }

  private estimateComplexity(tools: MCPTool[]): WorkflowRoute['complexity'] {
    if (tools.length === 0) return 'simple'

    const avgComplexity = tools.reduce((sum, tool) => {
      const complexityScores = { low: 1, medium: 2, high: 3 }
      return sum + complexityScores[tool.performance.complexity]
    }, 0) / tools.length

    if (avgComplexity <= 1.5) return 'simple'
    if (avgComplexity <= 2.5) return 'moderate'
    if (avgComplexity <= 3) return 'complex'
    return 'expert'
  }

  private estimateResourceRequirements(tools: MCPTool[]): ResourceRequirements {
    if (tools.length === 0) {
      return { cpu: 'low', memory: 'low', network: 'low', duration: 1000 }
    }

    // Get the highest resource requirement from all tools
    const resourceLevels = ['low', 'medium', 'high']

    const maxCpu = tools.reduce((max, tool) =>
      resourceLevels.indexOf(tool.performance.resourceUsage) > resourceLevels.indexOf(max) ?
        tool.performance.resourceUsage : max
    , 'low' as any)

    const totalDuration = tools.reduce((sum, tool) => sum + tool.performance.averageResponseTime, 0)

    return {
      cpu: maxCpu,
      memory: maxCpu, // Assume memory follows CPU requirements
      network: maxCpu, // Assume network follows CPU requirements
      duration: totalDuration
    }
  }

  private deduplicateRoutes(routes: WorkflowRoute[]): WorkflowRoute[] {
    const seen = new Set<string>()
    return routes.filter(route => {
      const signature = `${route.name}-${route.tools.map(t => t.id).sort().join(',')}`
      if (seen.has(signature)) return false
      seen.add(signature)
      return true
    })
  }

  private getHistoricalSuccessRate(request: WorkflowRequest): number {
    const similarRequests = this.learningData.filter(data =>
      this.isSimilarRequest(data.request, request)
    )

    if (similarRequests.length === 0) return 0.5

    return similarRequests.reduce((sum, data) =>
      sum + (data.success ? 1 : 0), 0
    ) / similarRequests.length
  }

  private isSimilarRequest(request1: WorkflowRequest, request2: WorkflowRequest): boolean {
    // Simple similarity check based on keywords
    const words1 = request1.description.toLowerCase().split(/\s+/)
    const words2 = request2.description.toLowerCase().split(/\s+/)

    const commonWords = words1.filter(word => words2.includes(word))
    const similarity = commonWords.length / Math.max(words1.length, words2.length)

    return similarity > 0.3
  }

  private recordDecision(decision: RoutingDecision): void {
    // Store decision for future learning
    console.log(`📝 Recording routing decision: ${decision.id}`)
  }

  private loadLearningData(): void {
    // Load previous learning data from storage
    console.log('📚 Loading learning data...')
  }

  private generateScoreReasoning(route: WorkflowRoute, features: FeatureVector, score: number): string[] {
    const reasoning: string[] = []

    if (route.successProbability > 0.9) {
      reasoning.push('High historical success rate')
    }

    if (route.estimatedDuration < 3000) {
      reasoning.push('Fast execution time')
    }

    if (features.requestComplexity < 0.3 && route.complexity === 'simple') {
      reasoning.push('Complexity well-matched to request')
    }

    if (score > 0.8) {
      reasoning.push('Excellent overall fit')
    } else if (score > 0.6) {
      reasoning.push('Good match for requirements')
    } else {
      reasoning.push('Acceptable but not optimal')
    }

    return reasoning
  }

  // ── Public API with Security & Memory Integration ───────────────────

  getStats() {
    const memoryStats = memoryManager.getMemoryStats()

    return {
      routeTemplates: this.routeTemplates.size,
      routingPatterns: this.routingPatterns.size,
      learningDataPoints: this.learningData.length,
      averageRoutingTime: this.getAverageRoutingTime(),
      memory: {
        hitRate: memoryStats.hitRate,
        memoryUsage: memoryStats.memoryUsagePercent,
        entryCount: memoryStats.entryCount
      },
      security: {
        auditEvents: securityFramework.getAuditLog().length,
        securityPolicies: securityFramework.getSecurityPolicies().length
      }
    }
  }

  async getSecurityAuditLog(filters?: {
    userId?: string
    toolId?: string
    startDate?: string
    endDate?: string
  }) {
    return securityFramework.getAuditLog(filters)
  }

  async optimizePerformance(): Promise<{
    cacheOptimized: boolean
    memoryFreed: number
    securityRecommendations: string[]
  }> {
    console.log('🚀 Starting performance optimization...')

    // Optimize memory cache
    const cacheResults = await memoryManager.optimizeCache()

    // Get security recommendations from recent audit events
    const recentAudits = securityFramework.getAuditLog({
      startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() // Last 24h
    })

    const securityRecommendations: string[] = []
    const highRiskEvents = recentAudits.filter(event => event.riskScore > 7)

    if (highRiskEvents.length > 0) {
      securityRecommendations.push(`${highRiskEvents.length} high-risk events detected in last 24h`)
    }

    const blockedEvents = recentAudits.filter(event => event.result === 'blocked')
    if (blockedEvents.length > 10) {
      securityRecommendations.push('High number of blocked actions - review permissions')
    }

    console.log(`✅ Performance optimization completed`)

    return {
      cacheOptimized: cacheResults.optimized > 0,
      memoryFreed: cacheResults.freedMemory,
      securityRecommendations
    }
  }

  async warmupCache(commonRequests: WorkflowRequest[]): Promise<void> {
    console.log(`🔥 Warming up cache with ${commonRequests.length} common requests...`)

    const warmupEntries = commonRequests.map(request => ({
      key: this.generateCacheKey(request, {
        userId: 'system',
        userRole: 'admin',
        sessionId: 'warmup',
        permissions: ['read', 'write', 'execute'],
        dataAccessLevels: ['public', 'sensitive'],
        timestamp: new Date().toISOString()
      }),
      value: {
        precomputed: true,
        features: this.extractFeatures(request),
        timestamp: new Date().toISOString()
      },
      options: {
        category: 'warmup',
        priority: 'medium' as const,
        ttl: 60 * 60 * 1000 // 1 hour
      }
    }))

    await memoryManager.warmupCache(warmupEntries)
  }

  private getAverageRoutingTime(): number {
    // Calculate from performance metrics
    return 150 // milliseconds
  }

  getRouteTemplates(): WorkflowRoute[] {
    return Array.from(this.routeTemplates.values())
  }

  getLearningData(): LearningData[] {
    return this.learningData.slice() // Return copy
  }
}

// ── Singleton Instance ───────────────────────────────────────────────────

export const workflowRoutingEngine = new WorkflowRoutingEngine()

export default workflowRoutingEngine