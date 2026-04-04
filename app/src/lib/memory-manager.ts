/**
 * memory-manager.ts - Memory Management System for Foundation OS Phase 4
 * LRU cache, resource throttling, and eviction policies for 250+ MCP tools
 * Revolutionary memory optimization for intelligent orchestration
 */

// ── Memory Types ──────────────────────────────────────────────────────────

interface MemoryEntry<T = any> {
  key: string
  value: T
  size: number
  accessCount: number
  lastAccessed: number
  createdAt: number
  expiration?: number
  priority: 'low' | 'medium' | 'high' | 'critical'
  metadata: {
    toolId?: string
    category?: string
    source?: string
    dependencies?: string[]
  }
}

interface CacheStats {
  totalSize: number
  maxSize: number
  entryCount: number
  maxEntries: number
  hitRate: number
  totalHits: number
  totalMisses: number
  evictionCount: number
  lastEviction?: string
}

interface ResourceUsage {
  cpu: number // percentage
  memory: number // MB
  network: number // MB/s
  disk: number // MB
  timestamp: number
}

interface EvictionPolicy {
  name: string
  weight: number
  algorithm: (entries: MemoryEntry[]) => MemoryEntry[]
}

interface ThrottleRule {
  id: string
  condition: (usage: ResourceUsage) => boolean
  action: 'warn' | 'delay' | 'block'
  params: {
    delay?: number
    maxRetries?: number
    backoffMultiplier?: number
  }
}

// ── LRU Cache Implementation ──────────────────────────────────────────────

class LRUNode<T = any> {
  constructor(
    public key: string,
    public value: MemoryEntry<T>,
    public prev: LRUNode<T> | null = null,
    public next: LRUNode<T> | null = null
  ) {}
}

class LRUCache<T = any> {
  private capacity: number
  private size: number = 0
  private cache: Map<string, LRUNode<T>> = new Map()
  private head: LRUNode<T>
  private tail: LRUNode<T>

  constructor(capacity: number) {
    this.capacity = capacity

    // Create dummy head and tail nodes
    this.head = new LRUNode('__head__', {} as MemoryEntry<T>)
    this.tail = new LRUNode('__tail__', {} as MemoryEntry<T>)
    this.head.next = this.tail
    this.tail.prev = this.head
  }

  get(key: string): MemoryEntry<T> | null {
    const node = this.cache.get(key)
    if (!node) return null

    // Move to front (most recently used)
    this.moveToHead(node)

    // Update access metadata
    node.value.accessCount++
    node.value.lastAccessed = Date.now()

    return node.value
  }

  put(key: string, entry: MemoryEntry<T>): void {
    const existingNode = this.cache.get(key)

    if (existingNode) {
      // Update existing entry
      existingNode.value = entry
      this.moveToHead(existingNode)
    } else {
      // Add new entry
      const newNode = new LRUNode(key, entry)

      if (this.size >= this.capacity) {
        // Remove least recently used
        const tail = this.removeTail()
        if (tail) {
          this.cache.delete(tail.key)
          this.size--
        }
      }

      this.cache.set(key, newNode)
      this.addToHead(newNode)
      this.size++
    }
  }

  remove(key: string): boolean {
    const node = this.cache.get(key)
    if (!node) return false

    this.removeNode(node)
    this.cache.delete(key)
    this.size--
    return true
  }

  private addToHead(node: LRUNode<T>): void {
    node.prev = this.head
    node.next = this.head.next

    if (this.head.next) {
      this.head.next.prev = node
    }
    this.head.next = node
  }

  private removeNode(node: LRUNode<T>): void {
    if (node.prev) {
      node.prev.next = node.next
    }
    if (node.next) {
      node.next.prev = node.prev
    }
  }

  private moveToHead(node: LRUNode<T>): void {
    this.removeNode(node)
    this.addToHead(node)
  }

  private removeTail(): LRUNode<T> | null {
    const lastNode = this.tail.prev
    if (lastNode && lastNode !== this.head) {
      this.removeNode(lastNode)
      return lastNode
    }
    return null
  }

  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  values(): MemoryEntry<T>[] {
    return Array.from(this.cache.values()).map(node => node.value)
  }

  clear(): void {
    this.cache.clear()
    this.size = 0
    this.head.next = this.tail
    this.tail.prev = this.head
  }

  getSize(): number {
    return this.size
  }

  getCapacity(): number {
    return this.capacity
  }
}

