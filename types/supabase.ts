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
      clients: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          phone: string | null
          type: "Individual" | "Organization"
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          phone?: string | null
          type?: "Individual" | "Organization"
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          phone?: string | null
          type?: "Individual" | "Organization"
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          created_at: string
          feedback_comment: string | null
          feedback_is_useful: boolean | null
          file_url: string | null
          health_score: number | null
          id: string
          matter_id: string | null
          name: string | null
          signature_request_id: string | null
          signatories: Json | null
          source: "generated" | "uploaded" | null
          state: string | null
          status: string | null
          type: string | null
          user_id: string
          version_history: Json | null
        }
        Insert: {
          content?: string | null
          created_at?: string
          feedback_comment?: string | null
          feedback_is_useful?: boolean | null
          file_url?: string | null
          health_score?: number | null
          id?: string
          matter_id?: string | null
          name?: string | null
          signature_request_id?: string | null
          signatories?: Json | null
          source?: "generated" | "uploaded" | null
          state?: string | null
          status?: string | null
          type?: string | null
          user_id: string
          version_history?: Json | null
        }
        Update: {
          content?: string | null
          created_at?: string
          feedback_comment?: string | null
          feedback_is_useful?: boolean | null
          file_url?: string | null
          health_score?: number | null
          id?: string
          matter_id?: string | null
          name?: string | null
          signature_request_id?: string | null
          signatories?: Json | null
          source?: "generated" | "uploaded" | null
          state?: string | null
          status?: string | null
          type?: string | null
          user_id?: string
          version_history?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_matter_id_fkey"
            columns: ["matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      e_verify_cases: {
        Row: {
          case_number: string
          created_at: string
          id: string
          i9_record_id: string
          resolved_at: string | null
          status: string
          submitted_at: string
          user_id: string
        }
        Insert: {
          case_number: string
          created_at?: string
          id?: string
          i9_record_id: string
          resolved_at?: string | null
          status: string
          submitted_at?: string
          user_id: string
        }
        Update: {
          case_number?: string
          created_at?: string
          id?: string
          i9_record_id?: string
          resolved_at?: string | null
          status?: string
          submitted_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "e_verify_cases_i9_record_id_fkey"
            columns: ["i9_record_id"]
            isOneToOne: true
            referencedRelation: "i9_records"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "e_verify_cases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      evidence: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          file_url: string | null
          id: string
          matter_id: string
          name: string
          user_id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          matter_id: string
          name: string
          user_id: string
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          file_url?: string | null
          id?: string
          matter_id?: string
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "evidence_matter_id_fkey"
            columns: ["matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "evidence_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      i9_records: {
        Row: {
          created_at: string
          employee_name: string | null
          id: string
          section1_data: Json | null
          section2_data: Json | null
          section3_data: Json | null
          status: string
          user_id: string
        }
        Insert: {
          created_at?: string
          employee_name?: string | null
          id?: string
          section1_data?: Json | null
          section2_data?: Json | null
          section3_data?: Json | null
          status: string
          user_id: string
        }
        Update: {
          created_at?: string
          employee_name?: string | null
          id?: string
          section1_data?: Json | null
          section2_data?: Json | null
          section3_data?: Json | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "i9_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      invitations: {
        Row: {
          created_at: string
          firm_id: string
          id: string
          invited_user_id: string
          inviter_id: string
          role: string
          status: "pending" | "accepted" | "declined"
        }
        Insert: {
          created_at?: string
          firm_id: string
          id?: string
          invited_user_id: string
          inviter_id: string
          role: string
          status?: "pending" | "accepted" | "declined"
        }
        Update: {
          created_at?: string
          firm_id?: string
          id?: string
          invited_user_id?: string
          inviter_id?: string
          role?: string
          status?: "pending" | "accepted" | "declined"
        }
        Relationships: [
          {
            foreignKeyName: "invitations_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_invited_user_id_fkey"
            columns: ["invited_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invitations_inviter_id_fkey"
            columns: ["inviter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matters: {
        Row: {
          client_id: string
          created_at: string
          id: string
          matter_name: string
          opposing_parties: Json | null
          status: "open" | "closed"
          user_id: string
        }
        Insert: {
          client_id: string
          created_at?: string
          id?: string
          matter_name: string
          opposing_parties?: Json | null
          status?: "open" | "closed"
          user_id: string
        }
        Update: {
          client_id?: string
          created_at?: string
          id?: string
          matter_name?: string
          opposing_parties?: Json | null
          status?: "open" | "closed"
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "matters_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matters_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          content: string
          created_at: string
          id: string
          matter_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          matter_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          matter_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notes_matter_id_fkey"
            columns: ["matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link_to: string | null
          message: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link_to?: string | null
          message: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link_to?: string | null
          message?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          email: string | null
          email_token: string | null
          firm_id: string | null
          full_name: string | null
          id: string
          jurisdiction: string | null
          role: string | null
          subscription_code: string | null
          subscription_status: string | null
        }
        Insert: {
          email?: string | null
          email_token?: string | null
          firm_id?: string | null
          full_name?: string | null
          id: string
          jurisdiction?: string | null
          role?: string | null
          subscription_code?: string | null
          subscription_status?: string | null
        }
        Update: {
          email?: string | null
          email_token?: string | null
          firm_id?: string | null
          full_name?: string | null
          id?: string
          jurisdiction?: string | null
          role?: string | null
          subscription_code?: string | null
          subscription_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_firm_id_fkey"
            columns: ["firm_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_queries: {
        Row: {
          created_at: string
          id: string
          jurisdiction: string
          name: string
          query: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          jurisdiction: string
          name: string
          query: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          jurisdiction?: string
          name?: string
          query?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_queries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      signature_requests: {
        Row: {
          created_at: string
          document_id: string
          id: string
          overall_status: string | null
          signatories: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          document_id: string
          id: string
          overall_status?: string | null
          signatories?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          document_id?: string
          id?: string
          overall_status?: string | null
          signatories?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "signature_requests_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "signature_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          matter_id: string
          status: "pending" | "completed"
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          matter_id: string
          status?: "pending" | "completed"
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          matter_id?: string
          status?: "pending" | "completed"
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_matter_id_fkey"
            columns: ["matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      templates: {
        Row: {
          content: string | null
          created_at: string
          description: string | null
          id: string
          name: string | null
          placeholders: Json | null
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          placeholders?: Json | null
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          placeholders?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "templates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      time_entries: {
        Row: {
          created_at: string
          date: string
          description: string | null
          hours: number
          id: string
          is_billed: boolean
          matter_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          hours: number
          id?: string
          is_billed?: boolean
          matter_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          hours?: number
          id?: string
          is_billed?: boolean
          matter_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "time_entries_matter_id_fkey"
            columns: ["matter_id"]
            isOneToOne: false
            referencedRelation: "matters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "time_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
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
    : never = never,
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

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
    ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never