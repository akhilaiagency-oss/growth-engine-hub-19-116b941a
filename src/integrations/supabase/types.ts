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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      strategy_call_bookings: {
        Row: {
          booked_at: string | null
          calendly_cancel_url: string | null
          calendly_event_name: string | null
          calendly_event_uri: string | null
          calendly_event_uuid: string | null
          calendly_invitee_uri: string | null
          calendly_reschedule_url: string | null
          cancellation_reason: string | null
          cancelled_at: string | null
          created_at: string
          event_end_time: string | null
          id: string
          invitee_email: string | null
          join_url: string | null
          lead_id: string
          payment_id: string | null
          provider_payload: Json
          scheduled_at: string | null
          status: Database["public"]["Enums"]["strategy_call_booking_status"]
          timezone: string | null
          updated_at: string
          verification_method: string | null
          verified_at: string | null
        }
        Insert: {
          booked_at?: string | null
          calendly_cancel_url?: string | null
          calendly_event_name?: string | null
          calendly_event_uri?: string | null
          calendly_event_uuid?: string | null
          calendly_invitee_uri?: string | null
          calendly_reschedule_url?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          event_end_time?: string | null
          id?: string
          invitee_email?: string | null
          join_url?: string | null
          lead_id: string
          payment_id?: string | null
          provider_payload?: Json
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["strategy_call_booking_status"]
          timezone?: string | null
          updated_at?: string
          verification_method?: string | null
          verified_at?: string | null
        }
        Update: {
          booked_at?: string | null
          calendly_cancel_url?: string | null
          calendly_event_name?: string | null
          calendly_event_uri?: string | null
          calendly_event_uuid?: string | null
          calendly_invitee_uri?: string | null
          calendly_reschedule_url?: string | null
          cancellation_reason?: string | null
          cancelled_at?: string | null
          created_at?: string
          event_end_time?: string | null
          id?: string
          invitee_email?: string | null
          join_url?: string | null
          lead_id?: string
          payment_id?: string | null
          provider_payload?: Json
          scheduled_at?: string | null
          status?: Database["public"]["Enums"]["strategy_call_booking_status"]
          timezone?: string | null
          updated_at?: string
          verification_method?: string | null
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "strategy_call_bookings_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "strategy_call_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "strategy_call_bookings_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "strategy_call_payments"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_call_entitlements: {
        Row: {
          created_at: string
          id: string
          invited_at: string | null
          joined_at: string | null
          lead_id: string
          notes: string | null
          revoked_at: string | null
          updated_at: string
          whatsapp_access_enabled_at: string | null
          whatsapp_invite_url: string | null
          whatsapp_phone: string | null
          whatsapp_status: Database["public"]["Enums"]["strategy_call_whatsapp_status"]
        }
        Insert: {
          created_at?: string
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          lead_id: string
          notes?: string | null
          revoked_at?: string | null
          updated_at?: string
          whatsapp_access_enabled_at?: string | null
          whatsapp_invite_url?: string | null
          whatsapp_phone?: string | null
          whatsapp_status?: Database["public"]["Enums"]["strategy_call_whatsapp_status"]
        }
        Update: {
          created_at?: string
          id?: string
          invited_at?: string | null
          joined_at?: string | null
          lead_id?: string
          notes?: string | null
          revoked_at?: string | null
          updated_at?: string
          whatsapp_access_enabled_at?: string | null
          whatsapp_invite_url?: string | null
          whatsapp_phone?: string | null
          whatsapp_status?: Database["public"]["Enums"]["strategy_call_whatsapp_status"]
        }
        Relationships: [
          {
            foreignKeyName: "strategy_call_entitlements_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: true
            referencedRelation: "strategy_call_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_call_leads: {
        Row: {
          access_token: string
          answers: Json
          business_type: string | null
          created_at: string
          desired_outcome: string | null
          email: string
          id: string
          marketing_spend: string | null
          name: string
          notes: string | null
          phone: string
          source_page: string | null
          stage: Database["public"]["Enums"]["strategy_call_lead_stage"]
          timeline: string | null
          updated_at: string
          user_agent: string | null
          utm: Json
          what_you_sell: string | null
        }
        Insert: {
          access_token?: string
          answers?: Json
          business_type?: string | null
          created_at?: string
          desired_outcome?: string | null
          email: string
          id?: string
          marketing_spend?: string | null
          name: string
          notes?: string | null
          phone: string
          source_page?: string | null
          stage?: Database["public"]["Enums"]["strategy_call_lead_stage"]
          timeline?: string | null
          updated_at?: string
          user_agent?: string | null
          utm?: Json
          what_you_sell?: string | null
        }
        Update: {
          access_token?: string
          answers?: Json
          business_type?: string | null
          created_at?: string
          desired_outcome?: string | null
          email?: string
          id?: string
          marketing_spend?: string | null
          name?: string
          notes?: string | null
          phone?: string
          source_page?: string | null
          stage?: Database["public"]["Enums"]["strategy_call_lead_stage"]
          timeline?: string | null
          updated_at?: string
          user_agent?: string | null
          utm?: Json
          what_you_sell?: string | null
        }
        Relationships: []
      }
      strategy_call_payments: {
        Row: {
          amount_paise: number
          attempts: number
          cancelled_at: string | null
          created_at: string
          currency: string
          failure_reason: string | null
          id: string
          lead_id: string
          method: string | null
          paid_at: string | null
          provider_payload: Json
          razorpay_order_id: string | null
          razorpay_payment_id: string | null
          razorpay_signature: string | null
          receipt: string | null
          status: Database["public"]["Enums"]["strategy_call_payment_status"]
          updated_at: string
          verification_status: Database["public"]["Enums"]["strategy_call_verification_status"]
          verified_at: string | null
        }
        Insert: {
          amount_paise?: number
          attempts?: number
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          lead_id: string
          method?: string | null
          paid_at?: string | null
          provider_payload?: Json
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          receipt?: string | null
          status?: Database["public"]["Enums"]["strategy_call_payment_status"]
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["strategy_call_verification_status"]
          verified_at?: string | null
        }
        Update: {
          amount_paise?: number
          attempts?: number
          cancelled_at?: string | null
          created_at?: string
          currency?: string
          failure_reason?: string | null
          id?: string
          lead_id?: string
          method?: string | null
          paid_at?: string | null
          provider_payload?: Json
          razorpay_order_id?: string | null
          razorpay_payment_id?: string | null
          razorpay_signature?: string | null
          receipt?: string | null
          status?: Database["public"]["Enums"]["strategy_call_payment_status"]
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["strategy_call_verification_status"]
          verified_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "strategy_call_payments_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "strategy_call_leads"
            referencedColumns: ["id"]
          },
        ]
      }
      strategy_call_webhook_events: {
        Row: {
          created_at: string
          event_id: string
          event_type: string
          id: string
          payload: Json
          processed_at: string | null
          provider: string
          result: string | null
          signature_verified: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_id: string
          event_type: string
          id?: string
          payload?: Json
          processed_at?: string | null
          provider?: string
          result?: string | null
          signature_verified?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          event_type?: string
          id?: string
          payload?: Json
          processed_at?: string | null
          provider?: string
          result?: string | null
          signature_verified?: boolean
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      strategy_call_booking_unlocked: {
        Args: { _lead_id: string }
        Returns: boolean
      }
    }
    Enums: {
      strategy_call_booking_status:
        | "pending"
        | "scheduled"
        | "rescheduled"
        | "cancelled"
        | "completed"
        | "no_show"
        | "confirmed"
      strategy_call_lead_stage:
        | "qualified"
        | "payment_pending"
        | "paid"
        | "booked"
        | "completed"
        | "abandoned"
      strategy_call_payment_status:
        | "created"
        | "attempted"
        | "authorized"
        | "captured"
        | "failed"
        | "refunded"
        | "payment_pending"
        | "paid"
        | "payment_failed"
        | "payment_cancelled"
      strategy_call_verification_status: "unverified" | "verified" | "mismatch"
      strategy_call_whatsapp_status:
        | "not_granted"
        | "invited"
        | "joined"
        | "revoked"
        | "enabled"
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
    Enums: {
      strategy_call_booking_status: [
        "pending",
        "scheduled",
        "rescheduled",
        "cancelled",
        "completed",
        "no_show",
        "confirmed",
      ],
      strategy_call_lead_stage: [
        "qualified",
        "payment_pending",
        "paid",
        "booked",
        "completed",
        "abandoned",
      ],
      strategy_call_payment_status: [
        "created",
        "attempted",
        "authorized",
        "captured",
        "failed",
        "refunded",
        "payment_pending",
        "paid",
        "payment_failed",
        "payment_cancelled",
      ],
      strategy_call_verification_status: ["unverified", "verified", "mismatch"],
      strategy_call_whatsapp_status: [
        "not_granted",
        "invited",
        "joined",
        "revoked",
        "enabled",
      ],
    },
  },
} as const
