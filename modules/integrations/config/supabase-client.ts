import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://uckvdxvgdfzhzjqdhztz.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVja3ZkeHZnZGZ6aHpqcWRoenR6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc0NDk5NDIsImV4cCI6MjA3MzAyNTk0Mn0.-3qr1-HRAm3q1va_2rPQTPg5VSKecDhkK4Rs8JzpMSU'

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types for TypeScript support
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          phone_number: string | null
          email: string | null
          name: string | null
          language: string
          business_type: string | null
          location: string | null
          preferences: any
          satisfaction_rating: number | null
          total_conversations: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          phone_number?: string | null
          email?: string | null
          name?: string | null
          language?: string
          business_type?: string | null
          location?: string | null
          preferences?: any
          satisfaction_rating?: number | null
          total_conversations?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          phone_number?: string | null
          email?: string | null
          name?: string | null
          language?: string
          business_type?: string | null
          location?: string | null
          preferences?: any
          satisfaction_rating?: number | null
          total_conversations?: number
          created_at?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          user_id: string | null
          session_id: string
          business_type: string
          language: string
          status: string
          satisfaction_rating: number | null
          escalated: boolean
          escalation_reason: string | null
          resolution_time: number | null
          total_messages: number
          ai_provider: string | null
          context_summary: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          session_id: string
          business_type: string
          language?: string
          status?: string
          satisfaction_rating?: number | null
          escalated?: boolean
          escalation_reason?: string | null
          resolution_time?: number | null
          total_messages?: number
          ai_provider?: string | null
          context_summary?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          session_id?: string
          business_type?: string
          language?: string
          status?: string
          satisfaction_rating?: number | null
          escalated?: boolean
          escalation_reason?: string | null
          resolution_time?: number | null
          total_messages?: number
          ai_provider?: string | null
          context_summary?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: string
          content: string
          original_language: string | null
          translated_content: string | null
          intent: string | null
          confidence_score: number | null
          ai_provider: string | null
          response_time: number | null
          tokens_used: number | null
          cost: number | null
          metadata: any
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: string
          content: string
          original_language?: string | null
          translated_content?: string | null
          intent?: string | null
          confidence_score?: number | null
          ai_provider?: string | null
          response_time?: number | null
          tokens_used?: number | null
          cost?: number | null
          metadata?: any
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: string
          content?: string
          original_language?: string | null
          translated_content?: string | null
          intent?: string | null
          confidence_score?: number | null
          ai_provider?: string | null
          response_time?: number | null
          tokens_used?: number | null
          cost?: number | null
          metadata?: any
          created_at?: string
        }
      }
      business_configs: {
        Row: {
          id: string
          business_type: string
          name: string
          description: string | null
          supported_languages: string[]
          escalation_threshold: number
          auto_responses: any
          business_hours: any
          contact_info: any
          custom_prompts: any
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_type: string
          name: string
          description?: string | null
          supported_languages?: string[]
          escalation_threshold?: number
          auto_responses?: any
          business_hours?: any
          contact_info?: any
          custom_prompts?: any
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          business_type?: string
          name?: string
          description?: string | null
          supported_languages?: string[]
          escalation_threshold?: number
          auto_responses?: any
          business_hours?: any
          contact_info?: any
          custom_prompts?: any
          active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // Add other table types as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}