// ── Memory Manager Core ───────────────────────────────────────────────────

export class MemoryManager {
  private cache: LRUCache
  private maxMemorySize: number // in bytes
  private currentMemorySize: number = 0
  private resourceUsage: ResourceUsage[] = []
  private throttleRules: ThrottleRule[] = []
  private evictionPolicies: EvictionPolicy[] = []
  private stats: CacheStats
  private gcInterval: NodeJS.Timeout | null = null

  constructor(options: {
    maxEntries?: number
    maxMemorySize?: number // MB
    gcIntervalMs?: number
  } = {}) {
    this.cache = new LRUCache(options.maxEntries || 10000)
    this.maxMemorySize = (options.maxMemorySize || 512) * 1024 * 1024 // Convert to bytes

    this.stats = {
      totalSize: 0,
      maxSize: this.maxMemorySize,
      entryCount: 0,
      maxEntries: options.maxEntries || 10000,
      hitRate: 0,
      totalHits: 0,
      totalMisses: 0,
      evictionCount: 0
    }

    this.initializeEvictionPolicies()
    this.initializeThrottleRules()
    this.startGarbageCollection(options.gcIntervalMs || 30000)

    console.log(`🧠 Memory Manager initialized: ${this.maxMemorySize / 1024 / 1024}MB max, ${this.cache.getCapacity()} max entries`)
  }

  // ── Cache Operations ──────────────────────────────────────────────────

  async get<T>(key: string): Promise<T | null> {
    const entry = this.cache.get(key)

    if (entry) {
      this.stats.totalHits++
      this.updateHitRate()

      // Check if entry is expired
      if (entry.expiration && Date.now() > entry.expiration) {
        this.remove(key)
        this.stats.totalMisses++
        return null
      }

      return entry.value as T
    }

    this.stats.totalMisses++
    this.updateHitRate()
    return null
  }

  async set<T>(
    key: string,
    value: T,
    options: {
      ttl?: number // milliseconds
      priority?: 'low' | 'medium' | 'high' | 'critical'
      toolId?: string
      category?: string
      source?: string
      dependencies?: string[]
    } = {}
  ): Promise<boolean> {
    // Check memory constraints
    const size = this.estimateSize(value)

    if (size > this.maxMemorySize) {
      console.warn(`⚠️ Entry too large for cache: ${size} bytes`)
      return false
    }

    // Check if we need to evict entries
    if (this.currentMemorySize + size > this.maxMemorySize) {
      await this.evictEntries(size)
    }

    // Create memory entry
    const entry: MemoryEntry<T> = {
      key,
      value,
      size,
      accessCount: 1,
      lastAccessed: Date.now(),
      createdAt: Date.now(),
      expiration: options.ttl ? Date.now() + options.ttl : undefined,
      priority: options.priority || 'medium',
      metadata: {
        toolId: options.toolId,
        category: options.category,
        source: options.source,
        dependencies: options.dependencies
      }
    }

    // Store in cache
    this.cache.put(key, entry)
    this.currentMemorySize += size

    // Update stats
    this.stats.entryCount = this.cache.getSize()
    this.stats.totalSize = this.currentMemorySize

    console.log(`💾 Cached entry: ${key} (${this.formatBytes(size)})`)
    return true
  }

  remove(key: string): boolean {
    const entry = this.cache.get(key)
    if (entry) {
      this.currentMemorySize -= entry.size
      this.stats.entryCount = this.cache.getSize() - 1
      this.stats.totalSize = this.currentMemorySize
    }

    return this.cache.remove(key)
  }

  clear(): void {
    this.cache.clear()
    this.currentMemorySize = 0
    this.stats.entryCount = 0
    this.stats.totalSize = 0
    console.log('🧹 Memory cache cleared')
  }

  // ── Eviction Policies ────────────────────────────────────────────────

  private initializeEvictionPolicies(): void {
    this.evictionPolicies = [
      {
        name: 'LRU',
        weight: 0.4,
        algorithm: (entries) => {
          return entries.sort((a, b) => a.lastAccessed - b.lastAccessed)
        }
      },
      {
        name: 'Size-based',
        weight: 0.3,
        algorithm: (entries) => {
          return entries.sort((a, b) => b.size - a.size)
        }
      },
      {
        name: 'Priority-based',
        weight: 0.2,
        algorithm: (entries) => {
          const priorityOrder = { low: 0, medium: 1, high: 2, critical: 3 }
          return entries.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
        }
      },
      {
        name: 'Access-frequency',
        weight: 0.1,
        algorithm: (entries) => {
          return entries.sort((a, b) => a.accessCount - b.accessCount)
        }
      }
    ]
  }

