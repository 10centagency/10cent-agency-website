import type { JSONContent } from '@tiptap/core'

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ContentBlock =
  | {
      id: string;
      type: 'text';
      order: number;
      heading?: string;
      content: string;
    }
  | {
      id: string;
      type: 'image';
      order: number;
      image_url: string;
      caption?: string;
      link_url?: string;
      width?: 'full' | 'half' | 'third';
      aspect_ratio?: '16/9' | '4/3' | '1/1' | '3/4' | 'free';
    }
  | {
      id: string;
      type: 'full-image';
      order: number;
      image_url: string;
      caption?: string;
      link_url?: string;
    }
  | {
      id: string;
      type: 'image-duo';
      order: number;
      left_image_url: string;
      right_image_url: string;
      left_label?: string;
      right_label?: string;
      caption?: string;
    }
  | {
      id: string;
      type: 'image-grid';
      order: number;
      images: { url: string; caption?: string }[];
      columns: 2 | 3 | 4;
    }
  | {
      id: string;
      type: 'image-text';
      order: number;
      image_url: string;
      image_position: 'left' | 'right';
      image_width: '1/3' | '1/2' | '2/3';
      aspect_ratio?: '16/9' | '4/3' | '1/1' | '3/4';
      heading?: string;
      content?: string;
      link_url?: string;
    }
  | {
      id: string;
      type: 'color-palette';
      order: number;
      title?: string;
      colors: { hex: string; name: string }[];
    }
  | {
      id: string;
      type: 'typography';
      order: number;
      title?: string;
      fonts: {
        name: string;
        sample: string;
        weight: string;
        style: string;
      }[];
    };

export interface Category {
  id: string
  name: string
  slug: string
  type: 'portfolio' | 'blog'
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      portfolio_items: {
        Row: {
          id: string
          title: string
          slug: string
          category: string
          industry: string
          client_name: string | null
          result_highlight: string
          excerpt?: string | null
          meta_description?: string | null
          tags: string[]
          featured_image_url: string | null
          featured_image_link: string | null
          thumbnail_gradient_from: string
          thumbnail_gradient_to: string
          content?: JSONContent | null
          content_blocks: ContentBlock[]
          is_featured: boolean
          sort_order: number
          status: 'published' | 'draft'
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['portfolio_items']['Row'],
          'id' | 'created_at' | 'updated_at'
        >
        Update: Partial<
          Database['public']['Tables']['portfolio_items']['Insert']
        >
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          type: 'portfolio' | 'blog'
          created_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['categories']['Row'],
          'id' | 'created_at'
        >
        Update: Partial<
          Database['public']['Tables']['categories']['Insert']
        >
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          category_id: string
          excerpt?: string | null
          meta_description?: string | null
          featured_image_url: string | null
          featured_image_link?: string | null
          thumbnail_gradient_from: string
          thumbnail_gradient_to: string
          content?: JSONContent | null
          content_blocks: ContentBlock[]
          tags: string[]
          is_featured: boolean
          sort_order: number
          status: 'published' | 'draft'
          created_at: string
          updated_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['blog_posts']['Row'],
          'id' | 'created_at' | 'updated_at'
        >
        Update: Partial<
          Database['public']['Tables']['blog_posts']['Insert']
        >
      }
      contact_submissions: {
        Row: {
          id: string
          full_name: string
          business_name: string
          email: string
          whatsapp: string
          service_interested: string
          budget_range: string
          message: string
          status: 'unread' | 'read'
          created_at: string
        }
        Insert: Omit<
          Database['public']['Tables']['contact_submissions']['Row'],
          'id' | 'created_at' | 'status'
        >
        Update: Partial<{
          status: 'unread' | 'read'
        }>
      }
    }
  }
}

export type PortfolioItem =
  Database['public']['Tables']['portfolio_items']['Row']
export type ContactSubmission =
  Database['public']['Tables']['contact_submissions']['Row']
export type BlogPost =
  Database['public']['Tables']['blog_posts']['Row']
export type CategoryRow =
  Database['public']['Tables']['categories']['Row']
