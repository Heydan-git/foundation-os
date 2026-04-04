/**
 * useAuth.ts - Hook d'authentification réexporté
 * Pour facilité d'import depuis n'importe où dans l'app
 */
export { useAuth } from '../contexts/AuthContext'

// Type exports for convenience
export type { User, Session } from '@supabase/supabase-js'