export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      suppliers: {
        Row: {
          acesso_dados_pessoais: boolean | null
          acesso_sistemas_internos: boolean | null
          approved_at: string | null
          approved_by: string | null
          bank_name: string
          billing_email: string
          categoria: string | null
          codigo_interno_1: string | null
          codigo_interno_2: string | null
          codigo_interno_3: string | null
          comentarios: string | null
          commercial_name: string | null
          condicoes_pagamento: string | null
          consent_given: boolean
          country: string
          created_at: string
          currency: string
          currency_other: string | null
          custo_medio_mensal: string | null
          data_fim: string | null
          data_inicio: string | null
          email: string
          entidade: string | null
          entity_type: string
          finance_approved_by: string | null
          fiscal_address: string
          iban: string
          iban_proof_url: string | null
          id: string
          legal_name: string
          nif_vat: string
          phone: string
          primary_contact: string
          projeto_area: string | null
          relevancia_iso: string | null
          responsavel: string | null
          service_product: string
          status: string
          supplier_submitted_at: string | null
          swift: string
          token: string | null
          vat_regime: string
          website_linkedin: string | null
        }
        Insert: {
          acesso_dados_pessoais?: boolean | null
          acesso_sistemas_internos?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          bank_name?: string
          billing_email?: string
          categoria?: string | null
          codigo_interno_1?: string | null
          codigo_interno_2?: string | null
          codigo_interno_3?: string | null
          comentarios?: string | null
          commercial_name?: string | null
          condicoes_pagamento?: string | null
          consent_given?: boolean
          country?: string
          created_at?: string
          currency?: string
          currency_other?: string | null
          custo_medio_mensal?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          email?: string
          entidade?: string | null
          entity_type?: string
          finance_approved_by?: string | null
          fiscal_address?: string
          iban?: string
          iban_proof_url?: string | null
          id?: string
          legal_name?: string
          nif_vat?: string
          phone?: string
          primary_contact?: string
          projeto_area?: string | null
          relevancia_iso?: string | null
          responsavel?: string | null
          service_product?: string
          status?: string
          supplier_submitted_at?: string | null
          swift?: string
          token?: string | null
          vat_regime?: string
          website_linkedin?: string | null
        }
        Update: {
          acesso_dados_pessoais?: boolean | null
          acesso_sistemas_internos?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          bank_name?: string
          billing_email?: string
          categoria?: string | null
          codigo_interno_1?: string | null
          codigo_interno_2?: string | null
          codigo_interno_3?: string | null
          comentarios?: string | null
          commercial_name?: string | null
          condicoes_pagamento?: string | null
          consent_given?: boolean
          country?: string
          created_at?: string
          currency?: string
          currency_other?: string | null
          custo_medio_mensal?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          email?: string
          entidade?: string | null
          entity_type?: string
          finance_approved_by?: string | null
          fiscal_address?: string
          iban?: string
          iban_proof_url?: string | null
          id?: string
          legal_name?: string
          nif_vat?: string
          phone?: string
          primary_contact?: string
          projeto_area?: string | null
          relevancia_iso?: string | null
          responsavel?: string | null
          service_product?: string
          status?: string
          supplier_submitted_at?: string | null
          swift?: string
          token?: string | null
          vat_regime?: string
          website_linkedin?: string | null
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