  private async evictEntries(requiredSize: number): Promise<void> {
    console.log(`🗑️ Evicting entries to free ${this.formatBytes(requiredSize)}`)

    let freedSize = 0
    const entries = this.cache.values()

    // Apply composite eviction algorithm
    const candidates = this.selectEvictionCandidates(entries)

    for (const entry of candidates) {
      if (freedSize >= requiredSize) break

      // Don't evict critical entries unless absolutely necessary
      if (entry.priority === 'critical' && freedSize > 0) continue

      this.remove(entry.key)
      freedSize += entry.size
      this.stats.evictionCount++
      this.stats.lastEviction = new Date().toISOString()
    }

    console.log(`✅ Evicted entries: ${this.formatBytes(freedSize)} freed`)
  }

  private selectEvictionCandidates(entries: MemoryEntry[]): MemoryEntry[] {
    // Composite scoring based on multiple policies
    const scoredEntries = entries.map(entry => ({
      entry,
      score: this.calculateEvictionScore(entry)
    }))

    // Sort by score (lower score = better candidate for eviction)
    return scoredEntries
      .sort((a, b) => a.score - b.score)
      .map(item => item.entry)
  }

  private calculateEvictionScore(entry: MemoryEntry): number {
    let score = 0

    // Age factor (older entries score lower)
    const age = Date.now() - entry.createdAt
    score += (age / (24 * 60 * 60 * 1000)) * 10 // Days to score

    // Access frequency factor
    const hoursSinceCreation = age / (60 * 60 * 1000)
    const accessFrequency = entry.accessCount / Math.max(hoursSinceCreation, 1)
    score += accessFrequency * 20

    // Priority factor
    const priorityBonus = { low: 0, medium: 10, high: 25, critical: 50 }
    score += priorityBonus[entry.priority]

    // Size factor (larger entries get slightly higher scores for eviction)
    score -= (entry.size / (1024 * 1024)) * 2 // MB to penalty

    // Recency factor
    const hoursSinceLastAccess = (Date.now() - entry.lastAccessed) / (60 * 60 * 1000)
    score -= hoursSinceLastAccess * 5

    return score
  }

  // ── Resource Throttling ──────────────────────────────────────────────

  private initializeThrottleRules(): void {
    this.throttleRules = [
      {
        id: 'high-memory-usage',
        condition: (usage) => usage.memory > 400, // >400MB
        action: 'delay',
        params: { delay: 100, maxRetries: 3 }
      },
      {
        id: 'extreme-memory-usage',
        condition: (usage) => usage.memory > 480, // >480MB
        action: 'block',
        params: { delay: 1000, maxRetries: 1 }
      },
      {
        id: 'high-cpu-usage',
        condition: (usage) => usage.cpu > 80, // >80%
        action: 'delay',
        params: { delay: 50, maxRetries: 5 }
      },
      {
        id: 'high-network-usage',
        condition: (usage) => usage.network > 50, // >50MB/s
        action: 'warn',
        params: {}
      }
    ]
  }

  async checkResourceThrottling(): Promise<{ allowed: boolean; delay?: number; reason?: string }> {
    const currentUsage = await this.getCurrentResourceUsage()

    for (const rule of this.throttleRules) {
      if (rule.condition(currentUsage)) {
        switch (rule.action) {
          case 'block':
            return {
              allowed: false,
              reason: `Resource usage too high: ${rule.id}`
            }
          case 'delay':
            return {
              allowed: true,
              delay: rule.params.delay,
              reason: `Resource throttling: ${rule.id}`
            }
          case 'warn':
            console.warn(`⚠️ Resource warning: ${rule.id}`)
            break
        }
      }
    }

    return { allowed: true }
  }

  private async getCurrentResourceUsage(): Promise<ResourceUsage> {
    // In a real implementation, this would measure actual system resources
    const usage: ResourceUsage = {
      cpu: this.estimateCpuUsage(),
      memory: this.currentMemorySize / (1024 * 1024), // Convert to MB
      network: this.estimateNetworkUsage(),
      disk: this.estimateDiskUsage(),
      timestamp: Date.now()
    }

    // Keep resource usage history
    this.resourceUsage.push(usage)
    if (this.resourceUsage.length > 100) {
      this.resourceUsage.shift()
    }

    return usage
  }

