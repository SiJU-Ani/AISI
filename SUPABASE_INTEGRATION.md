# Supabase Integration Guide for TanStack Start

This guide explains how to use Supabase for database operations in your AISI project.

## Overview

Supabase provides a PostgreSQL database with real-time capabilities, authentication, and storage. This integration includes:

- **Server-side client** for server functions
- **Browser client** for client-side operations  
- **Session management** for authentication
- **API endpoints** for database operations
- **Example components** showing best practices

## Setup

### 1. Environment Configuration

Add to `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Get these values from your Supabase dashboard at https://supabase.com

### 2. File Structure

```
src/
├── utils/supabase/
│   ├── client.ts       # Browser client (safe for public key)
│   ├── server.ts       # Server functions client
│   └── session.ts      # Session/auth management
├── routes/
│   └── api.supabase.tsx # Server functions (CRUD endpoints)
└── components/examples/
    ├── SupabaseTodoExample.tsx      # Todo CRUD example
    └── SupabaseStatusExample.tsx    # Configuration status
```

## Usage

### Server-Side (Server Functions)

Use in `createServerFn` handlers for database operations:

```typescript
// src/routes/api.supabase.tsx
export const fetchTodos = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = await createServerSupabaseClient()
  const { data, error } = await supabase.from("todos").select("*")
  
  return { success: !error, data, error: error?.message }
})
```

Call from components:

```typescript
// Client component
const { data } = useSuspenseQuery({
  queryKey: ['todos'],
  queryFn: async () => {
    const result = await fetchTodos()
    if (!result.success) throw new Error(result.error)
    return result.data || []
  },
})
```

### Client-Side

For client-only operations:

```typescript
import { createClientSupabaseClient } from '@/utils/supabase/client'

const supabase = createClientSupabaseClient()

// Fetch data
const { data, error } = await supabase
  .from('todos')
  .select('*')

// Insert data
const { data, error } = await supabase
  .from('todos')
  .insert({ name: 'Buy groceries', completed: false })

// Update data
const { data, error } = await supabase
  .from('todos')
  .update({ completed: true })
  .eq('id', todo_id)

// Delete data
const { error } = await supabase
  .from('todos')
  .delete()
  .eq('id', todo_id)
```

### Real-time Subscriptions

Subscribe to real-time changes:

```typescript
const supabase = createClientSupabaseClient()

const subscription = supabase
  .from('todos')
  .on('*', (payload) => {
    console.log('Change received!', payload)
  })
  .subscribe()

// Cleanup
subscription.unsubscribe()
```

## Database Schema

### Create Tables in Supabase

Go to https://app.supabase.com → Your Project → SQL Editor

```sql
-- Create todos table
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create RLS policy (Row Level Security)
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON todos
  FOR SELECT
  USING (true);

CREATE POLICY "Enable insert for all users" ON todos
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON todos
  FOR UPDATE
  USING (true);

CREATE POLICY "Enable delete for all users" ON todos
  FOR DELETE
  USING (true);
```

## API Endpoints

All server functions are in `src/routes/api.supabase.tsx`:

### GET - Fetch all todos
```typescript
const result = await fetchTodos()
```

### POST - Create todo
```typescript
const result = await createTodo({ name: "Buy groceries" })
```

### PUT - Update todo
```typescript
const result = await updateTodo({ 
  id: "todo-id", 
  name: "Updated name",
  completed: true 
})
```

### DELETE - Delete todo
```typescript
const result = await deleteTodo({ id: "todo-id" })
```

### GET - Current user
```typescript
const result = await getCurrentUser()
```

All endpoints return:
```typescript
{
  success: boolean,
  data?: T,
  error?: string
}
```

## Authentication

### Setup Auth

1. Go to https://app.supabase.com → Your Project → Auth
2. Configure Authentication providers (Email, Google, GitHub, etc.)

### Sign Up
```typescript
const supabase = createClientSupabaseClient()

const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})
```

### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})
```

### Sign Out
```typescript
const { error } = await supabase.auth.signOut()
```

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser()
```

## Security

### Row Level Security (RLS)

Supabase uses RLS to control data access:

```sql
-- Only users can see their own todos
CREATE POLICY "Users can only see their own todos" ON todos
  FOR SELECT
  USING (
    auth.uid() = user_id
  );
```

### Best Practices

1. ✅ Always validate user input on the server
2. ✅ Use RLS policies to secure data access
3. ✅ Keep private keys in `.env.local` (not `.env`)
4. ✅ Use server functions for sensitive operations
5. ✅ Never expose private keys in client code
6. ❌ Don't trust client-side authentication alone
7. ❌ Don't skip RLS configuration
8. ❌ Don't commit `.env.local` to version control

## Examples

### Todo List Component

See `src/components/examples/SupabaseTodoExample.tsx` for a complete working example with:
- Fetch all todos
- Create new todo
- Delete todo
- Error handling

### Status Component

See `src/components/examples/SupabaseStatusExample.tsx` to check configuration.

## Troubleshooting

### "Missing Supabase configuration"

**Problem**: Error about missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY

**Solution**:
1. Create `.env.local` file
2. Copy values from Supabase dashboard
3. Restart dev server: `npm run dev`

### "Invalid API key"

**Problem**: 401 Unauthorized errors

**Solution**:
1. Check your publishable key in Supabase dashboard
2. Verify it matches in `.env.local`
3. Ensure you're using the correct environment (dev/staging/prod)

### "CORS error"

**Problem**: Browser CORS errors when fetching data

**Solution**:
1. Go to Supabase → Project Settings → API
2. Configure CORS origins to include your dev server URL (http://localhost:5173)

### "Permission denied" (RLS)

**Problem**: 403 Forbidden errors when accessing data

**Solution**:
1. Check RLS policies on the table
2. Verify user authentication status
3. Ensure policies allow the operation (SELECT, INSERT, UPDATE, DELETE)
4. For development, temporarily disable RLS to test

### "No rows returned"

**Problem**: Query returns empty results

**Solution**:
1. Verify table exists in Supabase
2. Check RLS policies aren't blocking access
3. Verify the query is correct (use Supabase SQL editor to test)
4. Ensure data actually exists in the table

## Performance

### Optimize Queries

```typescript
// ❌ Bad - fetches all columns
const { data } = await supabase.from('todos').select()

// ✅ Good - fetches only needed columns
const { data } = await supabase.from('todos').select('id, name, completed')

// ✅ Good - add filters
const { data } = await supabase
  .from('todos')
  .select('id, name, completed')
  .eq('completed', false)
  .limit(10)
```

### Caching with React Query

All examples use React Query for caching:

```typescript
const { data } = useSuspenseQuery({
  queryKey: ['todos'],
  queryFn: async () => {
    const result = await fetchTodos()
    if (!result.success) throw new Error(result.error)
    return result.data || []
  },
})
```

React Query will:
- Cache results automatically
- Refetch on focus
- Handle loading/error states
- Deduplicate requests

## Learning Resources

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Basics](https://www.postgresql.org/docs/current/tutorial.html)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Real-time Features](https://supabase.com/docs/guides/realtime)
- [TanStack Query Documentation](https://tanstack.com/query/latest)

## Next Steps

1. ✅ Set up environment variables
2. ✅ Create database tables
3. ✅ Test with example components
4. ✅ Integrate into your routes
5. ✅ Configure authentication
6. ✅ Set up RLS policies
7. ✅ Deploy to production

---

**Last Updated**: June 22, 2026  
**TanStack Start Version**: Latest  
**Supabase SDK**: @supabase/supabase-js + @supabase/ssr
