import { PageContainer } from '@/components'
import Dashboard from '@/pages/Dashboard'

export default function App() {
  return (
    <div style={{ fontFamily: "'Figtree',system-ui,sans-serif", background: "#06070C", color: "#D4D4D8", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{`
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
      `}</style>

      {/* Background orbs */}
      <div className="orb" style={{ width: 280, height: 280, background: "#A78BFA", top: -80, right: -60, animation: 'drift 18s ease-in-out infinite' }}></div>
      <div className="orb" style={{ width: 200, height: 200, background: "#5EEAD4", bottom: "30%", left: -50, animation: 'drift 22s ease-in-out infinite' }}></div>
      <div className="orb" style={{ width: 240, height: 240, background: "#3B82F6", bottom: -60, right: "20%", animation: 'drift 28s ease-in-out infinite' }}></div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <PageContainer>
          <Dashboard />
        </PageContainer>
      </div>
    </div>
  )
}
