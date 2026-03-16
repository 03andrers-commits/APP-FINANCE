import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client for database operations.
 * Uses environment variables for URL and API key.
 */

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://hayqzhnolaoumgfnqmri.supabase.co';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_KEY || '';

if (!supabaseKey) {
  console.warn('[Supabase] Warning: EXPO_PUBLIC_SUPABASE_KEY is not set');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Helper function to check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return !!supabaseKey && !!supabaseUrl;
}
