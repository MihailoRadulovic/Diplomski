// Generisati sa `npx supabase gen types typescript` kada baza bude finalizovana
// VAZNO: svaka tabela mora imati Relationships[] — zahtev supabase-js GenericTable
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      biljke: {
        Row: {
          id: string;
          srpski_naziv: string;
          latinski_naziv: string;
          plantnet_nazivi: string[];
          slug: string;
          porodica: string | null;
          opis: string;
          delovanje: string | null;
          deleted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          srpski_naziv: string;
          latinski_naziv: string;
          plantnet_nazivi?: string[];
          slug: string;
          porodica?: string | null;
          opis: string;
          delovanje?: string | null;
          deleted_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["biljke"]["Insert"]>;
        Relationships: [];
      };
      biljka_slike: {
        Row: {
          id: string;
          biljka_id: string;
          url: string;
          alt_tekst: string;
          je_glavna: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          biljka_id: string;
          url: string;
          alt_tekst: string;
          je_glavna?: boolean;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["biljka_slike"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "biljka_slike_biljka_id_fkey";
            columns: ["biljka_id"];
            isOneToOne: false;
            referencedRelation: "biljke";
            referencedColumns: ["id"];
          }
        ];
      };
      biljka_upotrebe: {
        Row: {
          id: string;
          biljka_id: string;
          deo_biljke: string;
          nacin_upotrebe: string;
          za_sta: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          biljka_id: string;
          deo_biljke: string;
          nacin_upotrebe: string;
          za_sta: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["biljka_upotrebe"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "biljka_upotrebe_biljka_id_fkey";
            columns: ["biljka_id"];
            isOneToOne: false;
            referencedRelation: "biljke";
            referencedColumns: ["id"];
          }
        ];
      };
      biljka_upozorenja: {
        Row: {
          id: string;
          biljka_id: string;
          lek: string;
          opis_interakcije: string;
          ozbiljnost: "niska" | "srednja" | "visoka";
          created_at: string;
        };
        Insert: {
          id?: string;
          biljka_id: string;
          lek: string;
          opis_interakcije: string;
          ozbiljnost: "niska" | "srednja" | "visoka";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["biljka_upozorenja"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "biljka_upozorenja_biljka_id_fkey";
            columns: ["biljka_id"];
            isOneToOne: false;
            referencedRelation: "biljke";
            referencedColumns: ["id"];
          }
        ];
      };
      omiljene: {
        Row: {
          id: string;
          user_id: string;
          biljka_id: string;
          deleted_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string; // Supabase postavlja auth.uid() automatski preko RLS
          biljka_id: string;
          deleted_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["omiljene"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "omiljene_biljka_id_fkey";
            columns: ["biljka_id"];
            isOneToOne: false;
            referencedRelation: "biljke";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
