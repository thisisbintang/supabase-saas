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
      students: {
        Row: {
          angkatan: string | null
          created_at: string | null
          email: string | null
          id: string
          nama: string | null
          nim: string | null
          no_hp: string | null
          prodi: string | null
          status_kuliah: boolean | null
          status_login: boolean | null
        }
        Insert: {
          angkatan?: string | null
          created_at?: string | null
          email?: string | null
          id: string
          nama?: string | null
          nim?: string | null
          no_hp?: string | null
          prodi?: string | null
          status_kuliah?: boolean | null
          status_login?: boolean | null
        }
        Update: {
          angkatan?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          nama?: string | null
          nim?: string | null
          no_hp?: string | null
          prodi?: string | null
          status_kuliah?: boolean | null
          status_login?: boolean | null
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
