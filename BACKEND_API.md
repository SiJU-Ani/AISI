# Backend API Documentation

## Overview

The AISI backend is built using **TanStack React Start**, which provides a full-stack React framework with server functions and API routes integrated directly into the application.

## Architecture

### Server Functions (`createServerFn`)

All backend endpoints use `createServerFn` from `@tanstack/react-start/server`. This provides:
- Type-safe RPC calls from the frontend
- Automatic serialization/deserialization
- Built-in error handling
- Server-side logic isolation

### API Route Convention

Backend API routes are located in `src/routes/` with the naming pattern: `api.{module}.tsx`

```
api.auth.tsx          → Authentication endpoints
api.compliance.tsx    → Compliance module
api.copilot.tsx       → AI copilot endpoints
api.emergency.tsx     → Emergency & alerts
api.heatmap.tsx       → Heatmap data generation
api.permits.tsx       → Permit management
api.risk-engine.tsx   → Risk assessment & scoring
```

## API Modules

### 1. Authentication API (`api.auth.tsx`)

Handles user authentication, sessions, and authorization.

**Endpoints:**
- `loginUser(email: string, password: string)` - POST
- `logoutUser()` - POST
- `getCurrentUser()` - GET

**Example Usage:**
```typescript
import { loginUser } from './routes/api.auth';

const result = await loginUser({ email: 'user@example.com', password: 'pass' });
```

### 2. Compliance API (`api.compliance.tsx`)

Manages compliance checks, audit trails, and regulatory reporting.

**Endpoints:**
- `getComplianceStatus()` - GET
- `createComplianceReport(title: string, description: string)` - POST

**Features:**
- Audit trail tracking
- Compliance reporting
- Risk assessment integration

### 3. Copilot API (`api.copilot.tsx`)

AI-powered assistant for user queries and code generation.

**Endpoints:**
- `getCopilotStatus()` - GET
- `sendCopilotMessage(message: string, context?: string)` - POST

**Capabilities:**
- Chat interactions
- Code generation
- Data analysis

### 4. Emergency API (`api.emergency.tsx`)

Manages emergency alerts and incident response.

**Endpoints:**
- `getEmergencyStatus()` - GET
- `triggerEmergencyAlert(severity: 'low'|'medium'|'high'|'critical', message: string)` - POST

**Features:**
- Multi-channel notifications (email, SMS, webhook)
- Alert routing
- Incident tracking

### 5. Heatmap API (`api.heatmap.tsx`)

Generates and serves heatmap data for visualization.

**Endpoints:**
- `getHeatmapData(region?: string, timeframe?: string)` - GET
- `generateHeatmap(region: string, timeframe: string, metric: string)` - POST

### 6. Permits API (`api.permits.tsx`)

Handles permit lifecycle management.

**Endpoints:**
- `getPermits(status?: string, limit?: number)` - GET
- `createPermit(type: string, description: string, requesterId: string)` - POST
- `updatePermitStatus(permitId: string, status: 'approved'|'rejected'|'pending')` - PUT

**Workflow:**
1. Request creation (pending)
2. Review/approval process
3. Status updates
4. Compliance tracking

### 7. Risk Engine API (`api.risk-engine.tsx`)

Advanced risk assessment and predictive scoring.

**Endpoints:**
- `getRiskScore(entityId?: string, entityType?: string)` - GET
- `calculateRisk(factors: Record<string, number>, entityType: string)` - POST
- `getRiskReport(period?: string, entityType?: string)` - GET

**Features:**
- Multi-factor risk calculation
- Historical tracking
- Predictive modeling (ML-ready)

## Implementation Guide

### Creating a New API Endpoint

1. **Create the route file** in `src/routes/api.{module}.tsx`

```typescript
import { createServerFn } from "@tanstack/react-start/server";
import { json } from "@tanstack/react-start";

export const myEndpoint = createServerFn(
  { method: "GET" | "POST" | "PUT" | "DELETE" },
  async (params?: { ... }) => {
    // TODO: Implement backend logic
    return json({ ... });
  },
);

export default function ApiModule() {
  return null;
}
```

2. **Call from frontend** using the server function

```typescript
import { myEndpoint } from './routes/api.{module}';

const data = await myEndpoint(params);
```

### Error Handling

```typescript
export const riskyEndpoint = createServerFn(
  { method: "POST" },
  async (data: any) => {
    try {
      // Your logic
      return json({ success: true, data });
    } catch (error) {
      return json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }
  },
);
```

### Type Safety

```typescript
// Define types for request/response
type CreatePermitRequest = {
  type: string;
  description: string;
  requesterId: string;
};

type CreatePermitResponse = {
  success: boolean;
  permitId: string;
  status: string;
};

export const createPermit = createServerFn(
  { method: "POST" },
  async (data: CreatePermitRequest): Promise<CreatePermitResponse> => {
    return json({
      success: true,
      permitId: `permit-${Date.now()}`,
      status: "pending",
    });
  },
);
```

## Integration Points

### With Frontend Components

```typescript
// In a React component
import { useQuery } from "@tanstack/react-query";
import { getPermits } from "./routes/api.permits";

export function PermitsList() {
  const { data } = useQuery({
    queryKey: ["permits"],
    queryFn: () => getPermits(),
  });
  
  return <div>{/* render permits */}</div>;
}
```

### With External Services

```typescript
export const createComplianceReport = createServerFn(
  { method: "POST" },
  async (data: ComplianceData) => {
    // Call external compliance service
    const result = await fetch("https://compliance-service.com/api", {
      method: "POST",
      body: JSON.stringify(data),
    });
    
    return json(await result.json());
  },
);
```

## Database Integration (TODO)

Add database support for persistence:

```typescript
// Example with Prisma
import { prisma } from "./lib/prisma";

export const getPermits = createServerFn({ method: "GET" }, async () => {
  const permits = await prisma.permit.findMany();
  return json({ permits });
});
```

## Authentication Middleware (TODO)

Protect endpoints with authentication:

```typescript
export const protectedEndpoint = createServerFn(
  { method: "GET" },
  async (_, context) => {
    const user = await getCurrentUser(context);
    if (!user) {
      return json({ error: "Unauthorized" }, { status: 401 });
    }
    
    return json({ data: "secret" });
  },
);
```

## Deployment

- **Development**: `npm run dev` - Hot reload server
- **Production**: `npm run build` - Compiles for Cloudflare Workers
- **Preview**: `npm run preview` - Test production build locally

## Performance Considerations

1. **Caching** - Use React Query's cache management
2. **Pagination** - Implement for large datasets
3. **Streaming** - Utilize Vite streaming for large responses
4. **Optimization** - Use lazy loading for routes

## Security Best Practices

- ✅ Type-safe server functions
- ✅ Built-in CORS support
- ✅ Automatic request validation
- 🔒 Add authentication guards (TODO)
- 🔒 Add rate limiting (TODO)
- 🔒 Add input validation (TODO)
- 🔒 Add RBAC/permissions (TODO)

---

**Updated**: 2026-06-22
