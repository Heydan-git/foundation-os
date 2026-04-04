import React, { useState, useEffect } from 'react';

const FosGlobalInfrastructure = () => {
  const [deploymentStatus, setDeploymentStatus] = useState({
    'us-east': { status: 'healthy', latency: 45, uptime: 99.99 },
    'eu-west': { status: 'healthy', latency: 78, uptime: 99.98 },
    'asia-pacific': { status: 'deploying', latency: 120, uptime: 99.95 }
  });

  const [globalMetrics, setGlobalMetrics] = useState({
    totalUsers: 87234,
    activeRegions: 3,
    avgLatency: 81,
    globalUptime: 99.97,
    errorRate: 0.03,
    throughput: 1247
  });

  const [infrastructureComponents, setInfrastructureComponents] = useState([
    {
      name: 'Vercel Edge Network',
      status: 'operational',
      regions: ['iad1', 'dub1', 'sin1', 'sfo1'],
      health: 100
    },
    {
      name: 'Supabase Multi-Region',
      status: 'operational',
      regions: ['us-east-1', 'eu-west-1', 'ap-southeast-1'],
      health: 99
    },
    {
      name: 'CloudFlare CDN',
      status: 'operational',
      regions: ['Global Edge Network'],
      health: 100
    },
    {
      name: 'DataDog Monitoring',
      status: 'operational',
      regions: ['Multi-region'],
      health: 98
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setGlobalMetrics(prev => ({
        ...prev,
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 10),
        avgLatency: Math.max(50, prev.avgLatency + (Math.random() - 0.5) * 10),
        throughput: Math.max(1000, prev.throughput + (Math.random() - 0.5) * 100)
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const deployToRegion = (region) => {
    setDeploymentStatus(prev => ({
      ...prev,
      [region]: { ...prev[region], status: 'deploying' }
    }));

    // Simulate deployment process
    setTimeout(() => {
      setDeploymentStatus(prev => ({
        ...prev,
        [region]: { ...prev[region], status: 'healthy' }
      }));
    }, 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-400';
      case 'deploying': return 'text-yellow-400';
      case 'warning': return 'text-orange-400';
      case 'error': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getHealthColor = (health) => {
    if (health >= 99) return 'bg-green-500';
    if (health >= 95) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-[#06070C] text-[rgba(255,255,255,0.88)] p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-3 h-3 rounded-full bg-[#5EEAD4]"></div>
          <h1 className="text-3xl font-bold font-['Figtree']">
            🌍 Foundation OS Global Infrastructure
          </h1>
        </div>
        <p className="text-[rgba(255,255,255,0.42)] text-lg">
          Enterprise-grade global deployment monitoring and management
        </p>
      </div>

      {/* Global Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-6">
          <div className="text-[rgba(255,255,255,0.42)] text-sm font-medium mb-2">Total Users</div>
          <div className="text-2xl font-bold text-[#5EEAD4]">
            {globalMetrics.totalUsers.toLocaleString()}
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-6">
          <div className="text-[rgba(255,255,255,0.42)] text-sm font-medium mb-2">Active Regions</div>
          <div className="text-2xl font-bold text-green-400">
            {globalMetrics.activeRegions}
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-6">
          <div className="text-[rgba(255,255,255,0.42)] text-sm font-medium mb-2">Avg Latency</div>
          <div className="text-2xl font-bold text-blue-400">
            {Math.round(globalMetrics.avgLatency)}ms
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-6">
          <div className="text-[rgba(255,255,255,0.42)] text-sm font-medium mb-2">Global Uptime</div>
          <div className="text-2xl font-bold text-green-400">
            {globalMetrics.globalUptime}%
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-6">
          <div className="text-[rgba(255,255,255,0.42)] text-sm font-medium mb-2">Error Rate</div>
          <div className="text-2xl font-bold text-green-400">
            {globalMetrics.errorRate}%
          </div>
        </div>

        <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-6">
          <div className="text-[rgba(255,255,255,0.42)] text-sm font-medium mb-2">Throughput</div>
          <div className="text-2xl font-bold text-purple-400">
            {Math.round(globalMetrics.throughput)}/s
          </div>
        </div>
      </div>

      {/* Regional Deployment Status */}
      <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Regional Deployment Status</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(deploymentStatus).map(([region, data]) => (
            <div key={region} className="bg-[rgba(255,255,255,0.015)] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold capitalize">{region.replace('-', ' ')}</h3>
                <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(data.status)} bg-[rgba(255,255,255,0.05)]`}>
                  {data.status}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[rgba(255,255,255,0.42)]">Latency</span>
                  <span className="text-[#5EEAD4]">{data.latency}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[rgba(255,255,255,0.42)]">Uptime</span>
                  <span className="text-green-400">{data.uptime}%</span>
                </div>
              </div>

              <button
                onClick={() => deployToRegion(region)}
                disabled={data.status === 'deploying'}
                className="w-full mt-4 bg-[#5EEAD4] text-[#06070C] py-2 px-4 rounded-lg font-medium
                         hover:bg-[rgba(94,234,212,0.9)] transition-colors disabled:opacity-50"
              >
                {data.status === 'deploying' ? 'Deploying...' : 'Redeploy'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Infrastructure Components */}
      <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-8 mb-8">
        <h2 className="text-2xl font-bold mb-6">Infrastructure Components</h2>

        <div className="space-y-4">
          {infrastructureComponents.map((component, index) => (
            <div key={index} className="bg-[rgba(255,255,255,0.015)] rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold">{component.name}</h3>
                  <p className="text-[rgba(255,255,255,0.42)]">
                    {component.regions.join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getHealthColor(component.health)}`}></div>
                    <span className="text-sm">{component.health}%</span>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm ${getStatusColor(component.status)} bg-[rgba(255,255,255,0.05)]`}>
                    {component.status}
                  </div>
                </div>
              </div>

              <div className="w-full bg-[rgba(255,255,255,0.05)] rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getHealthColor(component.health)}`}
                  style={{ width: `${component.health}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deployment Actions */}
      <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-6">Global Deployment Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="bg-[#5EEAD4] text-[#06070C] py-3 px-6 rounded-lg font-medium
                           hover:bg-[rgba(94,234,212,0.9)] transition-colors">
            Deploy All Regions
          </button>

          <button className="bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.88)] py-3 px-6 rounded-lg font-medium
                           hover:bg-[rgba(255,255,255,0.1)] transition-colors border border-[rgba(255,255,255,0.1)]">
            Run Health Checks
          </button>

          <button className="bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.88)] py-3 px-6 rounded-lg font-medium
                           hover:bg-[rgba(255,255,255,0.1)] transition-colors border border-[rgba(255,255,255,0.1)]">
            Update CDN Cache
          </button>

          <button className="bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.88)] py-3 px-6 rounded-lg font-medium
                           hover:bg-[rgba(255,255,255,0.1)] transition-colors border border-[rgba(255,255,255,0.1)]">
            View Logs
          </button>
        </div>
      </div>

      {/* Real-time Status Indicator */}
      <div className="fixed bottom-8 right-8 bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)]
                      rounded-xl p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-sm font-medium">Global Infrastructure Online</span>
        </div>
      </div>
    </div>
  );
};

export default FosGlobalInfrastructure;