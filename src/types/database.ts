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
          plan: string
          credits: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          plan?: string
          credits?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          full_name?: string | null
          avatar_url?: string | null
          plan?: string
          credits?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          topic: string | null
          script: string | null
          voice_gender: string
          audio_url: string | null
          audio_duration: number | null
          stage: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          topic?: string | null
          script?: string | null
          voice_gender?: string
          audio_url?: string | null
          audio_duration?: number | null
          stage?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          topic?: string | null
          script?: string | null
          voice_gender?: string
          audio_url?: string | null
          audio_duration?: number | null
          stage?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
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
        Relationships: []
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

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Panel = Database['public']['Tables']['panels']['Row']