  private estimateCpuUsage(): number {
    // Simplified CPU usage estimation based on cache operations
    const recentOperations = this.stats.totalHits + this.stats.totalMisses
    return Math.min(100, (recentOperations / 1000) * 50)
  }

  private estimateNetworkUsage(): number {
    // Simplified network usage estimation
    const cacheSize = this.currentMemorySize / (1024 * 1024) // MB
    return Math.min(100, cacheSize / 10) // Assume 10MB/s max
  }

  private estimateDiskUsage(): number {
    // Simplified disk usage estimation
    return this.currentMemorySize / (1024 * 1024) // Same as memory for now
  }

  // ── Garbage Collection ───────────────────────────────────────────────

  private startGarbageCollection(intervalMs: number): void {
    this.gcInterval = setInterval(() => {
      this.performGarbageCollection()
    }, intervalMs)

    console.log(`♻️ Garbage collection started: ${intervalMs}ms interval`)
  }

  private performGarbageCollection(): void {
    const startTime = Date.now()
    let cleanedEntries = 0
    let freedMemory = 0

    console.log('♻️ Starting garbage collection...')

    // Remove expired entries
    for (const key of this.cache.keys()) {
      const entry = this.cache.get(key)
      if (entry && entry.expiration && Date.now() > entry.expiration) {
        freedMemory += entry.size
        this.remove(key)
        cleanedEntries++
      }
    }

    // Compact cache if memory usage is high
    if (this.currentMemorySize > this.maxMemorySize * 0.8) {
      console.log('🗜️ Memory usage high, performing compaction...')

      // Remove low-priority, rarely accessed entries
      const entries = this.cache.values()
      const lowValueEntries = entries
        .filter(entry =>
          entry.priority === 'low' &&
          entry.accessCount < 3 &&
          Date.now() - entry.lastAccessed > 60 * 60 * 1000 // 1 hour
        )
        .slice(0, 50) // Limit cleanup to 50 entries per GC cycle

      for (const entry of lowValueEntries) {
        freedMemory += entry.size
        this.remove(entry.key)
        cleanedEntries++
      }
    }

    const duration = Date.now() - startTime

    if (cleanedEntries > 0) {
      console.log(`✅ Garbage collection completed: ${cleanedEntries} entries cleaned, ${this.formatBytes(freedMemory)} freed in ${duration}ms`)
    }
  }

  stopGarbageCollection(): void {
    if (this.gcInterval) {
      clearInterval(this.gcInterval)
      this.gcInterval = null
      console.log('♻️ Garbage collection stopped')
    }
  }

  // ── Memory Analytics ─────────────────────────────────────────────────

  getMemoryStats(): CacheStats & {
    memoryUsagePercent: number
    entryUsagePercent: number
    averageEntrySize: number
    resourceUsage: ResourceUsage[]
  } {
    const memoryUsagePercent = (this.currentMemorySize / this.maxMemorySize) * 100
    const entryUsagePercent = (this.cache.getSize() / this.cache.getCapacity()) * 100
    const averageEntrySize = this.cache.getSize() > 0 ? this.currentMemorySize / this.cache.getSize() : 0

    return {
      ...this.stats,
      memoryUsagePercent,
      entryUsagePercent,
      averageEntrySize,
      resourceUsage: this.resourceUsage.slice(-10) // Last 10 measurements
    }
  }

  getEntriesByCategory(): Record<string, { count: number; size: number }> {
    const categories: Record<string, { count: number; size: number }> = {}

    for (const entry of this.cache.values()) {
      const category = entry.metadata.category || 'uncategorized'

      if (!categories[category]) {
        categories[category] = { count: 0, size: 0 }
      }

      categories[category].count++
      categories[category].size += entry.size
    }

    return categories
  }

  getTopEntries(sortBy: 'size' | 'access' | 'age' = 'size', limit = 10): MemoryEntry[] {
    const entries = this.cache.values()

    const sorted = entries.sort((a, b) => {
      switch (sortBy) {
        case 'size':
          return b.size - a.size
        case 'access':
          return b.accessCount - a.accessCount
        case 'age':
          return b.createdAt - a.createdAt
        default:
          return 0
      }
    })

    return sorted.slice(0, limit)
  }

  // ── Cache Optimization ──────────────────────────────────────────────

