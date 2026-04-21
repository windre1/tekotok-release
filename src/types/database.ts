export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export interface Database {
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
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
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
        Insert: Omit<Database['public']['Tables']['projects']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
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
        Insert: Omit<Database['public']['Tables']['panels']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['panels']['Insert']>
      }
    }
  }
}

// App types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Project = Database['public']['Tables']['projects']['Row']
export type Panel = Database['public']['Tables']['panels']['Row']
