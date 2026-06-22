# Vercel Deployment Guide - AISI + Supabase

## 🚀 Pre-Deployment Checklist

Before deploying to Vercel, complete these steps:

### 1. ✅ Local Development
- [ ] `npm run dev` works locally
- [ ] Supabase connection works (test with `SupabaseStatusExample`)
- [ ] AI provider is configured
- [ ] All database tables created in Supabase
- [ ] `.env.local` has your local credentials

### 2. ✅ Git Setup
- [ ] `.env` and `.env.local` are in `.gitignore`
- [ ] `.env.example` is committed (template only)
- [ ] `.env.production` is committed (template only)
- [ ] No secrets in any git-tracked files
- [ ] Latest code pushed to GitHub

### 3. ✅ Supabase Setup
- [ ] Supabase project created at https://supabase.com
- [ ] Database tables created
- [ ] RLS policies configured
- [ ] Public keys obtained (safe to commit)
- [ ] Secret keys saved (for Vercel dashboard)

---

## 📋 Environment Variables

### Public Variables (safe to commit)
These can be in `.env.production`:
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx
VITE_APP_ENV=production
VITE_AI_PROVIDER=gemini
VITE_AI_MODEL=gemini-2.5-flash
```

### Secret Variables (set in Vercel dashboard only)
These should NEVER be in any file:
```
GEMINI_API_KEY
OPENROUTER_API_KEY
JWT_SECRET
DATABASE_URL (if using direct connection)
```

---

## 🔧 Vercel Deployment Steps

### Step 1: Connect Repository

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository
4. Vercel auto-detects "TanStack Start"
5. Click "Deploy"

### Step 2: Set Environment Variables

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Add these SECRET variables:

| Variable | Value | Scope |
|----------|-------|-------|
| `GEMINI_API_KEY` | Your Gemini API key | Production |
| `OPENROUTER_API_KEY` | Your OpenRouter key (if using) | Production |
| `JWT_SECRET` | Strong random string | Production |
| `DATABASE_URL` | Supabase PostgreSQL URL (if direct) | Production |

**To get secret values:**

**Gemini Key:**
1. Go to https://ai.google.dev
2. Click "Get API Key"
3. Create new API key
4. Copy the full key

**Supabase Keys:**
1. Go to https://app.supabase.com
2. Select your project
3. Click "Settings" → "API"
4. Under "Project API keys":
   - Copy `anon public` key (for `VITE_SUPABASE_PUBLISHABLE_KEY`)
   - Copy `service_role secret` key (for secret operations, if needed)
5. For direct database connection, copy PostgreSQL URI under "Connection string"

**JWT Secret:**
Generate a strong random string:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Deploy

1. Push to GitHub (triggers automatic deployment)
2. Watch deployment in Vercel dashboard
3. Check build logs for any errors

---

## ✅ Post-Deployment Verification

After deployment succeeds:

### 1. Test Basic Routes
```
https://your-domain.vercel.app/
https://your-domain.vercel.app/permits
https://your-domain.vercel.app/risk-engine
```

### 2. Test Supabase Connection
Create a test route to verify:
```typescript
import { fetchTodos } from '@/routes/api.supabase'

export default async function TestPage() {
  const result = await fetchTodos()
  
  return (
    <pre>
      {JSON.stringify(result, null, 2)}
    </pre>
  )
}
```

### 3. Check Logs
- Vercel dashboard → "Deployments" → Latest
- Click "View Build Logs"
- Look for any errors or warnings

### 4. Monitor Function Duration
- Supabase queries might timeout on free Vercel plan
- Upgrade to "Pro" plan if needed
- Set reasonable timeouts in config

---

## 🐛 Troubleshooting

### 404 Error After Deployment
**Problem**: Routes return 404 on Vercel but work locally

**Solutions:**
1. Check build output: `npm run build`
2. Verify routes export correctly
3. Ensure all imports are absolute paths (`@/...`)
4. Check TanStack Start build config in `vite.config.ts`

**Fix:**
```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { cjsInterop } from 'vite-plugin-cjs-interop'

