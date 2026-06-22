import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  Gauge, Map, Cpu, FileCheck2, MessageSquareWarning, Siren, ShieldCheck,
  Bell, ChevronLeft, ChevronRight, Search, User2, Power
} from "lucide-react";
import { PLANTS } from "@/lib/mock-data";

const NAV = [
  { to: "/",           label: "Command Center",      icon: Gauge },
  { to: "/heatmap",    label: "Geospatial Heatmap",  icon: Map },
  { to: "/risk-engine",label: "Risk Engine",         icon: Cpu },
  { to: "/permits",    label: "Permit Intelligence", icon: FileCheck2 },
  { to: "/copilot",    label: "Incident Copilot",    icon: MessageSquareWarning },
  { to: "/emergency",  label: "Emergency Response",  icon: Siren },
  { to: "/compliance", label: "Compliance & Audit",  icon: ShieldCheck },
] as const;

export function AppShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [plant, setPlant] = useState(PLANTS[0].id);
  const [clock, setClock] = useState("");
  const path = useRouterState({ select: s => s.location.pathname });

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(d.toISOString().replace("T", " ").slice(0, 19) + " UTC");
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-14" : "w-60"} shrink-0 border-r border-border bg-surface transition-[width] duration-150`}>
        <div className="flex h-12 items-center gap-2 border-b border-border px-3">
          <div className="size-6 bg-primary/20 border border-primary/60 grid place-items-center">
            <div className="size-2 bg-primary" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">SentinelAI</div>
              <div className="mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">SAFETY OPS · v4.2</div>
            </div>
          )}
        </div>
        <nav className="py-2">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = path === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-2 mx-1 text-[12.5px] border-l-2 ${
                  active
                    ? "border-primary bg-surface-2 text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-surface-2"
                }`}
              >
                <Icon size={15} className="shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => setCollapsed(c => !c)}
          className="absolute bottom-3 left-3 size-7 grid place-items-center border border-border bg-surface-2 text-muted-foreground hover:text-foreground"
          aria-label="Toggle sidebar"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top command bar */}
        <header className="flex h-12 items-center gap-3 border-b border-border bg-surface px-4">
          <div className="flex items-center gap-2">
            <span className="status-dot bg-critical animate-pulse" />
            <span className="mono text-[10px] uppercase tracking-[0.18em] text-critical">CRITICAL · 1 ZONE</span>
          </div>
          <div className="h-5 w-px bg-border" />
          <select
            value={plant}
            onChange={e => setPlant(e.target.value)}
            className="bg-surface-2 border border-border px-2 py-1 text-[12px] focus:outline-none focus:border-primary"
          >
            {PLANTS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>

          <div className="ml-2 hidden md:flex items-center gap-2 border border-border bg-surface-2 px-2 py-1 flex-1 max-w-md">
            <Search size={13} className="text-muted-foreground" />
            <input
              placeholder="Search zones, permits, incidents…"
              className="bg-transparent text-[12px] outline-none flex-1 placeholder:text-muted-foreground/70"
            />
            <kbd className="mono text-[10px] text-muted-foreground border border-border px-1">⌘K</kbd>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="mono text-[11px] text-muted-foreground hidden lg:block">{clock}</div>
            <button className="relative size-7 grid place-items-center border border-border bg-surface-2 hover:bg-surface-3">
              <Bell size={14} />
              <span className="absolute -top-1 -right-1 size-3 bg-critical text-[8px] text-critical-foreground grid place-items-center font-bold">9</span>
            </button>
            <div className="flex items-center gap-2 border border-border bg-surface-2 px-2 py-1">
              <div className="size-5 bg-primary/30 border border-primary/60 grid place-items-center">
                <User2 size={11} />
              </div>
              <div className="leading-tight hidden md:block">
                <div className="text-[11px] font-medium">K. Rao</div>
                <div className="mono text-[9px] uppercase text-muted-foreground tracking-wider">Safety Officer</div>
              </div>
            </div>
            <Link to="/login" className="size-7 grid place-items-center border border-border bg-surface-2 hover:bg-critical hover:text-critical-foreground" aria-label="Sign out">
              <Power size={13} />
            </Link>
          </div>
        </header>

        {/* Page header strip */}
        <div className="flex items-center justify-between border-b border-border bg-background px-5 py-3">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {NAV.find(n => n.to === path)?.label ?? "Module"}
            </div>
            <h1 className="text-[18px] font-semibold tracking-tight">{title}</h1>
            {subtitle && <div className="text-[12px] text-muted-foreground mt-0.5">{subtitle}</div>}
          </div>
          <div className="flex items-center gap-2">
            <Pill label="DATA FEED" value="LIVE" tone="safe" pulse />
            <Pill label="AGENTS" value="5 / 5" tone="info" />
            <Pill label="UPTIME" value="99.982%" tone="muted" />
          </div>
        </div>

        <main className="flex-1 overflow-auto p-5">{children}</main>
      </div>
    </div>
  );
}

function Pill({ label, value, tone, pulse }: { label: string; value: string; tone: "safe"|"warning"|"critical"|"info"|"muted"; pulse?: boolean }) {
  const tones: Record<string, string> = {
    safe: "text-safe border-safe/40 bg-safe/10",
    warning: "text-warning border-warning/40 bg-warning/10",
    critical: "text-critical border-critical/40 bg-critical/10",
    info: "text-info border-info/40 bg-info/10",
    muted: "text-muted-foreground border-border bg-surface-2",
  };
  return (
    <div className={`flex items-center gap-2 border px-2 py-1 mono text-[10px] uppercase tracking-wider ${tones[tone]}`}>
      {pulse && <span className={`status-dot bg-current animate-pulse`} />}
      <span className="opacity-70">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

export function Panel({ title, action, children, className = "" }: { title?: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`panel ${className}`}>
      {title && (
        <div className="panel-header">
          <span>{title}</span>
          {action}
        </div>
      )}
      <div className="p-4">{children}</div>
    </section>
  );
}

export function StatusDot({ tone }: { tone: "safe"|"warning"|"critical"|"info" }) {
  const map = { safe: "bg-safe", warning: "bg-warning", critical: "bg-critical", info: "bg-info" };
  return <span className={`status-dot ${map[tone]}`} />;
}
