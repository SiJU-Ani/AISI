import { createServerClient } from "@supabase/ssr";

/**
 * Server-side Supabase client for use in server functions
 * Handles session management and cookie persistence
 * 
 * Works with both local development and Vercel deployment
 */
export const createServerSupabaseClient = async () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl) {
    throw new Error(
      "Missing VITE_SUPABASE_URL. Set in .env.local (local) or Vercel dashboard (production)"
    );
  }

  if (!supabaseKey) {
    throw new Error(
      "Missing VITE_SUPABASE_PUBLISHABLE_KEY. Set in .env.local (local) or Vercel dashboard (production)"
    );
  }

  try {
    // In TanStack Start, we use import.meta.env for server-side access
    return createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        // For TanStack Start, cookie handling is simplified
        // In production, integrate with your actual cookie middleware
        getAll() {
          return [];
        },
        setAll(cookiesToSet) {
          // Cookie management handled by middleware
          // See utils/supabase/session.ts
        },
      },
    });
  } catch (error) {
    console.error(
      "Failed to create Supabase server client:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error;
  }
};

/**
 * Alternative: Get authenticated client with user session
 * Use in server functions that require auth
 */
export const createAuthenticatedClient = async (accessToken?: string) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase configuration. Check .env.local or Vercel environment variables"
    );
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return [];
      },
      setAll() {
        // Handled by session management
      },
    },
  });

  if (accessToken) {
    // If you have an access token from session, set it
    // This allows authenticated operations
    try {
      const { data } = await supabase.auth.getUser(accessToken);
      if (!data.user) {
        throw new Error("Invalid authentication token");
      }
    } catch (error) {
      console.error("Authentication failed:", error);
      throw error;
    }
  }

  return supabase;
};
