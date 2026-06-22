# Supabase Integration Quick Start

## ✅ What's Installed

- `@supabase/supabase-js` - Main SDK
- `@supabase/ssr` - Server-side rendering support

## 📁 New Files Created

### Configuration
- `.env.local` - Supabase credentials (already filled with your keys)
- `.env.example` - Updated with Supabase variables

### Utilities (`src/utils/supabase/`)
- `server.ts` - Server-side Supabase client for server functions
- `client.ts` - Browser client for client-side operations
- `session.ts` - Session & authentication utilities

### API Routes (`src/routes/`)
- `api.supabase.tsx` - Server functions for CRUD operations
  - `fetchTodos()` - GET all todos
  - `createTodo()` - POST new todo
  - `updateTodo()` - PUT update todo
  - `deleteTodo()` - DELETE todo
  - `getCurrentUser()` - GET current authenticated user

### Example Components (`src/components/examples/`)
- `SupabaseTodoExample.tsx` - Complete todo list demo
- `SupabaseStatusExample.tsx` - Configuration status checker

### Documentation
- `SUPABASE_INTEGRATION.md` - Comprehensive integration guide

## 🚀 Next Steps

### 1. Create Database Tables (One-time setup)

Go to https://app.supabase.com → Your Project → SQL Editor and run:

```sql
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations" ON todos
  FOR ALL USING (true);
```

### 2. Use in Your App

Import server functions:
```typescript
import { fetchTodos, createTodo } from '@/routes/api.supabase'

// Use in components with React Query
const { data: todos } = useSuspenseQuery({
  queryKey: ['todos'],
  queryFn: async () => {
    const result = await fetchTodos()
    if (!result.success) throw new Error(result.error)
    return result.data || []
  }
})
```

### 3. Use Example Components

```typescript
import SupabaseTodoExample from '@/components/examples/SupabaseTodoExample'
import SupabaseStatusExample from '@/components/examples/SupabaseStatusExample'

export default function Page() {
  return (
    <div>
      <SupabaseStatusExample />
      <SupabaseTodoExample />
    </div>
  )
}
```

## 📖 Documentation

- **Full guide**: [SUPABASE_INTEGRATION.md](SUPABASE_INTEGRATION.md)
- **Configuration**: See `.env.local`
- **API reference**: [Supabase Docs](https://supabase.com/docs)

## 🔑 Environment Variables

Your `.env.local` has been updated with:
```
VITE_SUPABASE_URL=https://eejncugeidzkivhcktzf.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable__XBSLblTVHj3VrA6bUW6dg_BkM-kCGi
```

**⚠️ Important**: `.env.local` is in `.gitignore` - never commit secrets!

## 🧪 Test It

1. Add a todo using `SupabaseTodoExample` component
2. Check `SupabaseStatusExample` shows ✅ Configured
3. Verify todo appears in Supabase dashboard
4. Try CRUD operations (create, read, update, delete)

## 🐛 Troubleshooting

**Missing env variables?**
- Ensure `.env.local` has the correct values
- Restart dev server: `npm run dev`

**"Permission denied" error?**
- Create the SQL policies shown above
- Or temporarily disable RLS for testing

**Can't connect?**
- Verify Supabase URL is correct
- Check network tab in browser DevTools
- Ensure CORS is configured in Supabase

See [SUPABASE_INTEGRATION.md](SUPABASE_INTEGRATION.md) for detailed troubleshooting.

## 📚 Architecture

```
Browser (React)
     ↓
Server Function (api.supabase.tsx)
     ↓
Supabase Client (server.ts)
     ↓
PostgreSQL (Supabase)
```

- Server functions handle auth & RLS
- Browser client for client-only operations
- Session management for persistent auth

---

**Status**: ✅ Supabase Integration Complete  
**Project**: AISI (TanStack Start)  
**Framework**: React 18 + TypeScript  
