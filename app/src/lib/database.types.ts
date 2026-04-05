/**
 * Supabase database types — Foundation OS
 * Tables: sessions, decisions, risks, docs, context_blocks, next_steps
 */
export type Database = {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string
          created_at: string
          date: string
          title: string
          items: string | null
          decisions: string | null
        }
        Insert: Omit<Database['public']['Tables']['sessions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['sessions']['Insert']>
      }
      decisions: {
        Row: {
          id: string
          code: string | null
          created_at: string
          date: string
          title: string
          context: string | null
          impact: 'high' | 'medium' | 'low'
          status: 'active' | 'superseded' | 'deprecated'
        }
        Insert: Omit<Database['public']['Tables']['decisions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['decisions']['Insert']>
      }
      risks: {
        Row: {
          id: string
          created_at: string
          risk: string
          impact: 'high' | 'medium' | 'low'
          proba: 'high' | 'medium' | 'low'
          mitigation: string | null
          status: 'open' | 'mitigated' | 'closed'
        }
        Insert: Omit<Database['public']['Tables']['risks']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['risks']['Insert']>
      }
      docs: {
        Row: {
          id: string
          created_at: string
          fichier: string
          type: string
          statut: string
          kb: string | null
        }
        Insert: Omit<Database['public']['Tables']['docs']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['docs']['Insert']>
      }
      context_blocks: {
        Row: {
          id: string
          created_at: string
          label: string
          content: string
          sort_order: number
        }
        Insert: Omit<Database['public']['Tables']['context_blocks']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['context_blocks']['Insert']>
      }
      next_steps: {
        Row: {
          id: string
          created_at: string
          label: string
          phase: string | null
          priority: 'critical' | 'high' | 'medium' | 'low'
          status: 'todo' | 'in_progress' | 'done'
          sort_order: number
        }
        Insert: Omit<Database['public']['Tables']['next_steps']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['next_steps']['Insert']>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// ── Convenience row types ─────────────────────────────────────────────
export type Session      = Database['public']['Tables']['sessions']['Row']
export type Decision     = Database['public']['Tables']['decisions']['Row']
export type Risk         = Database['public']['Tables']['risks']['Row']
export type Doc          = Database['public']['Tables']['docs']['Row']
export type ContextBlock = Database['public']['Tables']['context_blocks']['Row']
export type NextStep     = Database['public']['Tables']['next_steps']['Row']