  async optimizeCache(): Promise<{
    optimized: number
    freedMemory: number
    suggestions: string[]
  }> {
    console.log('🚀 Starting cache optimization...')

    let optimizedEntries = 0
    let freedMemory = 0
    const suggestions: string[] = []

    // Remove duplicate entries
    const duplicates = this.findDuplicateEntries()
    for (const key of duplicates) {
      const entry = this.cache.get(key)
      if (entry) {
        freedMemory += entry.size
        this.remove(key)
        optimizedEntries++
      }
    }

    // Suggest optimizations
    const stats = this.getMemoryStats()

    if (stats.hitRate < 0.5) {
      suggestions.push('Consider reviewing cache keys for better hit rates')
    }

    if (stats.memoryUsagePercent > 90) {
      suggestions.push('Memory usage is very high, consider increasing cache size or reducing TTLs')
    }

    const categories = this.getEntriesByCategory()
    const largestCategory = Object.entries(categories)
      .sort(([,a], [,b]) => b.size - a.size)[0]

    if (largestCategory && largestCategory[1].size > this.maxMemorySize * 0.5) {
      suggestions.push(`Category '${largestCategory[0]}' uses over 50% of cache memory`)
    }

    console.log(`✅ Cache optimization completed: ${optimizedEntries} entries optimized, ${this.formatBytes(freedMemory)} freed`)

    return { optimized: optimizedEntries, freedMemory, suggestions }
  }

  private findDuplicateEntries(): string[] {
    const seen = new Map<string, string>()
    const duplicates: string[] = []

    for (const entry of this.cache.values()) {
      const hash = this.hashValue(entry.value)
      const existingKey = seen.get(hash)

      if (existingKey) {
        duplicates.push(entry.key)
      } else {
        seen.set(hash, entry.key)
      }
    }

    return duplicates
  }

  // ── Utility Methods ──────────────────────────────────────────────────

  private estimateSize(value: any): number {
    if (typeof value === 'string') {
      return value.length * 2 // UTF-16
    }
    if (typeof value === 'number') {
      return 8
    }
    if (typeof value === 'boolean') {
      return 4
    }
    if (value === null || value === undefined) {
      return 4
    }

    // For objects, use JSON serialization as approximation
    try {
      return JSON.stringify(value).length * 2
    } catch {
      return 1024 // Default estimate for non-serializable objects
    }
  }

  private hashValue(value: any): string {
    try {
      const str = JSON.stringify(value)
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i)
        hash = ((hash << 5) - hash) + char
        hash = hash & hash // Convert to 32-bit integer
      }
      return hash.toString()
    } catch {
      return Math.random().toString()
    }
  }

  private formatBytes(bytes: number): string {
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
  }

  private updateHitRate(): void {
    const total = this.stats.totalHits + this.stats.totalMisses
    this.stats.hitRate = total > 0 ? this.stats.totalHits / total : 0
  }

  // ── Public API ───────────────────────────────────────────────────────

  async warmupCache(entries: Array<{
    key: string
    value: any
    options?: {
      ttl?: number
      priority?: 'low' | 'medium' | 'high' | 'critical'
      toolId?: string
      category?: string
    }
  }>): Promise<number> {
    console.log(`🔥 Warming up cache with ${entries.length} entries...`)

    let loaded = 0
    for (const entry of entries) {
      const success = await this.set(entry.key, entry.value, entry.options)
      if (success) loaded++
    }

    console.log(`✅ Cache warmup completed: ${loaded}/${entries.length} entries loaded`)
    return loaded
  }

  async prefetchData(keys: string[], fetchFn: (key: string) => Promise<any>): Promise<void> {
    console.log(`⚡ Prefetching ${keys.length} entries...`)

    const prefetchPromises = keys.map(async (key) => {
      const cached = await this.get(key)
      if (!cached) {
        try {
          const data = await fetchFn(key)
          await this.set(key, data, { category: 'prefetch', priority: 'low' })
        } catch (error) {
          console.warn(`⚠️ Failed to prefetch ${key}:`, error)
        }
      }
    })

    await Promise.all(prefetchPromises)
    console.log(`✅ Prefetch completed`)
  }

  destroy(): void {
    this.stopGarbageCollection()
    this.clear()
    console.log('💥 Memory Manager destroyed')
  }
}

// ── Singleton Instance ───────────────────────────────────────────────────

export const memoryManager = new MemoryManager({
  maxEntries: 10000,
  maxMemorySize: 512, // 512MB
  gcIntervalMs: 30000 // 30 seconds
})

export default memoryManager