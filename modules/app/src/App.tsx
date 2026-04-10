import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/lib/AuthContext'
import Commander from '@/pages/Commander'
import IndexPage from '@/pages/IndexPage'
import KnowledgePage from '@/pages/KnowledgePage'
import LoginPage from '@/pages/LoginPage'
import Phase1Demo from '@/pages/Phase1Demo'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import { Navbar } from '@/components'

const SupabaseCRUDTest = lazy(() => import('@/components/SupabaseCRUDTest'))

const globalStyles = `
  *{box-sizing:border-box;margin:0;padding:0}
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
    <div style={{ fontFamily: "'Figtree',Helvetica,Arial,sans-serif", background: '#06070C', color: '#D4D4D8', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <style>{globalStyles}</style>
      <div className="orb" style={{ width: 280, height: 280, background: '#A78BFA', top: -80, right: -60, animation: 'drift 18s ease-in-out infinite' }} />
      <div className="orb" style={{ width: 200, height: 200, background: '#5EEAD4', bottom: '30%', left: -50, animation: 'drift 22s ease-in-out infinite' }} />
      <div className="orb" style={{ width: 240, height: 240, background: '#3B82F6', bottom: -60, right: '20%', animation: 'drift 28s ease-in-out infinite' }} />
      <div style={{ position: 'relative', zIndex: 2 }}>
        {children}
      </div>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppShell>
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/" element={<ProtectedRoute><IndexPage /></ProtectedRoute>} />
            <Route path="/commander" element={<ProtectedRoute><Commander /></ProtectedRoute>} />
            <Route path="/dashboard" element={<Navigate to="/commander" replace />} />
            <Route path="/knowledge" element={<ProtectedRoute><KnowledgePage /></ProtectedRoute>} />
            {import.meta.env.DEV && (
              <Route path="/crud-test" element={<ProtectedRoute><Suspense fallback={null}><SupabaseCRUDTest /></Suspense></ProtectedRoute>} />
            )}
            <Route path="/phase1-demo" element={<ProtectedRoute><Phase1Demo /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppShell>
      </AuthProvider>
    </BrowserRouter>
  )
}
