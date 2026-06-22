import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser client for Supabase
 * Safe to use on client-side (uses publishable key only)
 * Use in React components and client-side operations
 * 
 * Works with both local development and Vercel deployment
 */
export const createClientSupabaseClient = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "❌ Missing VITE_SUPABASE_URL. Check:\n" +
      "  - Local: Set in .env.local\n" +
      "  - Vercel: Set in Project Settings → Environment Variables\n" +
      "  - Get from: https://app.supabase.com → Settings → API"
    );
  }

  if (!supabaseKey) {
    throw new Error(
      "❌ Missing VITE_SUPABASE_PUBLISHABLE_KEY. Check:\n" +
      "  - Local: Set in .env.local\n" +
      "  - Vercel: Set in Project Settings → Environment Variables\n" +
      "  - Get from: https://app.supabase.com → Settings → API (anon public key)"
    );
  }

  try {
    return createBrowserClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error(
      "Failed to create Supabase client:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error;
  }
};

/**
 * Export as default for convenience
 */
export default createClientSupabaseClient;
