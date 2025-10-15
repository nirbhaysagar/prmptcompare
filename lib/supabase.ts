import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          plan_type: 'free' | 'pro' | 'team'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          plan_type?: 'free' | 'pro' | 'team'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          plan_type?: 'free' | 'pro' | 'team'
          created_at?: string
          updated_at?: string
        }
      }
      prompts: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          content: string
          tags: string[]
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          content: string
          tags?: string[]
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          content?: string
          tags?: string[]
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      prompt_versions: {
        Row: {
          id: string
          prompt_id: string
          version_number: number
          content: string
          change_notes: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          prompt_id: string
          version_number: number
          content: string
          change_notes?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          prompt_id?: string
          version_number?: number
          content?: string
          change_notes?: string | null
          created_by?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
