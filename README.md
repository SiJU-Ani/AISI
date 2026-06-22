# AISI - AI-Powered Compliance & Risk Management Platform

A full-stack, production-ready application built with **TanStack Start**, **React 18**, **Vite**, and **Supabase**. Implements a modern architecture with centralized configuration, AI service abstraction, and comprehensive compliance/risk management workflows.

---

## 🎯 Project Overview

**AISI** is an intelligent compliance and risk management platform that leverages AI to:
- Analyze and assess compliance requirements
- Calculate risk scores with configurable thresholds
- Manage emergency incidents and escalations
- Handle permit workflows with AI-assisted decision-making
- Provide real-time compliance insights via heatmaps

**Key Innovation**: Multi-provider AI abstraction (Gemini 2.5 Flash + OpenRouter) with runtime switching—no code changes required.

---

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, TanStack Router, TanStack Query |
| **Backend** | TanStack Start (Server Functions), Node.js |
| **Database** | Supabase (PostgreSQL) with RLS policies |
| **AI** | Gemini 2.5 Flash, OpenRouter (multi-model) |
| **Styling** | Tailwind CSS, Radix UI components |
| **Build** | Vite, Bun (package manager) |
| **Deployment** | Vercel (serverless) |
| **Auth** | Supabase Auth, JWT tokens |

---

## ⚡ Quick Start

