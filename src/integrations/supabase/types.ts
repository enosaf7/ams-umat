export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      chat_messages: {
        Row: {
          id: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          created_at: string;
          read: boolean;
          // --- File support additions ---
          file_url: string | null;
          file_type: string | null;
          file_name: string | null;
        };
        Insert: {
          id?: string;
          sender_id: string;
          receiver_id: string;
          content: string;
          created_at?: string;
          read?: boolean;
          // --- File support additions ---
          file_url?: string | null;
          file_type?: string | null;
          file_name?: string | null;
        };
        Update: {
          id?: string;
          sender_id?: string;
          receiver_id?: string;
          content?: string;
          created_at?: string;
          read?: boolean;
          // --- File support additions ---
          file_url?: string | null;
          file_type?: string | null;
          file_name?: string | null;
        };
        Relationships: [];
      };
      courses: {
        Row: {
          created_at: string;
          description: string | null;
          file_name: string | null;
          file_path: string | null;
          file_type: string | null;
          id: string;
          lecturer_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          file_name?: string | null;
          file_path?: string | null;
          file_type?: string | null;
          id?: string;
          lecturer_id: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          file_name?: string | null;
          file_path?: string | null;
          file_type?: string | null;
          id?: string;
          lecturer_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      news: {
        Row: {
          author_id: string;
          category: string;
          content: string;
          created_at: string;
          id: string;
          image_url: string | null;
          is_published: boolean;
          title: string;
          updated_at: string;
        };
        Insert: {
          author_id: string;
          category?: string;
          content: string;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          is_published?: boolean;
          title: string;
          updated_at?: string;
        };
        Update: {
          author_id?: string;
          category?: string;
          content?: string;
          created_at?: string;
          id?: string;
          image_url?: string | null;
          is_published?: boolean;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          class: string | null;
          created_at: string;
          first_name: string | null;
          id: string;
          index_number: string | null;
          last_name: string | null;
          role: string | null;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          avatar_url?: string | null;
          class?: string | null;
          created_at?: string;
          first_name?: string | null;
          id: string;
          index_number?: string | null;
          last_name?: string | null;
          role?: string | null;
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          avatar_url?: string | null;
          class?: string | null;
          created_at?: string;
          first_name?: string | null;
          id?: string;
          index_number?: string | null;
          last_name?: string | null;
          role?: string | null;
          updated_at?: string;
          username?: string | null;
        };
        Relationships: [];
      };
      // ...other tables as needed...
    };
    // ...views, functions, enums, etc. as needed...
  };
};
