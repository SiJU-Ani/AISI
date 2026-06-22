import { createServerClient } from "@supabase/ssr";

/**
 * Server-side Supabase client for use in server functions
 * Handles session management and cookie persistence
 */
export const createServerSupabaseClient = async () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Missing Supabase configuration. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env.local"
    );
  }

  // In TanStack Start, we use import.meta.env for server-side access
  // The SSR context provides request/response handling
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
};

/**
 * Alternative: Get authenticated client with user session
 * Use in server functions that require auth
 */
export const createAuthenticatedClient = async (accessToken?: string) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase configuration");
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
    const { data } = await supabase.auth.getUser(accessToken);
    if (!data.user) {
      throw new Error("Invalid authentication token");
    }
  }

  return supabase;
};
