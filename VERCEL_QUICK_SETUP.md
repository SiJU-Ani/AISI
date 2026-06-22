# Vercel Deployment Checklist - Quick Setup

## 🚀 Pre-Deployment (5 minutes)

- [ ] Push code to GitHub: `git push origin main`
- [ ] Verify `.env.local` is in `.gitignore`
- [ ] Verify no API keys in any committed files
- [ ] Run locally: `npm run dev` works
- [ ] Test Supabase connection locally with `SupabaseStatusExample`

## 📋 In Vercel Dashboard

### Step 1: Connect GitHub (2 minutes)

1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Select your GitHub repository
4. Click "Import"
5. Framework auto-detects as "TanStack Start" ✅

### Step 2: Set Environment Variables (3 minutes)

Click "Settings" → "Environment Variables"

Add these PUBLIC variables (safe to commit later):
```
VITE_SUPABASE_URL = https://eejncugeidzkivhcktzf.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY = sb_publishable__XBSLblTVHj3VrA6bUW6dg_BkM-kCGi
VITE_AI_PROVIDER = gemini
VITE_AI_MODEL = gemini-2.5-flash
VITE_APP_ENV = production
```

Add these SECRET variables (get from each service):
```
GEMINI_API_KEY = [from https://ai.google.dev]
JWT_SECRET = [generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"]
```

**Optional (if using direct database):**
```
DATABASE_URL = [from Supabase: Settings → Database → Connection string]
```

### Step 3: Deploy (2 minutes)

1. Click "Deploy"
2. Wait for build to complete
3. Open deployed site when ready

## ✅ Post-Deployment Testing (5 minutes)

1. **Test homepage:**
   ```
   https://your-domain.vercel.app
   ```

2. **Test Supabase connection:**
   ```
   https://your-domain.vercel.app/compliance
   ```
   Should load without 404 errors

3. **Check environment variables:**
   Add this debug route temporarily:
   ```typescript
   // src/routes/debug.tsx
   export default function Debug() {
     return (
       <pre>
         URL: {import.meta.env.VITE_SUPABASE_URL}
         Provider: {import.meta.env.VITE_AI_PROVIDER}
       </pre>
     )
   }
   ```
   Visit: `https://your-domain.vercel.app/debug`

## 🔧 Troubleshooting Quick Fixes

| Problem | Fix |
|---------|-----|
| 404 errors after deploy | Go to Deployments → Click latest → Redeploy |
| Env vars undefined | Redeploy after adding vars (usually 30s delay) |
| Supabase fails | Check CORS: https://app.supabase.com → Settings → API |
| Timeout errors (504) | Upgrade to Vercel Pro plan (free tier limits functions to 10s) |

## 🔄 Updating After Deployment

To update your deployment:

```bash
# Make code changes
git add .
git commit -m "Update feature"
git push origin main
# Vercel auto-deploys! 🚀
```

## 🆘 If Stuck

1. **Check Vercel build logs:**
   - Vercel dashboard → Deployments → Latest deployment
   - Click "View Build Logs" tab

2. **Check for errors:**
   - Browser DevTools (F12) → Console tab
   - Look for red error messages

3. **Check Supabase status:**
   - https://status.supabase.com

4. **Restart deployment:**
   - Vercel → Deployments → Latest → "Redeploy"

---

**Time needed**: ~10 minutes  
**Difficulty**: Easy  
**Framework**: TanStack Start + Vite  
**Database**: Supabase  
**Hosting**: Vercel (Serverless)  

For detailed guide, see: [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