export default defineConfig({
  plugins: [
    TanStackRouterVite(),
    react(),
    cjsInterop({
      dependencies: ['@tanstack/start']
    })
  ],
  ssr: {
    external: ['@tanstack/react-query']
  }
})
```

### Environment Variables Not Loading
**Problem**: `VITE_SUPABASE_URL` is undefined in production

**Solutions:**
1. Restart Vercel deployment (variables added after deployment may not load)
2. Make sure variables are set in correct environment (Production)
3. Verify variable names exactly (case-sensitive)
4. Check `.env.production` template matches Vercel settings

**Redeploy:**
- Vercel dashboard → Deployments → Latest → "Redeploy"

### Supabase Connection Refused
**Problem**: "Failed to connect to Supabase" error

**Solutions:**
1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are correct
2. Check Supabase project is running (not paused)
3. Add Vercel domain to Supabase CORS settings:
   - Supabase dashboard → Settings → API
   - Add `https://your-domain.vercel.app` to CORS origins

### Timeout Errors (504)
**Problem**: Server functions timeout

**Solutions:**
1. Upgrade to Vercel Pro (serverless function timeout limit)
2. Optimize queries (select specific columns, add limits)
3. Add caching with React Query
4. Check if Supabase project is paused (free tier pauses after inactivity)

---

## 📦 File Structure for Deployment

```
AISI/
├── src/
│   ├── config/
│   │   ├── index.ts          ✅ Auto-loaded
│   │   ├── ai.ts             ✅ Auto-loaded
│   │   └── prompts.ts        ✅ Auto-loaded
│   ├── routes/
│   │   ├── __root.tsx        ✅ Auto-routed
│   │   ├── index.tsx         ✅ Auto-routed
│   │   ├── api.supabase.tsx  ✅ Server functions
│   │   └── ...
│   ├── services/
│   │   ├── ai/
│   │   │   ├── index.ts      ✅ Auto-loaded
│   │   │   ├── provider.ts   ✅ Auto-loaded
│   │   │   ├── gemini.ts     ✅ Auto-loaded
│   │   │   └── ...
│   └── utils/
│       └── supabase/
│           ├── client.ts     ✅ Auto-loaded
│           ├── server.ts     ✅ Auto-loaded
│           └── session.ts    ✅ Auto-loaded
├── .env.example              ✅ Committed (template)
├── .env.production           ✅ Committed (template)
├── .env                      ❌ NOT committed (local only)
├── .env.local                ❌ NOT committed (local only)
├── .gitignore                ✅ Ignores *.env, *.local
└── vite.config.ts            ✅ Build config
```

---

## 🔐 Security Checklist

- [ ] No API keys in any committed files
- [ ] `.env` and `.env.local` in `.gitignore`
- [ ] Secret variables set in Vercel dashboard only
- [ ] Public keys (`sb_publishable_`) can be in code
- [ ] JWT_SECRET is strong & unique
- [ ] Database credentials are environment-specific
- [ ] RLS policies configured on Supabase
- [ ] CORS origins configured correctly

---

## 📚 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [TanStack Start Deploy Guide](https://tanstack.com/start/latest/docs/guide/deploying)
- [Supabase Vercel Integration](https://supabase.com/docs/guides/integrations/vercel)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-modes.html)

---

## 🆘 Still Having Issues?

1. **Check Vercel build logs** for specific errors
2. **Verify all environment variables** are set correctly
3. **Test locally first** with `npm run build && npm run preview`
4. **Check Supabase status** at https://status.supabase.com
5. **Review Vercel pricing** - free tier has function time limits

### Debug Mode
Set in Vercel environment:
```
VITE_APP_DEBUG=true
VITE_LOG_LEVEL=debug
```

Then check Vercel logs for detailed information.

---

**Status**: Ready to Deploy  
**Framework**: TanStack Start + Vite  
**Database**: Supabase PostgreSQL  
**Hosting**: Vercel (Serverless)  
