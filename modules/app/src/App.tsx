import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/lib/AuthContext'
import { DashboardLayout } from '@/components/DashboardLayout'

const Commander = lazy(() => import('@/pages/Commander'))
const IndexPage = lazy(() => import('@/pages/IndexPage'))
const KnowledgePage = lazy(() => import('@/pages/KnowledgePage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'))

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
        <Suspense fallback={null}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<IndexPage />} />
              <Route path="commander" element={<Commander />} />
              <Route path="dashboard" element={<Navigate to="/commander" replace />} />
              <Route path="knowledge" element={<KnowledgePage />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  )
}