### Prerequisites
- **Node.js** 18+ and **Bun** (or npm)
- **Supabase** account ([Create free tier](https://supabase.com))
- **AI API Keys**: Gemini API OR OpenRouter account
- **Vercel** account (for deployment, optional for local dev)

### 1. Clone & Install
```bash
git clone <repo>
cd AISI
bun install  # or npm install
```

### 2. Set Up Environment
```bash
cp .env.example .env.local
```

**Fill in .env.local** with:
```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGc...

# AI Provider (choose one)
VITE_AI_PROVIDER=gemini  # or 'openrouter'
GEMINI_API_KEY=AIzaSyD...
# OR
OPENROUTER_API_KEY=sk-...

# Auth (optional)
JWT_SECRET=your-secret-key-min-32-chars
```

### 3. Create Supabase Tables
Go to **Supabase Dashboard → SQL Editor** and run:
```sql
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable all operations" ON todos
  FOR ALL USING (true);
```

### 4. Run Locally
```bash
bun run dev
# Visit http://localhost:5173 ✅
```

**Verify no build warnings** — this confirms the 404 fix is working.

### 5. Deploy to Vercel
```bash
git add .
git commit -m "Initial commit"
git push origin main
# Vercel auto-deploys! 🎉
```

Set environment variables in **Vercel Dashboard → Settings → Environment Variables**.

---

## 📁 Project Structure

```
AISI/
├── src/
│   ├── routes/                 # Page routes (TanStack Router)
│   │   ├── __root.tsx         # Root layout
│   │   ├── index.tsx          # Home page
│   │   ├── compliance.tsx      # Compliance dashboard
│   │   ├── copilot.tsx        # AI copilot interface
│   │   ├── emergency.tsx       # Emergency management
│   │   ├── heatmap.tsx        # Risk heatmap
│   │   ├── permits.tsx        # Permit workflow
│   │   └── login.tsx          # Authentication
│   │
│   ├── server/                 # Server functions (NOT routes!)
│   │   └── api/
│   │       ├── supabase.ts    # Database CRUD
│   │       ├── auth.ts        # Authentication logic
│   │       ├── compliance.ts  # Compliance operations
│   │       ├── risk-engine.ts # Risk calculations
│   │       ├── permits.ts     # Permit workflow
│   │       ├── emergency.ts   # Emergency management
│   │       └── index.ts       # Re-exports
│   │
│   ├── config/                 # Configuration (Central Hub)
│   │   ├── index.ts           # Main config: API, Risk, Compliance, Emergency, Logging
│   │   ├── ai.ts              # AI provider config & validation
│   │   └── prompts.ts         # 30+ AI prompts organized by category
│   │
│   ├── services/               # Business logic services
│   │   └── ai/
│   │       ├── provider.ts    # Abstract base provider
│   │       ├── gemini.ts      # Gemini 2.5 Flash implementation
│   │       ├── openrouter.ts  # OpenRouter multi-model implementation
│   │       ├── index.ts       # Singleton AI service & lifecycle
│   │       └── utils.ts       # High-level AI utilities
│   │
│   ├── utils/                  # Utility functions
│   │   ├── supabase/          # Supabase client helpers
│   │   │   ├── client.ts      # Browser-safe client
│   │   │   ├── server.ts      # Server-side client
│   │   │   └── session.ts     # Session management
│   │   ├── environment.ts     # Env validation (debugging)
│   │   └── utils.ts           # General utilities
│   │
│   ├── components/
│   │   ├── layout/            # Layout components
│   │   ├── ui/                # 25+ Radix UI components
│   │   └── examples/          # Example components (optional)
│   │
│   ├── hooks/                  # Custom React hooks
│   ├── styles/                 # Global CSS
│   ├── router.tsx              # Router configuration
│   ├── start.ts                # Entry point
│   └── server.ts               # Server entry point
│
├── .env.example                # Environment template
├── .env.production             # Production environment template
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── bunfig.toml                 # Bun configuration
│
├── docs/                       # Documentation
│   ├── CONFIGURATION_GUIDE.md
│   ├── SUPABASE_INTEGRATION.md
│   ├── VERCEL_DEPLOYMENT.md
│   ├── FIX_404_ERRORS.md
│   └── ... (more docs)
│
└── package.json
```

---

## 🔧 Configuration System

### The Problem (Before Refactor)
- Hardcoded values scattered throughout components
- Difficult to customize without touching business logic
- Multiple AI providers required code changes to switch

### The Solution (After Refactor)
Everything customizable via **3 files**:

#### 1. `.env` - Secrets & Environment
```env
VITE_AI_PROVIDER=gemini
GEMINI_API_KEY=...
VITE_SUPABASE_URL=...
```

#### 2. `src/config/index.ts` - Application Settings
```typescript
export const API_CONFIG = { baseUrl, timeout, retryCount }
export const RISK_CONFIG = { thresholds, weights, maxScore }
export const COMPLIANCE_CONFIG = { auditLogRetentionDays, formats }
export const EMERGENCY_CONFIG = { alertChannels, severityLevels }
export const LOG_CONFIG = { level, enableConsole, enableFile }
```

#### 3. `src/config/prompts.ts` - All AI Prompts
```typescript
export const SYSTEM_PROMPTS = { default, compliance, riskAssessment, ... }
export const AGENT_PROMPTS = { complianceAudit, riskCalculation, ... }
export const EXTRACTION_PROMPTS = { ... }
```

### Result
✅ Modify `.env`, `src/config/index.ts`, `src/config/prompts.ts`  
❌ Never touch business logic files  
✅ Redeploy without code changes

---

## 🤖 AI Service Architecture

### Multi-Provider Support
```typescript
// ✅ Switch providers via environment variable
VITE_AI_PROVIDER=gemini    // Gemini 2.5 Flash
VITE_AI_PROVIDER=openrouter // Claude, GPT-4, Llama, etc.
```

### Usage Examples

**Simple Message:**
```typescript
import { sendAIMessage } from '@/services/ai'

const response = await sendAIMessage([
  { role: 'user', content: 'Analyze this compliance data' }
])
console.log(response.content)
```

**With System Prompt:**
```typescript
import { sendAIMessageWithSystem } from '@/services/ai'

const response = await sendAIMessageWithSystem(
  'User question',
  'complianceAudit',  // From SYSTEM_PROMPTS
  { maxTokens: 2048 }
)
```

**Streaming Response:**
```typescript
import { streamAIMessage } from '@/services/ai'

await streamAIMessage(
  messages,
  (chunk) => console.log(chunk),  // Called per chunk
  { temperature: 0.7 }
)
```

**Utility Functions:**
```typescript
import { 
  calculateRiskScore,
  classifyText,
  extractData,
  summarizeText,
  generateRecommendations
} from '@/services/ai/utils'

const riskScore = await calculateRiskScore(['factor1', 'factor2'])
const category = await classifyText('text', ['urgent', 'normal', 'low'])
const data = await extractData<UserData>(text, schema)
```

---

## 💾 Database (Supabase)

### Tables
```sql
-- Todos (example)
CREATE TABLE todos (
  id UUID PRIMARY KEY,
  name TEXT,
  completed BOOLEAN,
  created_at TIMESTAMP
);
```

### Access Patterns

**Server Function:**
```typescript
// src/server/api/supabase.ts
export const fetchTodos = createServerFn(
  { method: 'GET' },
  async () => {
    const client = await createServerSupabaseClient()
    return client.from('todos').select('*')
  }
)
```

**Component:**
```typescript
import { fetchTodos } from '@/server/api'
import { useSuspenseQuery } from '@tanstack/react-query'

export function TodoList() {
  const { data } = useSuspenseQuery({
    queryKey: ['todos'],
    queryFn: () => fetchTodos()
  })
  
  return <div>{data.map(todo => ...)}</div>
}
```

### RLS Policies
- All tables have Row Level Security enabled
- Policies control who can see/edit data
- Configure in **Supabase Dashboard → Authentication → Policies**

---

## 🚀 Key Features

### ✅ Compliance Management
- Real-time compliance dashboard
- Audit log tracking
- Report generation
- Configurable retention policies

### ✅ Risk Engine
- AI-powered risk assessment
- Configurable scoring thresholds
- Historical trend analysis
- Risk factor extraction

### ✅ Permits Workflow
- Multi-step approval process
- AI-assisted decision recommendations
- Status tracking
- Notification system

### ✅ Emergency Management
- Incident logging and escalation
- Real-time alert system
- Severity classification
- Recovery tracking

### ✅ Copilot Interface
- AI-powered Q&A
- Compliance guidance
- Risk analysis
- Permit assistance

### ✅ Heatmap Visualization
- Geographic risk visualization
- Real-time data updates
- Interactive drill-down
- Export capabilities

---

## 🏗️ Architecture Highlights

### Server Functions (NOT Routes!)
**Critical Fix**: Server functions live in `src/server/api/`, NOT `src/routes/api.*`

This separation ensures:
- ✅ TanStack Router doesn't try to treat them as pages
- ✅ No 404 errors on deployment
- ✅ Clean separation of concerns
- ✅ Proper framework usage

### Configuration-Driven
Every customizable setting lives in `src/config/`:
- Settings are typed and validated
- Easy environment-specific overrides
- No scattered hardcoded values
- Central source of truth

### AI Service Abstraction
Provider factory pattern enables:
- Runtime switching between Gemini & OpenRouter
- Single interface for both providers
- Easy addition of new providers
- Consistent error handling

### Type Safety
- Strict TypeScript throughout
- Environment variables typed via `import.meta.env`
- Response types for all API calls
- Configuration validation at startup

---

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [QUICK_START.md](./QUICK_START.md) | 5-minute setup guide |
| [CONFIGURATION_GUIDE.md](./CONFIGURATION_GUIDE.md) | Detailed config reference |
| [SUPABASE_INTEGRATION.md](./SUPABASE_INTEGRATION.md) | Database setup & schema |
| [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) | Production deployment |
| [FIX_404_ERRORS.md](./FIX_404_ERRORS.md) | Understanding the route fix |
| [INDEX.md](./INDEX.md) | Full project index |
| [BACKEND_API.md](./BACKEND_API.md) | Server function reference |

---

## 🐛 Common Issues & Fixes

### Build Warnings About Routes
**Problem**: `⚠️ Route file does not export a Route`

**Solution**: Files must be in `src/routes/` AND export Route component. If it's a server function, move it to `src/server/api/`.

**Fixed ✅**: All API functions moved to correct location.

### Environment Variables Not Loading
**Problem**: `undefined` values in production

**Solution**: Set variables in **Vercel Dashboard → Settings → Environment Variables** (not in git).

**Verification**: Use `validateEnvironment()` from `src/utils/environment.ts`

### Database Connection Errors
**Problem**: "Supabase client not configured"

**Solution**: 
1. Verify `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `.env.local`
2. Run `createClientSupabaseClient()` in browser or `createServerSupabaseClient()` in server
3. Check RLS policies allow your operations

### AI Provider Errors
**Problem**: "No API key found for provider"

**Solution**: 
1. Check `.env.local` has correct API key
2. Verify `VITE_AI_PROVIDER` matches the key you provided
3. Run `validateAIConfig()` to debug

---

## 📦 Available Commands

```bash
# Development
bun run dev              # Start dev server with HMR
bun run build           # Build for production
bun run preview         # Preview production build locally

# Linting
bun run lint            # Run ESLint
bun run lint:fix        # Fix linting issues

# Type Checking
bun run type-check      # Run TypeScript compiler

# Package Management
bun install             # Install dependencies
bun add <package>       # Add new package
bun remove <package>    # Remove package
```

---

## 🔐 Security Checklist

- [ ] Environment variables set in Vercel (not `.env`)
- [ ] `.env.local` is in `.gitignore` ✅
- [ ] RLS policies configured for Supabase tables
- [ ] Auth middleware implemented (see `src/server/api/auth.ts`)
- [ ] API rate limiting configured
- [ ] CORS settings verified
- [ ] API keys rotated regularly
- [ ] Sensitive logs disabled in production (`LOG_CONFIG.level`)

---

## 🚢 Deployment Checklist

### Before Pushing to Vercel
- [ ] `bun run build` completes with 0 errors
- [ ] `bun run dev` shows 0 build warnings
- [ ] All environment variables in `.env.local` work locally
- [ ] Database tables created in Supabase
- [ ] RLS policies enabled

### Vercel Dashboard Setup
- [ ] Project connected to git repository
- [ ] Environment variables set (Dashboard → Settings)
- [ ] Build command: `bun run build`
- [ ] Output directory: `.output` (auto-detected)
- [ ] Node.js version: 18+ (auto-detected)

### After Deployment
- [ ] Visit live URL and verify no errors
- [ ] Check DevTools Console for issues
- [ ] Test one server function end-to-end
- [ ] Compare with local functionality
- [ ] Monitor Vercel analytics

---

## 💡 Development Guidelines

### Adding New Routes
1. Create file in `src/routes/` (e.g., `src/routes/dashboard.tsx`)
2. Export `Route` component with layout
3. Add navigation link in `AppShell.tsx`

```typescript
// src/routes/dashboard.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  return <div>Dashboard content</div>
}
```

### Adding New Server Functions
1. Create file in `src/server/api/` (e.g., `src/server/api/analytics.ts`)
2. Use `createServerFn()` pattern
3. Add to `src/server/api/index.ts` exports

```typescript
// src/server/api/analytics.ts
import { createServerFn } from '@tanstack/start'

export const getAnalytics = createServerFn(
  { method: 'GET' },
  async () => {
    const client = await createServerSupabaseClient()
    return client.from('analytics').select('*')
  }
)
```

### Using Configuration
```typescript
import { RISK_CONFIG, API_CONFIG } from '@/config'
import { getPrompt } from '@/config/prompts'

// Access config values
const threshold = RISK_CONFIG.thresholds.critical
const prompt = getPrompt('SYSTEM_PROMPTS', 'riskAssessment')
```

### Accessing AI Services
```typescript
import { 
  sendAIMessage,
  sendAIMessageWithSystem,
  getAIPrompt 
} from '@/services/ai'

// Use AI for compliance analysis
const response = await sendAIMessageWithSystem(
  userInput,
  'complianceAudit',
  { maxTokens: 2048 }
)
```

---

## 🤝 Contributing

### Code Style
- Use TypeScript strictly (no `any`)
- Functional components with hooks
- Config values from `src/config/`
- Server functions in `src/server/api/`
- Test before committing

### Before Committing
```bash
bun run lint:fix        # Auto-fix style issues
bun run type-check      # Verify types
bun run build           # Test production build
```

### Git Workflow
```bash
git checkout -b feature/my-feature
# Make changes
bun run lint:fix
git add .
git commit -m "feat: add my feature"
git push origin feature/my-feature
# Create PR
```

---

## 📊 Project Status

| Phase | Status | Notes |
|-------|--------|-------|
| Backend API | ✅ Complete | 25+ server functions in 6 modules |
| Configuration | ✅ Complete | 3-file central config system |
| AI Services | ✅ Complete | Gemini + OpenRouter abstraction |
| Database | ✅ Complete | Supabase integration ready |
| Deployment | ✅ Complete | Vercel setup tested |
| Documentation | ✅ Complete | 12+ guide documents |
| Production Ready | ✅ Yes | Deploy anytime! |

---

## 🎓 Learning Resources

- [TanStack Start Docs](https://tanstack.com/router/latest/docs/framework/react/start)
- [Supabase Docs](https://supabase.com/docs)
- [Vercel Docs](https://vercel.com/docs)
- [React Patterns](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://radix-ui.com)

---

## 📧 Support & Issues

### Troubleshooting
1. Check **Console** for error messages
2. Review relevant guide in `/docs/`
3. Verify **Environment Variables** are set
4. Check **Build Warnings** - they indicate structural issues
5. Use `validateEnvironment()` to debug Vercel setup

### Common Error Messages

| Error | Cause | Fix |
|-------|-------|-----|
| `Cannot find module '@/server/api'` | Wrong import path | Check file exists in `src/server/api/` |
| `404: NOT_FOUND` | Route not exported | Ensure page exports Route component |
| `Supabase undefined` | Missing env vars | Check SUPABASE_URL and key in .env.local |
| `AI provider error` | Missing API key | Add GEMINI_API_KEY or OPENROUTER_API_KEY to .env.local |

---

## 📄 License

This project is built with Lovable integration. See [AGENTS.md](./AGENTS.md) for git history preservation guidelines.

---

## 🎉 You're Ready!

Your application is:
- ✅ Fully configured
- ✅ Connected to Supabase
- ✅ AI-powered and abstracted
- ✅ Ready for production
- ✅ Deployed on Vercel

**Next Steps:**
1. Create Supabase tables (see Quick Start)
2. Test locally: `bun run dev`
3. Deploy: `git push origin main`
4. Verify on Vercel
5. Customize via `.env` and `src/config/`

**Questions?** See the documentation in `/docs/` folder.

Happy coding! 🚀
