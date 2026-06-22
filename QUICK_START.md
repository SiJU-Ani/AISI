# Quick Start Guide

## 🚀 Getting Started with AISI

### Prerequisites
- Node.js 18+ (or Bun as alternative runtime)
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd AISI

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173`

---

## 📝 Project Structure at a Glance

```
src/
├── routes/          ← Add new pages & API endpoints here
│   ├── api.{feature}.tsx    ← Backend APIs
│   └── {feature}.tsx        ← Frontend pages
├── components/      ← React components
│   ├── ui/         ← Reusable UI components
│   └── layout/     ← Layout wrappers
├── hooks/          ← Custom React hooks
├── lib/            ← Utilities & helpers
└── server.ts       ← SSR entry point
```

---

## 🔨 Common Tasks

### 1. Add a New Frontend Page

Create `src/routes/mypage.tsx`:

```typescript
export default function MyPage() {
  return (
    <div>
      <h1>My Page</h1>
      <p>Welcome</p>
    </div>
  );
}
```

Access it at `/mypage`

### 2. Add a New API Endpoint

Create `src/routes/api.mymodule.tsx`:

```typescript
import { createServerFn } from "@tanstack/react-start/server";
import { json } from "@tanstack/react-start";

export const fetchMyData = createServerFn(
  { method: "GET" },
  async () => {
    return json({ data: "Hello from server" });
  },
);

export default function MyModuleApi() {
  return null;
}
```

Use it in a component:

```typescript
import { fetchMyData } from "../routes/api.mymodule";

const data = await fetchMyData();
```

### 3. Use TypeScript Components

Components are fully typed with TypeScript:

```typescript
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Dashboard() {
  return (
    <Card>
      <Button>Click me</Button>
    </Card>
  );
}
```

### 4. Add Form Validation

```typescript
import { useForm } from "react-hook-form";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export default function MyForm() {
  const form = useForm();
  
  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </Form>
  );
}
```

### 5. Use Data Fetching with Queries

```typescript
import { useQuery } from "@tanstack/react-query";
import { getPermits } from "../routes/api.permits";

export function PermitsList() {
  const { data, isLoading } = useQuery({
    queryKey: ["permits"],
    queryFn: () => getPermits(),
  });
  
  if (isLoading) return <div>Loading...</div>;
  
  return (
    <div>
      {data?.permits?.map(permit => (
        <div key={permit.id}>{permit.name}</div>
      ))}
    </div>
  );
}
```

---

## 📚 Available UI Components

All Radix UI components are pre-installed:

- **Layout**: `Card`, `Sidebar`, `Sheet`, `Tabs`, `Accordion`
- **Forms**: `Input`, `Select`, `Checkbox`, `Radio`, `Toggle`, `Textarea`
- **Feedback**: `Alert`, `AlertDialog`, `Popover`, `Tooltip`, `Toast`
- **Navigation**: `Breadcrumb`, `Pagination`, `NavigationMenu`
- **Data**: `Table`, `Progress`, `Slider`
- **Media**: `Avatar`, `AspectRatio`, `Image`

Import any component:
```typescript
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
```

---

## 🎨 Styling

Use Tailwind CSS classes in components:

```typescript
<div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
  <h2 className="text-lg font-semibold">Title</h2>
  <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
    Action
  </button>
</div>
```

---

## 🔐 Environment Variables

Create `.env.local`:

```
VITE_API_URL=http://localhost:5173
VITE_AUTH_TOKEN=your-token
```

Access in code:
```typescript
const apiUrl = import.meta.env.VITE_API_URL;
```

---

## 🧪 Development Features

### Hot Module Replacement (HMR)
- Changes are reflected instantly in the browser
- Server and client updates are synchronized

### TypeScript Support
- Full type checking during development
- IntelliSense in your editor

### Development Tools
- ESLint for code quality
- Prettier for code formatting
- Error boundaries and logging

```bash
npm run lint          # Check code quality
npm run format        # Format code
npm run build         # Production build
npm run preview       # Test production build
```

---

## 🚢 Building for Production

```bash
npm run build
```

This creates an optimized build in the `dist/` directory, ready for deployment to Cloudflare Workers or any Node.js server.

---

## 📖 Documentation Links

- **Full Project Index**: See [INDEX.md](INDEX.md)
- **Backend API Docs**: See [BACKEND_API.md](BACKEND_API.md)
- **TanStack Start**: https://tanstack.com/start
- **Radix UI**: https://www.radix-ui.com/
- **Tailwind CSS**: https://tailwindcss.com/

---

## 🆘 Troubleshooting

### Port already in use
```bash
npm run dev -- --port 3000
```

### Dependencies not installing
```bash
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
npm run build -- --force
```

### Clear cache
```bash
rm -rf node_modules/.vite
npm run dev
```

---

## 💡 Tips

- Use the existing UI components - they're fully accessible
- Keep API routes modular and focused
- Use React Query for server state
- Leverage TypeScript for type safety
- Check the routes directory for examples

---

**Happy coding! 🎉**

For detailed information, see [INDEX.md](INDEX.md) and [BACKEND_API.md](BACKEND_API.md)
