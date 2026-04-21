export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          full_name: string | null
          avatar_url: string | null
          plan: 'free' | 'pro' | 'enterprise'
          credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'pro' | 'enterprise'
          credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'pro' | 'enterprise'
          credits?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          topic: string | null
          script: string | null
          voice_gender: 'female' | 'male'
          audio_url: string | null
          audio_duration: number | null
          stage: 'script' | 'visual' | 'audio' | 'done'
          status: 'active' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          topic?: string | null
          script?: string | null
          voice_gender?: 'female' | 'male'
          audio_url?: string | null
          audio_duration?: number | null
          stage?: 'script' | 'visual' | 'audio' | 'done'
          status?: 'active' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          topic?: string | null
          script?: string | null
          voice_gender?: 'female' | 'male'
          audio_url?: string | null
          audio_duration?: number | null
          stage?: 'script' | 'visual' | 'audio' | 'done'
          status?: 'active' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "projects_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      panels: {
        Row: {
          id: string
          project_id: string
          user_id: string
          panel_number: number
          label_a: string | null
          label_b: string | null
          prompt_a: string | null
          prompt_b: string | null
          image_url_a: string | null
          image_url_b: string | null
          video_prompt: string | null
          style: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          panel_number: number
          label_a?: string | null
          label_b?: string | null
          prompt_a?: string | null
          prompt_b?: string | null
          image_url_a?: string | null
          image_url_b?: string | null
          video_prompt?: string | null
          style?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          panel_number?: number
          label_a?: string | null
          label_b?: string | null
          prompt_a?: string | null
          prompt_b?: string | null
          image_url_a?: string | null
          image_url_b?: string | null
          video_prompt?: string | null
          style?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "panels_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Panel = Database['public']['Tables']['panels']['Row']
