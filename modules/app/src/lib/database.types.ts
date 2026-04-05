/**
 * Supabase database types — Foundation OS
 * Source: supabase/migrations/001_create_tables.sql
 * Tables: sessions, decisions, risks, next_steps, context_blocks, docs
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
          phase: string | null
          status: 'active' | 'closed'
        }
        Insert: {
          date: string
          title: string
          items?: string | null
          decisions?: string | null
          phase?: string | null
          status?: 'active' | 'closed'
        }
        Update: {
          date?: string
          title?: string
          items?: string | null
          decisions?: string | null
          phase?: string | null
          status?: 'active' | 'closed'
        }
        Relationships: []
      }
      decisions: {
        Row: {
          id: string
          created_at: string
          date: string
          title: string
          context: string | null
          impact: 'high' | 'medium' | 'low'
          status: 'active' | 'superseded' | 'deprecated'
        }
        Insert: {
          date: string
          title: string
          context?: string | null
          impact?: 'high' | 'medium' | 'low'
          status?: 'active' | 'superseded' | 'deprecated'
        }
        Update: {
          date?: string
          title?: string
          context?: string | null
          impact?: 'high' | 'medium' | 'low'
          status?: 'active' | 'superseded' | 'deprecated'
        }
        Relationships: []
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
        Insert: {
          risk: string
          impact?: 'high' | 'medium' | 'low'
          proba?: 'high' | 'medium' | 'low'
          mitigation?: string | null
          status?: 'open' | 'mitigated' | 'closed'
        }
        Update: {
          risk?: string
          impact?: 'high' | 'medium' | 'low'
          proba?: 'high' | 'medium' | 'low'
          mitigation?: string | null
          status?: 'open' | 'mitigated' | 'closed'
        }
        Relationships: []
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
        Insert: {
          label: string
          phase?: string | null
          priority?: 'critical' | 'high' | 'medium' | 'low'
          status?: 'todo' | 'in_progress' | 'done'
          sort_order?: number
        }
        Update: {
          label?: string
          phase?: string | null
          priority?: 'critical' | 'high' | 'medium' | 'low'
          status?: 'todo' | 'in_progress' | 'done'
          sort_order?: number
        }
        Relationships: []
      }
      context_blocks: {
        Row: {
          id: string
          created_at: string
          label: string
          content: string
          sort_order: number
        }
        Insert: {
          label: string
          content: string
          sort_order?: number
        }
        Update: {
          label?: string
          content?: string
          sort_order?: number
        }
        Relationships: []
      }
      docs: {
        Row: {
          id: string
          created_at: string
          title: string
          content: string | null
          category: string | null
          tags: string[] | null
          sort_order: number
        }
        Insert: {
          title: string
          content?: string | null
          category?: string | null
          tags?: string[] | null
          sort_order?: number
        }
        Update: {
          title?: string
          content?: string | null
          category?: string | null
          tags?: string[] | null
          sort_order?: number
        }
        Relationships: []
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
