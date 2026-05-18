export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type ContentBlock =
  | {
      id: string
      type: 'text'
      order: number
      heading?: string
      content: string
    }
  | {
      id: string
      type: 'image'
      order: number
      image_url: string
      caption?: string
      link_url?: string
    }

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
