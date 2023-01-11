export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      lesson: {
        Row: {
          id: number
          created_at: string | null
          title: string | null
          description: string | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          title?: string | null
          description?: string | null
        }
        Update: {
          id?: number
          created_at?: string | null
          title?: string | null
          description?: string | null
        }
      }
      premium_content: {
        Row: {
          id: number
          created_at: string | null
          video_url: string | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          video_url?: string | null
        }
        Update: {
          id?: number
          created_at?: string | null
          video_url?: string | null
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string | null
          is_subscribed: boolean | null
          interval: string | null
          stripe_customer: string | null
          email: string
        }
        Insert: {
          id: string
          created_at?: string | null
          is_subscribed?: boolean | null
          interval?: string | null
          stripe_customer?: string | null
          email: string
        }
        Update: {
          id?: string
          created_at?: string | null
          is_subscribed?: boolean | null
          interval?: string | null
          stripe_customer?: string | null
          email?: string
        }
      }
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
