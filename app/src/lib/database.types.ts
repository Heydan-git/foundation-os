/**
 * Supabase database types — Foundation OS
 * Extend as you add tables in Supabase.
 */
export type Database = {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
