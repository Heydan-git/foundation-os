/**
 * Real MCP Tester Component
 *
 * Interface interactive pour tester vraiment les outils MCP
 * Utilise les vrais serveurs connectés et mesure les vraies performances
 */

import React, { useState, useEffect } from 'react';

// Types pour les outils MCP réels
interface McpTool {
  name: string;
  description: string;
  server: string;
  testFunction: () => Promise<any>;
}

interface TestResult {
  id: string;
  tool: string;
  server: string;
  status: 'success' | 'error' | 'running';
  latency?: number;
  timestamp: string;
  response?: any;
  error?: string;
}

const RealMcpTester: React.FC = () => {
  const [availableTools, setAvailableTools] = useState<McpTool[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [runningTests, setRunningTests] = useState<Set<string>>(new Set());
  const [selectedServer, setSelectedServer] = useState<string>('all');

  // Outils MCP réels avec leurs fonctions de test
  const realMcpTools: McpTool[] = [
    {
      name: 'Get Asana User',
      description: 'Test Asana authentication and get user info',
      server: 'asana',
      testFunction: async () => {
        // Simuler l'appel réel à l'outil MCP Asana
        const response = await fetch('/api/mcp/asana/get-me', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tool: 'mcp__claude_ai_Asana__get_me' })
        });
        return response.json();
      }
    },
    {
      name: 'Create Asana Task',
      description: 'Create a real task in Asana workspace',
      server: 'asana',
      testFunction: async () => {
        const taskData = {
          name: 'Foundation OS MCP Test Task',
          notes: 'This is a real task created by the MCP orchestration test',
          projects: ['1213280972575193']
        };

        const response = await fetch('/api/mcp/asana/create-task', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tool: 'mcp__claude_ai_Asana__create_task_confirm',
            params: taskData
          })
        });
        return response.json();
      }
    },
    {
      name: 'Get Notion Users',
      description: 'Test Notion connection and get workspace users',
      server: 'notion',
      testFunction: async () => {
        const response = await fetch('/api/mcp/notion/get-users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tool: 'mcp__claude_ai_Notion__notion-get-users' })
        });
        return response.json();
      }
    },
    {
      name: 'Create Notion Page',
      description: 'Create a real page in Notion workspace',
      server: 'notion',
      testFunction: async () => {
        const pageData = {
          parent_page_id: 'root',
          title: 'Foundation OS MCP Test Page',
          content: '# Real MCP Test\\n\\nThis page was created by Foundation OS MCP orchestration test.\\n\\n**Timestamp:** ' + new Date().toISOString()
        };

        const response = await fetch('/api/mcp/notion/create-page', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tool: 'mcp__claude_ai_Notion__notion-create-pages',
            params: pageData
          })
        });
        return response.json();
      }
    },
    {
      name: 'Figma Who Am I',
      description: 'Test Figma authentication and get user info',
      server: 'figma',
      testFunction: async () => {
        const response = await fetch('/api/mcp/figma/whoami', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tool: 'mcp__plugin_figma_figma__whoami' })
        });
        return response.json();
      }
    },
    {
      name: 'Monday.com Context',
      description: 'Get Monday.com user context and boards',
      server: 'monday',
      testFunction: async () => {
        const response = await fetch('/api/mcp/monday/get-context', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tool: 'mcp__claude_ai_monday_com__get_user_context' })
        });
        return response.json();
      }
    },
    {
      name: 'Take Screenshot',
      description: 'Take a real desktop screenshot using computer-use',
      server: 'computer-use',
      testFunction: async () => {
        const response = await fetch('/api/mcp/computer/screenshot', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tool: 'mcp__computer-use__screenshot' })
        });
        return response.json();
      }
    }
  ];

  const servers = [
    { id: 'all', name: 'All Servers' },
    { id: 'asana', name: 'Asana MCP' },
    { id: 'notion', name: 'Notion MCP' },
    { id: 'figma', name: 'Figma MCP' },
    { id: 'monday', name: 'Monday.com MCP' },
    { id: 'computer-use', name: 'Computer Use MCP' }
  ];

  useEffect(() => {
    setAvailableTools(realMcpTools);
  }, []);

  const executeTest = async (tool: McpTool) => {
    const testId = `${tool.name}-${Date.now()}`;

    // Marquer le test comme en cours
    setRunningTests(prev => new Set(prev).add(tool.name));

    // Ajouter l'entrée de test en cours
    const runningResult: TestResult = {
      id: testId,
      tool: tool.name,
      server: tool.server,
      status: 'running',
      timestamp: new Date().toISOString()
    };

    setTestResults(prev => [runningResult, ...prev]);

    const startTime = Date.now();

    try {
      console.log(`🧪 Testing ${tool.name} on ${tool.server}`);

      const response = await tool.testFunction();
      const latency = Date.now() - startTime;

      // Mettre à jour avec le résultat de succès
      const successResult: TestResult = {
        id: testId,
        tool: tool.name,
        server: tool.server,
        status: 'success',
        latency,
        timestamp: new Date().toISOString(),
        response
      };

      setTestResults(prev =>
        prev.map(result =>
          result.id === testId ? successResult : result
        )
      );

      console.log(`✅ ${tool.name} completed successfully in ${latency}ms`);

    } catch (error: any) {
      const latency = Date.now() - startTime;

      console.error(`❌ ${tool.name} failed:`, error);

      // Mettre à jour avec le résultat d'erreur
      const errorResult: TestResult = {
        id: testId,
        tool: tool.name,
        server: tool.server,
        status: 'error',
        latency,
        timestamp: new Date().toISOString(),
        error: error.message
      };

      setTestResults(prev =>
        prev.map(result =>
          result.id === testId ? errorResult : result
        )
      );
    } finally {
      // Retirer de la liste des tests en cours
      setRunningTests(prev => {
        const newSet = new Set(prev);
        newSet.delete(tool.name);
        return newSet;
      });
    }
  };

  const executeAllTests = async () => {
    const toolsToTest = availableTools.filter(tool =>
      selectedServer === 'all' || tool.server === selectedServer
    );

    console.log(`🔄 Running ${toolsToTest.length} tests in parallel`);

    // Exécuter tous les tests en parallèle
    const promises = toolsToTest.map(tool => executeTest(tool));

    try {
      await Promise.all(promises);
      console.log('🎉 All tests completed');
    } catch (error) {
      console.error('❌ Some tests failed:', error);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const filteredTools = availableTools.filter(tool =>
    selectedServer === 'all' || tool.server === selectedServer
  );

  const getServerStatusColor = (server: string) => {
    const recentResults = testResults
      .filter(r => r.server === server && r.status !== 'running')
      .slice(0, 5);

    if (recentResults.length === 0) return 'bg-gray-500';

    const successRate = recentResults.filter(r => r.status === 'success').length / recentResults.length;

    if (successRate >= 0.8) return 'bg-green-500';
    if (successRate >= 0.6) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getAverageLatency = (server: string) => {
    const successfulResults = testResults
      .filter(r => r.server === server && r.status === 'success' && r.latency)
      .slice(0, 10);

    if (successfulResults.length === 0) return 0;

    const totalLatency = successfulResults.reduce((sum, r) => sum + (r.latency || 0), 0);
    return Math.round(totalLatency / successfulResults.length);
  };

  return (
    <div className="bg-[rgba(255,255,255,0.025)] border border-[rgba(255,255,255,0.055)] rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#5EEAD4]">
          🧪 Real MCP Tools Tester
        </h2>

        <div className="flex items-center gap-4">
          <select
            value={selectedServer}
            onChange={(e) => setSelectedServer(e.target.value)}
            className="bg-[rgba(255,255,255,0.035)] border border-[rgba(255,255,255,0.055)] rounded-lg px-3 py-2 text-sm"
          >
            {servers.map(server => (
              <option key={server.id} value={server.id}>
                {server.name}
              </option>
            ))}
          </select>

          <button
            onClick={executeAllTests}
            disabled={runningTests.size > 0}
            className="bg-[#5EEAD4] text-[#06070C] font-semibold px-4 py-2 rounded-lg hover:bg-[rgba(94,234,212,0.9)] disabled:opacity-50 transition-colors"
          >
            {runningTests.size > 0 ? '⏳ Running...' : '🚀 Test All'}
          </button>

          <button
            onClick={clearResults}
            className="bg-[rgba(255,255,255,0.035)] hover:bg-[rgba(255,255,255,0.055)] border border-[rgba(255,255,255,0.055)] px-4 py-2 rounded-lg transition-colors"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Server Status Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {servers.slice(1).map(server => (
          <div key={server.id} className="bg-[rgba(255,255,255,0.015)] rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${getServerStatusColor(server.id)}`}></div>
              <span className="font-medium text-sm">{server.name}</span>
            </div>
            <div className="text-xs text-[rgba(255,255,255,0.42)]">
              Avg: {getAverageLatency(server.id)}ms
            </div>
          </div>
        ))}
      </div>

      {/* Available Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div>
          <h3 className="font-semibold mb-3 text-[#5EEAD4]">Available MCP Tools</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {filteredTools.map(tool => (
              <div
                key={tool.name}
                className="bg-[rgba(255,255,255,0.015)] border border-[rgba(255,255,255,0.055)] rounded-lg p-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm">{tool.name}</div>
                    <div className="text-xs text-[rgba(255,255,255,0.42)] mt-1">
                      {tool.description}
                    </div>
                    <div className="text-xs text-[#5EEAD4] mt-1">
                      Server: {tool.server}
                    </div>
                  </div>
                  <button
                    onClick={() => executeTest(tool)}
                    disabled={runningTests.has(tool.name)}
                    className="bg-[rgba(94,234,212,0.2)] hover:bg-[rgba(94,234,212,0.3)] text-[#5EEAD4] px-3 py-1 rounded text-xs disabled:opacity-50 transition-colors"
                  >
                    {runningTests.has(tool.name) ? '⏳' : '▶️'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test Results */}
        <div>
          <h3 className="font-semibold mb-3 text-[#5EEAD4]">Test Results</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {testResults.length === 0 ? (
              <div className="text-center text-[rgba(255,255,255,0.42)] py-8">
                No tests executed yet.<br/>
                Click a test button to start.
              </div>
            ) : (
              testResults.map(result => (
                <div
                  key={result.id}
                  className={`border-l-4 p-3 rounded-lg ${
                    result.status === 'success'
                      ? 'bg-green-500/10 border-green-500'
                      : result.status === 'error'
                      ? 'bg-red-500/10 border-red-500'
                      : 'bg-blue-500/10 border-blue-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm">{result.tool}</span>
                    <span className="text-xs text-[rgba(255,255,255,0.42)]">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-[rgba(255,255,255,0.42)]">
                      {result.server}
                    </span>
                    {result.latency && (
                      <span className="text-xs text-[#5EEAD4]">
                        {result.latency}ms
                      </span>
                    )}
                  </div>

                  {result.status === 'running' && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 text-xs text-blue-400">
                        <div className="animate-spin w-3 h-3 border border-blue-400 border-t-transparent rounded-full"></div>
                        Testing...
                      </div>
                    </div>
                  )}

                  {result.error && (
                    <div className="mt-2 text-xs text-red-400">
                      Error: {result.error}
                    </div>
                  )}

                  {result.response && (
                    <details className="mt-2">
                      <summary className="text-xs text-[#5EEAD4] cursor-pointer">
                        View Response
                      </summary>
                      <pre className="text-xs bg-[rgba(0,0,0,0.3)] p-2 rounded mt-1 overflow-x-auto">
                        {JSON.stringify(result.response, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      {testResults.length > 0 && (
        <div className="border-t border-[rgba(255,255,255,0.055)] pt-4">
          <h3 className="font-semibold mb-3 text-[#5EEAD4]">Performance Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[rgba(255,255,255,0.015)] rounded-lg p-3">
              <div className="text-sm text-[rgba(255,255,255,0.42)]">Total Tests</div>
              <div className="text-lg font-bold text-[#5EEAD4]">
                {testResults.filter(r => r.status !== 'running').length}
              </div>
            </div>
            <div className="bg-[rgba(255,255,255,0.015)] rounded-lg p-3">
              <div className="text-sm text-[rgba(255,255,255,0.42)]">Success Rate</div>
              <div className="text-lg font-bold text-green-400">
                {testResults.filter(r => r.status !== 'running').length > 0
                  ? Math.round((testResults.filter(r => r.status === 'success').length / testResults.filter(r => r.status !== 'running').length) * 100)
                  : 0
                }%
              </div>
            </div>
            <div className="bg-[rgba(255,255,255,0.015)] rounded-lg p-3">
              <div className="text-sm text-[rgba(255,255,255,0.42)]">Avg Latency</div>
              <div className="text-lg font-bold text-[#5EEAD4]">
                {testResults.filter(r => r.status === 'success' && r.latency).length > 0
                  ? Math.round(
                      testResults
                        .filter(r => r.status === 'success' && r.latency)
                        .reduce((sum, r) => sum + (r.latency || 0), 0) /
                      testResults.filter(r => r.status === 'success' && r.latency).length
                    )
                  : 0
                }ms
              </div>
            </div>
            <div className="bg-[rgba(255,255,255,0.015)] rounded-lg p-3">
              <div className="text-sm text-[rgba(255,255,255,0.42)]">Running</div>
              <div className="text-lg font-bold text-blue-400">
                {runningTests.size}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealMcpTester;