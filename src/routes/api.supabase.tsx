import { createServerFn } from "@tanstack/start";
import { createServerSupabaseClient } from "@/utils/supabase/server";

/**
 * Supabase API endpoints for TanStack Start
 * Server functions for database operations
 */

/**
 * Fetch todos from Supabase
 * GET /api.supabase
 */
export const fetchTodos = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.from("todos").select("*");

    if (error) {
      return {
        success: false,
        error: error.message,
        data: null,
      };
    }

    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
});

/**
 * Create a new todo
 * POST /api.supabase
 */
export const createTodo = createServerFn({ method: "POST" })
  .input<{ name: string }>(async (data) => data)
  .handler(async ({ data }) => {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: newTodo, error } = await supabase
        .from("todos")
        .insert({ name: data.name })
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
          data: null,
        };
      }

      return {
        success: true,
        data: newTodo,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        data: null,
      };
    }
  });

/**
 * Delete a todo
 * DELETE /api.supabase
 */
export const deleteTodo = createServerFn({ method: "DELETE" })
  .input<{ id: string }>(async (data) => data)
  .handler(async ({ data }) => {
    try {
      const supabase = await createServerSupabaseClient();
      const { error } = await supabase.from("todos").delete().eq("id", data.id);

      if (error) {
        return {
          success: false,
          error: error.message,
        };
      }

      return {
        success: true,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  });

/**
 * Update a todo
 * PUT /api.supabase
 */
export const updateTodo = createServerFn({ method: "PUT" })
  .input<{ id: string; name: string; completed?: boolean }>(async (data) => data)
  .handler(async ({ data }) => {
    try {
      const supabase = await createServerSupabaseClient();
      const { data: updated, error } = await supabase
        .from("todos")
        .update({ name: data.name, completed: data.completed })
        .eq("id", data.id)
        .select()
        .single();

      if (error) {
        return {
          success: false,
          error: error.message,
          data: null,
        };
      }

      return {
        success: true,
        data: updated,
        error: null,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        data: null,
      };
    }
  });

/**
 * Get current user
 * GET /api.supabase/user
 */
export const getCurrentUser = createServerFn({ method: "GET" }).handler(async () => {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return {
        success: false,
        error: error?.message || "Not authenticated",
        data: null,
      };
    }

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        user_metadata: user.user_metadata,
      },
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      data: null,
    };
  }
});
