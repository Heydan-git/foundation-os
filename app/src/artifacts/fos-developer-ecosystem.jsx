import { useState, useEffect } from 'react'
import { Search, Package, Users, Code, Star, TrendingUp, Download, ExternalLink,
         Globe, Shield, Zap, BookOpen, MessageSquare, Award, ChevronRight } from 'lucide-react'

const FOS_DEVELOPER_ECOSYSTEM_KEY = 'fos-developer-ecosystem-v1'

export default function FOSDeveloperEcosystem() {
  const [activeSection, setActiveSection] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [ecosystemData, setEcosystemData] = useState({
    developers: { total: 12847, active: 8934, growth: 34 },
    plugins: { total: 1247, featured: 89, downloads: 156834 },
    community: { members: 45623, posts: 23456, satisfaction: 94 },
    revenue: { gmv: 478000, growth: 128, topEarner: 12400 }
  })

  // Load ecosystem data from storage
  useEffect(() => {
    try {
      const stored = window.localStorage?.getItem?.(FOS_DEVELOPER_ECOSYSTEM_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        setEcosystemData(prev => ({ ...prev, ...parsed }))
      }
    } catch (error) {
      console.warn('Failed to load ecosystem data:', error)
    }
  }, [])

  // Save data to storage
  const saveEcosystemData = (newData) => {
    try {
      const updated = { ...ecosystemData, ...newData }
      setEcosystemData(updated)
      window.localStorage?.setItem?.(FOS_DEVELOPER_ECOSYSTEM_KEY, JSON.stringify(updated))
    } catch (error) {
      console.warn('Failed to save ecosystem data:', error)
    }
  }

  // Sample data for different sections
  const pluginCategories = [
    { name: 'AI Workflows', count: 234, icon: '🤖', growth: '+45%' },
    { name: 'Integrations', count: 189, icon: '🔗', growth: '+32%' },
    { name: 'UI Components', count: 156, icon: '🎨', growth: '+28%' },
    { name: 'Developer Tools', count: 134, icon: '🛠️', growth: '+41%' },
    { name: 'Enterprise Solutions', count: 98, icon: '🏢', growth: '+67%' },
    { name: 'Security Add-ons', count: 87, icon: '🛡️', growth: '+23%' }
  ]

  const featuredPlugins = [
    { name: 'AI Code Assistant', author: 'DevCorp', rating: 4.9, downloads: 12450, price: '$29', category: 'AI Workflows' },
    { name: 'Enterprise Security Suite', author: 'SecureTeam', rating: 4.8, downloads: 8934, price: '$99', category: 'Security' },
    { name: 'Multi-Cloud Deploy', author: 'CloudMaster', rating: 4.7, downloads: 7823, price: '$49', category: 'DevOps' },
    { name: 'Real-time Analytics', author: 'DataViz Pro', rating: 4.8, downloads: 6712, price: '$39', category: 'Analytics' }
  ]

  const communityStats = [
    { label: 'Discord Members', value: '45.6K', change: '+12%', icon: MessageSquare },
    { label: 'GitHub Stars', value: '23.4K', change: '+34%', icon: Star },
    { label: 'Daily Active Devs', value: '8.9K', change: '+28%', icon: Code },
    { label: 'Community Rating', value: '4.9/5', change: '+0.2', icon: Award }
  ]

  const developmentTools = [
    { name: 'FOS CLI', description: 'Command-line interface for plugin development', status: '✅ Stable', version: 'v2.1.0' },
    { name: 'VS Code Extension', description: 'Full IDE integration with debugging', status: '✅ Stable', version: 'v1.8.2' },
    { name: 'Testing Framework', description: 'Comprehensive testing tools for plugins', status: '🚧 Beta', version: 'v0.9.1' },
    { name: 'Performance Monitor', description: 'Real-time plugin performance analytics', status: '✅ Stable', version: 'v1.5.3' },
    { name: 'Security Scanner', description: 'Automated vulnerability detection', status: '✅ Stable', version: 'v2.0.1' },
    { name: 'Cloud Debugger', description: 'Remote debugging for deployed plugins', status: '🚧 Alpha', version: 'v0.7.0' }
  ]

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-500/10 to-purple-500/10 rounded-xl p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(94,234,212,0.1),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(167,139,250,0.1),transparent_50%)]" />
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-teal-400/20 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Foundation OS Developer Ecosystem</h2>
              <p className="text-white/70">The world's most advanced AI-driven OS development platform</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-teal-400">{ecosystemData.developers.total.toLocaleString()}</div>
              <div className="text-white/70 text-sm">Registered Developers</div>
              <div className="text-green-400 text-xs">+{ecosystemData.developers.growth}% this month</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-400">{ecosystemData.plugins.total.toLocaleString()}</div>
              <div className="text-white/70 text-sm">Published Plugins</div>
              <div className="text-green-400 text-xs">+67 this week</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-400">{(ecosystemData.revenue.gmv / 1000).toFixed(0)}K</div>
              <div className="text-white/70 text-sm">Revenue GMV</div>
              <div className="text-green-400 text-xs">+{ecosystemData.revenue.growth}% growth</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-400">{ecosystemData.community.satisfaction}%</div>
              <div className="text-white/70 text-sm">Satisfaction Score</div>
              <div className="text-green-400 text-xs">Industry leading</div>
            </div>
          </div>
        </div>
      </div>

      {/* Ecosystem Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Developer Portal', icon: BookOpen, desc: 'Interactive docs & tutorials', color: 'teal' },
          { title: 'Plugin Marketplace', icon: Package, desc: 'Revenue sharing ecosystem', color: 'purple' },
          { title: 'Community Forums', icon: Users, desc: 'Global developer network', color: 'blue' },
          { title: 'Developer Tools', icon: Code, desc: 'Production-ready toolkit', color: 'yellow' }
        ].map((pillar, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors">
            <div className={`w-12 h-12 bg-${pillar.color}-400/20 rounded-lg flex items-center justify-center mb-4`}>
              <pillar.icon className={`w-6 h-6 text-${pillar.color}-400`} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{pillar.title}</h3>
            <p className="text-white/70 text-sm">{pillar.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )

  const renderMarketplace = () => (
    <div className="space-y-6">
      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Search plugins, developers, categories..."
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/40"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg font-medium transition-colors">
          Advanced Filters
        </button>
      </div>

      {/* Plugin Categories */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Plugin Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pluginCategories.map((category, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <div className="font-semibold text-white">{category.name}</div>
                    <div className="text-white/70 text-sm">{category.count} plugins</div>
                  </div>
                </div>
                <div className="text-green-400 text-sm">{category.growth}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Plugins */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Featured Plugins</h3>
          <button className="text-teal-400 hover:text-teal-300 flex items-center space-x-1">
            <span>View all</span>
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {featuredPlugins.map((plugin, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-white">{plugin.name}</h4>
                  <p className="text-white/70 text-sm">by {plugin.author}</p>
                </div>
                <div className="text-right">
                  <div className="text-white font-semibold">{plugin.price}</div>
                  <div className="flex items-center space-x-1 text-sm">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-white/70">{plugin.rating}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-white/70">
                  <div className="flex items-center space-x-1">
                    <Download className="w-4 h-4" />
                    <span>{plugin.downloads.toLocaleString()}</span>
                  </div>
                  <span className="px-2 py-1 bg-white/10 rounded text-xs">{plugin.category}</span>
                </div>
                <button className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded text-sm font-medium transition-colors">
                  Install
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderCommunity = () => (
    <div className="space-y-6">
      {/* Community Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {communityStats.map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-teal-400/20 rounded-lg flex items-center justify-center">
                <stat.icon className="w-4 h-4 text-teal-400" />
              </div>
              <div>
                <div className="font-semibold text-white">{stat.value}</div>
                <div className="text-green-400 text-xs">{stat.change}</div>
              </div>
            </div>
            <div className="text-white/70 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Community Platforms */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Join Our Community</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Discord Server', members: '45.6K', icon: '💬', color: 'indigo' },
            { name: 'GitHub Discussions', posts: '12.3K', icon: '📝', color: 'gray' },
            { name: 'Stack Overflow', questions: '8.9K', icon: '❓', color: 'orange' },
            { name: 'Reddit Community', subscribers: '23.4K', icon: '🤖', color: 'red' }
          ].map((platform, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="text-2xl mb-2">{platform.icon}</div>
              <div className="font-semibold text-white">{platform.name}</div>
              <div className="text-white/70 text-sm">{platform.members || platform.posts || platform.questions || platform.subscribers} active</div>
              <button className="mt-3 w-full py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors">
                Join Now
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Developer Programs */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Developer Programs</h3>
        <div className="space-y-4">
          {[
            { title: 'Developer Ambassador Program', desc: 'Lead your local community and get exclusive benefits', badge: 'Elite' },
            { title: 'Open Source Champions', desc: 'Recognition for outstanding community contributions', badge: 'Hero' },
            { title: 'Student Program', desc: 'Free access and resources for students and educators', badge: 'Academic' },
            { title: 'Enterprise Partners', desc: 'Collaborate on enterprise solutions and integrations', badge: 'Business' }
          ].map((program, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold text-white flex items-center space-x-2">
                  <span>{program.title}</span>
                  <span className="px-2 py-1 bg-teal-500/20 text-teal-400 text-xs rounded">{program.badge}</span>
                </div>
                <div className="text-white/70 text-sm mt-1">{program.desc}</div>
              </div>
              <button className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded text-sm font-medium transition-colors">
                Apply
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderDeveloperTools = () => (
    <div className="space-y-6">
      {/* Tools Overview */}
      <div className="bg-white/5 border border-white/10 rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-purple-400/20 rounded-lg flex items-center justify-center">
            <Code className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Foundation OS Development Kit</h3>
            <p className="text-white/70">Complete toolkit for building AI-driven plugins and applications</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400 mb-1">2.1.0</div>
            <div className="text-white/70 text-sm">Latest CLI Version</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400 mb-1">95%</div>
            <div className="text-white/70 text-sm">Developer Satisfaction</div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400 mb-1">24/7</div>
            <div className="text-white/70 text-sm">Support Available</div>
          </div>
        </div>
      </div>

      {/* Development Tools List */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-4">Available Tools</h3>
        <div className="space-y-4">
          {developmentTools.map((tool, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="font-semibold text-white">{tool.name}</h4>
                    <span className="text-white/50 text-sm">{tool.version}</span>
                    <span className="text-sm">{tool.status}</span>
                  </div>
                  <p className="text-white/70 text-sm">{tool.description}</p>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button className="px-3 py-2 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors">
                    Download
                  </button>
                  <button className="px-3 py-2 bg-teal-500 hover:bg-teal-600 rounded text-sm font-medium transition-colors">
                    Docs
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-gradient-to-r from-teal-500/10 to-purple-500/10 border border-white/10 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Quick Start Guide</h3>
        <div className="space-y-3">
          {[
            '1. Install the Foundation OS CLI: npm install -g @foundation-os/cli',
            '2. Create your first plugin: fos init my-awesome-plugin',
            '3. Start development server: fos dev',
            '4. Build and test: fos build && fos test',
            '5. Publish to marketplace: fos publish'
          ].map((step, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {i + 1}
              </div>
              <code className="bg-black/20 px-3 py-1 rounded text-sm text-white font-mono">{step}</code>
            </div>
          ))}
        </div>
        <button className="mt-6 px-6 py-3 bg-teal-500 hover:bg-teal-600 rounded-lg font-medium transition-colors">
          Start Building Now
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#06070C] text-white font-figtree">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-purple-400 rounded-lg flex items-center justify-center">
                <span className="font-bold text-sm">FOS</span>
              </div>
              <div>
                <div className="font-semibold">Developer Ecosystem</div>
                <div className="text-xs text-white/60">Build the future with AI</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors">
                Sign In
              </button>
              <button className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg text-sm font-medium transition-colors">
                Join Community
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-white/10 bg-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Globe },
              { id: 'marketplace', label: 'Marketplace', icon: Package },
              { id: 'community', label: 'Community', icon: Users },
              { id: 'tools', label: 'Developer Tools', icon: Code }
            ].map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors ${
                  activeSection === section.id
                    ? 'border-teal-400 text-teal-400'
                    : 'border-transparent text-white/70 hover:text-white'
                }`}
              >
                <section.icon className="w-4 h-4" />
                <span className="font-medium">{section.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {activeSection === 'overview' && renderOverview()}
        {activeSection === 'marketplace' && renderMarketplace()}
        {activeSection === 'community' && renderCommunity()}
        {activeSection === 'tools' && renderDeveloperTools()}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-white/5 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="font-semibold mb-4">Foundation OS</div>
              <p className="text-white/70 text-sm">
                The world's first AI-driven operating system with a revolutionary developer ecosystem.
              </p>
            </div>
            <div>
              <div className="font-semibold mb-4">Developers</div>
              <div className="space-y-2 text-sm text-white/70">
                <div>Documentation</div>
                <div>API Reference</div>
                <div>Tutorials</div>
                <div>Examples</div>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-4">Community</div>
              <div className="space-y-2 text-sm text-white/70">
                <div>Discord Server</div>
                <div>GitHub</div>
                <div>Stack Overflow</div>
                <div>Reddit</div>
              </div>
            </div>
            <div>
              <div className="font-semibold mb-4">Enterprise</div>
              <div className="space-y-2 text-sm text-white/70">
                <div>Enterprise Solutions</div>
                <div>Partner Program</div>
                <div>Support</div>
                <div>Contact Sales</div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 flex items-center justify-between text-sm text-white/70">
            <div>© 2026 Foundation OS. All rights reserved.</div>
            <div>Building the future of AI-driven development.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}