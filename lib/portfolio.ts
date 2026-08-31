import { createServerSupabaseClient } from '@/lib/supabase-server';
import type { PortfolioItem } from '@/lib/database.types';

export async function getFeaturedPortfolioItems(limit = 6): Promise<PortfolioItem[]> {
  try {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('sort_order', { ascending: true })
      .limit(limit);

    if (!error && data && data.length > 0) {
      return data as PortfolioItem[];
    }

    // Fallback: show any published items if no featured ones
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('portfolio_items')
      .select('*')
      .eq('status', 'published')
      .order('sort_order', { ascending: true })
      .limit(limit);

    if (fallbackError) {
      console.error('Error fetching fallback portfolio items:', fallbackError);
      return [];
    }

    return (fallbackData || []) as PortfolioItem[];
  } catch (error) {
    console.error('getFeaturedPortfolioItems failed:', error);
    return [];
  }
}
