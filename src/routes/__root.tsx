import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mono text-[10px] tracking-[0.2em] text-muted-foreground">ERR_ROUTE_NOT_FOUND</div>
        <h1 className="mt-2 text-5xl font-semibold text-foreground">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The requested resource does not exist on this terminal.
        </p>
        <Link to="/" className="mt-6 inline-flex items-center border border-border-strong bg-surface-2 px-4 py-2 text-xs font-medium uppercase tracking-wider text-foreground hover:bg-surface-3">
          Return to Command Center
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="mono text-[10px] tracking-[0.2em] text-critical">SYSTEM_FAULT</div>
        <h1 className="mt-2 text-xl font-semibold text-foreground">Subsystem failed to initialize</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A non-recoverable error was reported by the runtime.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="border border-border-strong bg-primary px-4 py-2 text-xs font-medium uppercase tracking-wider text-primary-foreground hover:opacity-90"
          >
            Retry
          </button>
          <a href="/" className="border border-border-strong bg-surface-2 px-4 py-2 text-xs font-medium uppercase tracking-wider text-foreground hover:bg-surface-3">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SentinelAI — Industrial Safety Intelligence" },
      { name: "description", content: "AI-powered predictive safety intelligence platform for heavy industrial facilities." },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
