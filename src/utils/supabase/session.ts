import { createServerClient } from "@supabase/ssr";

/**
 * Session management utilities for Supabase
 * Handles user authentication state across requests
 */

/**
 * Middleware-compatible Supabase client
 * Updates session in SSR context and cookies
 */
export const createSessionClient = (cookies: Record<string, string>) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase configuration");
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return Object.entries(cookies).map(([name, value]) => ({
          name,
          value,
        }));
      },
      setAll(cookiesToSet) {
        // Update cookies in your cookie store
        // This is called when sessions refresh
        cookiesToSet.forEach(({ name, value, options }) => {
          cookies[name] = value;
        });
      },
    },
  });
};

/**
 * Get the current user from session
 * Returns null if not authenticated
 */
export const getCurrentUser = async (supabase: ReturnType<typeof createSessionClient>) => {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
};

/**
 * Refresh user session
 * Called to update authentication state
 */
export const refreshSession = async (supabase: ReturnType<typeof createSessionClient>) => {
  try {
    const { data, error } = await supabase.auth.refreshSession();

    if (error || !data.session) {
      return null;
    }

    return data.session;
  } catch {
    return null;
  }
};
