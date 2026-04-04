import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Commander from '@/pages/Commander'
import Dashboard from '@/pages/Dashboard'
import IndexPage from '@/pages/IndexPage'
import KnowledgePage from '@/pages/KnowledgePage'
import ScaleOrchestratorPage from '@/pages/ScaleOrchestratorPage'
import GraphPage from '@/pages/GraphPage'
import SyncPage from '@/pages/SyncPage'
import NotionSyncPage from '@/pages/NotionSyncPage'
import AsanaAutomationPage from '@/pages/AsanaAutomationPage'
import ToolboxPage from '@/pages/ToolboxPage'
import FigmaValidationPage from '@/pages/FigmaValidationPage'

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Figtree:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  ::-webkit-scrollbar{width:3px}
  ::-webkit-scrollbar-thumb{background:rgba(94,234,212,.15);border-radius:4px}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  @keyframes drift{0%,100%{transform:translate(0,0)}33%{transform:translate(18px,-22px)}66%{transform:translate(-14px,16px)}}
  .orb{position:absolute;border-radius:50%;filter:blur(80px);opacity:.1;pointer-events:none}
  .hov:hover{border-color:rgba(94,234,212,.12)!important}
  .cta{box-shadow:0 0 0 1px rgba(94,234,212,.15),0 0 24px rgba(94,234,212,.08);transition:all .2s}
  .cta:hover{box-shadow:0 0 0 1px rgba(94,234,212,.3),0 0 32px rgba(94,234,212,.15)}
`

function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: "'Figtree',system-ui,sans-serif", background: '#06070C', color: '#D4D4D8', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{globalStyles}</style>
      {/* Background orbs */}
      <div className="orb" style={{ width: 280, height: 280, background: '#A78BFA', top: -80, right: -60, animation: 'drift 18s ease-in-out infinite' }} />
      <div className="orb" style={{ width: 200, height: 200, background: '#5EEAD4', bottom: '30%', left: -50, animation: 'drift 22s ease-in-out infinite' }} />
      <div className="orb" style={{ width: 240, height: 240, background: '#3B82F6', bottom: -60, right: '20%', animation: 'drift 28s ease-in-out infinite' }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<IndexPage />} />
          <Route path="/commander" element={<Commander />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/knowledge" element={<KnowledgePage />} />
          <Route path="/scale" element={<ScaleOrchestratorPage />} />
          <Route path="/graph" element={<GraphPage />} />
          <Route path="/sync" element={<SyncPage />} />
          <Route path="/notion-sync" element={<NotionSyncPage />} />
          <Route path="/asana-automation" element={<AsanaAutomationPage />} />
          <Route path="/figma-validation" element={<FigmaValidationPage />} />
          <Route path="/toolbox" element={<ToolboxPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}
