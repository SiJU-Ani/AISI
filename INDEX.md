# AISI Project Index

**Last Updated**: 2026-06-22  
**Framework**: TanStack Start (Full-Stack React with TypeScript + Vite)  
**Connected To**: Lovable (⚠️ Do not rewrite published git history)

---

## 📋 Project Overview

AISI is a full-stack web application featuring compliance management, risk assessment, permit handling, emergency response, and AI copilot capabilities. The application uses TanStack Router for client-side routing, TanStack Query for data fetching, and Radix UI components for a professional UI.

### Key Features
- **Compliance Tracking** - Audit trails and regulatory compliance management
- **Risk Engine** - Risk assessment and predictive scoring
- **Permit Management** - Permit creation, approval, and tracking workflows
- **Emergency Response** - Alert system and incident management
- **Heatmap Visualization** - Data visualization and metrics
- **AI Copilot** - Conversational AI assistant
- **User Authentication** - Secure login and session management

---

## 📁 Project Structure

```
AISI/
├── src/
│   ├── config/              # ⭐ Central Configuration (NEW)
│   │   ├── index.ts         # Main config (APIs, timeouts, thresholds, feature flags)
│   │   ├── ai.ts            # AI provider abstraction & settings
│   │   └── prompts.ts       # Centralized prompt management
│   │
│   ├── services/            # ⭐ Service Layer (NEW)
│   │   └── ai/
│   │       ├── index.ts          # Main AI service interface
│   │       ├── provider.ts       # Base provider interface
│   │       ├── gemini.ts         # Gemini implementation
│   │       ├── openrouter.ts     # OpenRouter implementation
│   │       └── utils.ts          # Helper utilities
│   │
│   ├── components/          # React UI components
│   │   ├── layout/
│   │   │   └── AppShell.tsx     # Main app layout wrapper
│   │   ├── examples/        # ⭐ Example components (NEW)
│   │   │   ├── ComplianceAnalysisExample.tsx
│   │   │   ├── RiskCalculationExample.tsx
│   │   │   └── ConfigurationDisplayExample.tsx
│   │   └── ui/              # Radix UI component library
│   │       ├── accordion.tsx
│   │       ├── alert.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── form.tsx
│   │       ├── sidebar.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       └── ... (25+ UI components)
│   │
│   ├── routes/              # TanStack Router file-based routing
│   │   ├── api/             # Backend API endpoints
│   │   │   ├── __index.tsx          # API root metadata
│   │   │   ├── api.auth.tsx         # Authentication
│   │   │   ├── api.compliance.tsx   # Compliance module
│   │   │   ├── api.copilot.tsx      # AI copilot
│   │   │   ├── api.emergency.tsx    # Emergency alerts
│   │   │   ├── api.heatmap.tsx      # Heatmap data
│   │   │   ├── api.permits.tsx      # Permit management
│   │   │   └── api.risk-engine.tsx  # Risk scoring
│   │   │
│   │   ├── __root.tsx           # Root layout (app shell)
│   │   ├── index.tsx            # Home page
│   │   ├── login.tsx            # Login page
│   │   ├── compliance.tsx       # Compliance page
│   │   ├── copilot.tsx          # AI copilot interface
│   │   ├── emergency.tsx        # Emergency dashboard
│   │   ├── heatmap.tsx          # Heatmap visualization
│   │   ├── permits.tsx          # Permit management UI
│   │   ├── risk-engine.tsx      # Risk analysis dashboard
│   │   └── README.md            # Routing conventions
│   │
│   ├── hooks/               # Custom React hooks
│   │   └── use-mobile.tsx       # Mobile device detection
│   │
│   ├── lib/                 # Utility functions & helpers
│   │   ├── error-capture.ts     # Error capture system
│   │   ├── error-page.ts        # Error page rendering
│   │   ├── lovable-error-reporting.ts  # Lovable integration
│   │   ├── mock-data.ts         # Mock data for development
│   │   └── utils.ts             # General utilities
│   │
│   ├── server.ts            # SSR server entry point
│   ├── start.ts             # App initialization
│   ├── router.tsx           # Router configuration
│   ├── routeTree.gen.ts     # Generated route tree
│   └── styles.css           # Global styles
│
├── Configuration Files
│   ├── .env.example         # ⭐ Environment template (NEW)
│   ├── package.json         # Dependencies & scripts
│   ├── tsconfig.json        # TypeScript config
│   ├── vite.config.ts       # Vite build config
│   ├── eslint.config.js     # ESLint rules
│   ├── bunfig.toml          # Bun runtime config
│   ├── components.json      # Component metadata
│   └── AGENTS.md            # Lovable integration guide
│
├── Documentation Files
│   ├── INDEX.md             # This file
│   ├── BACKEND_API.md       # Backend API documentation
│   ├── QUICK_START.md       # Quick start guide
│   ├── CONFIGURATION_GUIDE.md  # ⭐ Configuration & AI service guide (NEW)
│
```

---

## 🔗 Frontend Routes

| Route | File | Purpose |
|-------|------|---------|
| `/` | `index.tsx` | Home dashboard |
| `/login` | `login.tsx` | User authentication |
| `/compliance` | `compliance.tsx` | Compliance tracking & audit |
| `/copilot` | `copilot.tsx` | AI assistant interface |
| `/emergency` | `emergency.tsx` | Emergency alerts & incidents |
| `/heatmap` | `heatmap.tsx` | Data visualization |
| `/permits` | `permits.tsx` | Permit workflow management |
| `/risk-engine` | `risk-engine.tsx` | Risk assessment dashboard |

