import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser client for Supabase
 * Safe to use on client-side (uses publishable key)
 * Use in React components and client-side operations
 */
export const createClientSupabaseClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseKey);
};

/**
 * Export as default for convenience
 */
export default createClientSupabaseClient;
