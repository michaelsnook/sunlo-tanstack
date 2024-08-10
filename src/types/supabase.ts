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
      language: {
        Row: {
          alias_of: string | null
          lang: string
          name: string
        }
        Insert: {
          alias_of?: string | null
          lang: string
          name: string
        }
        Update: {
          alias_of?: string | null
          lang?: string
          name?: string
        }
        Relationships: []
      }
      phrase: {
        Row: {
          added_by: string | null
          created_at: string | null
          id: string
          lang: string
          text: string
        }
        Insert: {
          added_by?: string | null
          created_at?: string | null
          id?: string
          lang: string
          text: string
        }
        Update: {
          added_by?: string | null
          created_at?: string | null
          id?: string
          lang?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "phrase_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "public_profile"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "phrase_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "phrase_lang_fkey"
            columns: ["lang"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["lang"]
          },
          {
            foreignKeyName: "phrase_lang_fkey"
            columns: ["lang"]
            isOneToOne: false
            referencedRelation: "language_plus"
            referencedColumns: ["lang"]
          },
        ]
      }
      phrase_relation: {
        Row: {
          added_by: string | null
          from_phrase_id: string | null
          id: string
          to_phrase_id: string | null
        }
        Insert: {
          added_by?: string | null
          from_phrase_id?: string | null
          id?: string
          to_phrase_id?: string | null
        }
        Update: {
          added_by?: string | null
          from_phrase_id?: string | null
          id?: string
          to_phrase_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phrase_see_also_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "public_profile"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "phrase_see_also_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "phrase_see_also_from_phrase_id_fkey"
            columns: ["from_phrase_id"]
            isOneToOne: false
            referencedRelation: "phrase"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phrase_see_also_from_phrase_id_fkey"
            columns: ["from_phrase_id"]
            isOneToOne: false
            referencedRelation: "phrase_plus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phrase_see_also_to_phrase_id_fkey"
            columns: ["to_phrase_id"]
            isOneToOne: false
            referencedRelation: "phrase"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phrase_see_also_to_phrase_id_fkey"
            columns: ["to_phrase_id"]
            isOneToOne: false
            referencedRelation: "phrase_plus"
            referencedColumns: ["id"]
          },
        ]
      }
      phrase_translation: {
        Row: {
          added_by: string | null
          id: string
          lang: string
          literal: string | null
          phrase_id: string
          text: string
        }
        Insert: {
          added_by?: string | null
          id?: string
          lang: string
          literal?: string | null
          phrase_id: string
          text: string
        }
        Update: {
          added_by?: string | null
          id?: string
          lang?: string
          literal?: string | null
          phrase_id?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "phrase_translation_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "public_profile"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "phrase_translation_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "phrase_translation_lang_fkey"
            columns: ["lang"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["lang"]
          },
          {
            foreignKeyName: "phrase_translation_lang_fkey"
            columns: ["lang"]
            isOneToOne: false
            referencedRelation: "language_plus"
            referencedColumns: ["lang"]
          },
          {
            foreignKeyName: "phrase_translation_phrase_id_fkey"
            columns: ["phrase_id"]
            isOneToOne: false
            referencedRelation: "phrase"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "phrase_translation_phrase_id_fkey"
            columns: ["phrase_id"]
            isOneToOne: false
            referencedRelation: "phrase_plus"
            referencedColumns: ["id"]
          },
        ]
      }
      user_card: {
        Row: {
          created_at: string | null
          id: string
          phrase_id: string
          status: string
          uid: string
          updated_at: string | null
          user_deck_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          phrase_id: string
          status?: string
          uid?: string
          updated_at?: string | null
          user_deck_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          phrase_id?: string
          status?: string
          uid?: string
          updated_at?: string | null
          user_deck_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_card_phrase_id_fkey"
            columns: ["phrase_id"]
            isOneToOne: false
            referencedRelation: "phrase"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_card_phrase_id_fkey"
            columns: ["phrase_id"]
            isOneToOne: false
            referencedRelation: "phrase_plus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_card_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "public_profile"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "user_card_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "user_card_user_deck_id_fkey"
            columns: ["user_deck_id"]
            isOneToOne: false
            referencedRelation: "user_deck"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_card_user_deck_id_fkey"
            columns: ["user_deck_id"]
            isOneToOne: false
            referencedRelation: "user_deck_plus"
            referencedColumns: ["id"]
          },
        ]
      }
      user_card_review: {
        Row: {
          card_id: string
          created_at: string
          id: string
          score: number | null
          uid: string
          updated_at: string
        }
        Insert: {
          card_id?: string
          created_at?: string
          id?: string
          score?: number | null
          uid?: string
          updated_at?: string
        }
        Update: {
          card_id?: string
          created_at?: string
          id?: string
          score?: number | null
          uid?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_card_review_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "user_card"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_card_review_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "user_card_plus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_card_review_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "public_profile"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "user_card_review_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["uid"]
          },
        ]
      }
      user_deck: {
        Row: {
          created_at: string
          id: string
          lang: string
          uid: string
        }
        Insert: {
          created_at?: string
          id?: string
          lang: string
          uid?: string
        }
        Update: {
          created_at?: string
          id?: string
          lang?: string
          uid?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_deck_lang_fkey"
            columns: ["lang"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["lang"]
          },
          {
            foreignKeyName: "user_deck_lang_fkey"
            columns: ["lang"]
            isOneToOne: false
            referencedRelation: "language_plus"
            referencedColumns: ["lang"]
          },
          {
            foreignKeyName: "user_deck_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "public_profile"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "user_deck_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["uid"]
          },
        ]
      }
      user_profile: {
        Row: {
          avatar_url: string | null
          created_at: string
          language_primary: string
          languages_spoken: string[]
          uid: string
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          language_primary?: string
          languages_spoken?: string[]
          uid?: string
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          language_primary?: string
          languages_spoken?: string[]
          uid?: string
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      language_plus: {
        Row: {
          alias_of: string | null
          display_order: number | null
          lang: string | null
          learners: number | null
          name: string | null
          phrases_to_learn: number | null
          rank: number | null
        }
        Relationships: []
      }
      phrase_plus: {
        Row: {
          added_by: string | null
          created_at: string | null
          id: string | null
          lang: string | null
          relation_pids: string[] | null
          text: string | null
        }
        Insert: {
          added_by?: string | null
          created_at?: string | null
          id?: string | null
          lang?: string | null
          relation_pids?: never
          text?: string | null
        }
        Update: {
          added_by?: string | null
          created_at?: string | null
          id?: string | null
          lang?: string | null
          relation_pids?: never
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "phrase_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "phrase_added_by_fkey"
            columns: ["added_by"]
            isOneToOne: false
            referencedRelation: "public_profile"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "phrase_lang_fkey"
            columns: ["lang"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["lang"]
          },
          {
            foreignKeyName: "phrase_lang_fkey"
            columns: ["lang"]
            isOneToOne: false
            referencedRelation: "language_plus"
            referencedColumns: ["lang"]
          },
        ]
      }
      public_profile: {
        Row: {
          avatar_url: string | null
          uid: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          uid?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          uid?: string | null
          username?: string | null
        }
        Relationships: []
      }
      user_card_plus: {
        Row: {
          created_at: string | null
          id: string | null
          lang: string | null
          phrase_id: string | null
          status: string | null
          uid: string | null
          updated_at: string | null
          user_deck_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_card_phrase_id_fkey"
            columns: ["phrase_id"]
            isOneToOne: false
            referencedRelation: "phrase"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_card_phrase_id_fkey"
            columns: ["phrase_id"]
            isOneToOne: false
            referencedRelation: "phrase_plus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_card_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "user_card_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "public_profile"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "user_card_user_deck_id_fkey"
            columns: ["user_deck_id"]
            isOneToOne: false
            referencedRelation: "user_deck"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_card_user_deck_id_fkey"
            columns: ["user_deck_id"]
            isOneToOne: false
            referencedRelation: "user_deck_plus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_deck_lang_fkey"
            columns: ["lang"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["lang"]
          },
          {
            foreignKeyName: "user_deck_lang_fkey"
            columns: ["lang"]
            isOneToOne: false
            referencedRelation: "language_plus"
            referencedColumns: ["lang"]
          },
        ]
      }
      user_card_review_plus: {
        Row: {
          card_id: string | null
          created_at: string | null
          id: string | null
          lang: string | null
          score: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_card_review_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "user_card"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_card_review_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "user_card_plus"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_deck_lang_fkey"
            columns: ["lang"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["lang"]
          },
          {
            foreignKeyName: "user_deck_lang_fkey"
            columns: ["lang"]
            isOneToOne: false
            referencedRelation: "language_plus"
            referencedColumns: ["lang"]
          },
        ]
      }
      user_deck_plus: {
        Row: {
          cards_active: number | null
          cards_learned: number | null
          cards_skipped: number | null
          created_at: string | null
          id: string | null
          lang: string | null
          lang_total_phrases: number | null
          language: string | null
          most_recent_review_at: string | null
          uid: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_deck_lang_fkey"
            columns: ["lang"]
            isOneToOne: false
            referencedRelation: "language"
            referencedColumns: ["lang"]
          },
          {
            foreignKeyName: "user_deck_lang_fkey"
            columns: ["lang"]
            isOneToOne: false
            referencedRelation: "language_plus"
            referencedColumns: ["lang"]
          },
          {
            foreignKeyName: "user_deck_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "user_profile"
            referencedColumns: ["uid"]
          },
          {
            foreignKeyName: "user_deck_uid_fkey"
            columns: ["uid"]
            isOneToOne: false
            referencedRelation: "public_profile"
            referencedColumns: ["uid"]
          },
        ]
      }
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
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
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
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
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
