export type Database = {
  public: {
    Tables: {
      panels: {
        Row: {
          id: string
          user_id: string
          project_id: string
          panel_number: number
          title: string | null
          description: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          project_id: string
          panel_number: number
          title?: string | null
          description?: string | null
        }
        Update: {
          panel_number?: number
          title?: string | null
          description?: string | null
        }
      }
    }
  }
}