---

## 🔌 Backend API Routes

All API endpoints are implemented using TanStack React Start's `createServerFn`.

### Authentication
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/logout` - User logout
- **GET** `/api/auth/current-user` - Get current user

### Compliance
- **GET** `/api/compliance` - Get compliance status
- **POST** `/api/compliance/report` - Create compliance report

### Copilot
- **GET** `/api/copilot` - Get copilot status
- **POST** `/api/copilot/message` - Send message to copilot

### Emergency
- **GET** `/api/emergency` - Get emergency status
- **POST** `/api/emergency/alert` - Trigger emergency alert

### Heatmap
- **GET** `/api/heatmap` - Fetch heatmap data
- **POST** `/api/heatmap/generate` - Generate heatmap

### Permits
- **GET** `/api/permits` - List all permits
- **POST** `/api/permits` - Create new permit
- **PUT** `/api/permits/:id` - Update permit status

### Risk Engine
- **GET** `/api/risk-engine` - Get risk score
- **POST** `/api/risk-engine/calculate` - Calculate risk
- **GET** `/api/risk-engine/report` - Generate risk report

---

## 📦 Key Dependencies

### Core Framework
- `@tanstack/react-start` - Full-stack React framework
- `@tanstack/react-router` - Client-side routing
- `@tanstack/react-query` - Server state management

### UI & Styling
- `@radix-ui/*` - Headless UI component library (25+ components)
- `@tailwindcss/vite` - Tailwind CSS integration
- `class-variance-authority` - Variant utility library
- `clsx` - Classname utility

### Forms & Validation
- `@hookform/resolvers` - Form validation resolvers
- `react-hook-form` - Performant form library

### Utilities
- `cmdk` - Command palette component
- `date-fns` - Date utilities
- `sonner` - Toast notifications

---

## 🚀 Development Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Build in development mode
npm run build:dev

# Preview production build
npm run preview

# Lint code
npm run lint

# Format code
npm run format
```

---

## 🔧 Technology Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React 18, TypeScript, TanStack Router |
| **Styling** | Tailwind CSS, Radix UI |
| **Backend** | TanStack React Start (SSR), Node.js |
| **Build** | Vite, Esbuild |
| **Runtime** | Bun or Node.js |
| **Deployment** | Cloudflare Workers (default) |

---

## 📝 Development Guidelines

### Routing
- Files in `src/routes/` are automatically converted to routes
- Use `$param` syntax for dynamic segments (not `:param`)
- Use `_layout.tsx` for layout routes
- Use `__root.tsx` for app shell (top-level layout)

### API Routes
- All API handlers use `createServerFn` from TanStack React Start
- API route files follow the pattern `api.{module}.tsx`
- Each API endpoint has JSDoc documentation

### Components
- UI components are in `src/components/ui/`
- Layout components are in `src/components/layout/`
- Use Radix UI primitives for accessibility

### Styling
- Global styles in `src/styles.css`
- Utility-first approach with Tailwind CSS
- Component styles co-located with components

---

## 🔐 Important Notes

⚠️ **Lovable Integration**
- This project is connected to Lovable (lovable.dev)
- Do NOT rewrite published git history (no force push, rebase, or amend on pushed commits)
- Commits sync back to Lovable and show up in the editor
- Keep the branch in working state

---

## 📚 Additional Resources

- [TanStack Start Documentation](https://tanstack.com/start)
- [TanStack Router Docs](https://tanstack.com/router)
- [Radix UI Components](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

---

## ⚙️ Configuration & AI Service Refactor (NEW)

The project has been refactored for maintainability and configuration management:

### Key Components

1. **Central Configuration** (`src/config/index.ts`)
   - All configurable values (APIs, timeouts, thresholds, feature flags)
   - No magic numbers in code
   - Easily customizable without modifying business logic

2. **AI Provider Abstraction** (`src/config/ai.ts` + `src/services/ai/`)
   - Support for Gemini 2.5 Flash and OpenRouter
   - Switch providers via environment variable only
   - Unified provider interface

3. **Prompt Management** (`src/config/prompts.ts`)
   - Centralized prompt organization by category
   - System, agent, extraction, classification, summarization, analysis, decision prompts
   - No hardcoded prompts in components

### Quick Setup

```bash
# 1. Copy environment template
cp .env.example .env

# 2. Fill in your API keys
VITE_AI_PROVIDER=gemini
GEMINI_API_KEY=your-key-here

# 3. That's it! No code changes needed for configuration
```

### Customization

After refactor, customize the entire app by editing ONLY:
- `.env` - Environment-specific secrets
- `src/config/index.ts` - Feature flags, thresholds, limits
- `src/config/prompts.ts` - AI prompts and instructions

**See [CONFIGURATION_GUIDE.md](CONFIGURATION_GUIDE.md) for detailed documentation**

## 🎯 Next Steps

1. **Set up environment** - Copy `.env.example` to `.env` and fill in API keys
2. **Initialize AI provider** - Call `initializeAIProvider()` in your app startup
3. **Implement backend logic** - Fill in TODO sections in API routes
4. **Add data layer** - Connect to databases/external services
5. **Add authentication** - Implement actual user auth (JWT, sessions, etc.)
6. **Testing** - Add unit and integration tests
7. **Deployment** - Configure Cloudflare Workers or other hosting

---

Generated: 2026-06-22
