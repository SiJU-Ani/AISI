import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Panel, StatusDot } from "@/components/layout/AppShell";
import { AGENTS, ALERTS, RISK_BREAKDOWN, RISK_TREND, ZONES } from "@/lib/mock-data";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell, CartesianGrid,
} from "recharts";
import { ArrowUpRight, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Command Center — SentinelAI" }] }),
  component: Dashboard,
});

const SCORE = 92;
const STATUS_TONE = SCORE >= 85 ? "critical" : SCORE >= 65 ? "warning" : SCORE >= 40 ? "info" : "safe";
const STATUS_LABEL = SCORE >= 85 ? "CRITICAL" : SCORE >= 65 ? "HIGH" : SCORE >= 40 ? "WARNING" : "SAFE";

function Dashboard() {
  return (
    <AppShell title="Command Center" subtitle="Compound risk monitoring across all instrumented zones · Vizag Steel Works · Unit 1">
      <div className="grid grid-cols-12 gap-4">
        {/* Risk gauge */}
        <Panel title="Compound Risk Score" className="col-span-12 lg:col-span-5" action={<span className="mono text-[10px] text-muted-foreground">UPDATED 2s AGO</span>}>
          <RiskGauge score={SCORE} />
          <div className="grid grid-cols-3 gap-px bg-border mt-4">
            <Stat label="Δ 15 MIN" value="+27" tone="critical" />
            <Stat label="ZONES @ RISK" value="3 / 8" tone="warning" />
            <Stat label="ACTIVE PERMITS" value="14" tone="info" />
          </div>
        </Panel>

        {/* Trend */}
        <Panel title="Risk Trend — Last 40 minutes" className="col-span-12 lg:col-span-7" action={<span className="mono text-[10px] text-critical flex items-center gap-1"><TrendingUp size={11}/> RISING RAPIDLY</span>}>
          <div className="h-[220px]">
            <ResponsiveContainer>
              <AreaChart data={RISK_TREND} margin={{ left: -20, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="riskg" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-critical)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="var(--color-critical)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="t" stroke="var(--color-muted-foreground)" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border-strong)", fontSize: 11, borderRadius: 2 }}
                  labelStyle={{ color: "var(--color-muted-foreground)" }}
                />
                <Area type="monotone" dataKey="score" stroke="var(--color-critical)" strokeWidth={1.5} fill="url(#riskg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        {/* Agents */}
        <Panel title="Agent Intelligence" className="col-span-12 lg:col-span-5" action={<span className="mono text-[10px] text-muted-foreground">5 AGENTS · 4 ANOMALIES</span>}>
          <div className="space-y-2.5">
            {AGENTS.map(a => (
              <div key={a.id} className="border border-border bg-surface-2 p-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusDot tone={a.status as any} />
                    <span className="text-[12.5px] font-medium">{a.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {a.anomaly && <span className="mono text-[9px] uppercase tracking-wider text-warning border border-warning/40 bg-warning/10 px-1.5 py-0.5">ANOMALY</span>}
                    <span className={`mono text-[13px] font-semibold ${a.status === "critical" ? "text-critical" : a.status === "warning" ? "text-warning" : "text-foreground"}`}>{a.score}</span>
                  </div>
                </div>
                <div className="mt-2 h-1 bg-surface-3 overflow-hidden">
                  <div
                    className={`h-full ${a.status === "critical" ? "bg-critical" : a.status === "warning" ? "bg-warning" : "bg-safe"}`}
                    style={{ width: `${a.score}%` }}
                  />
                </div>
                <div className="mt-1.5 text-[11px] text-muted-foreground">{a.detail}</div>
              </div>
            ))}
          </div>
        </Panel>

        {/* Live feed */}
        <Panel title="Live Event Feed" className="col-span-12 lg:col-span-7" action={<span className="mono text-[10px] text-safe flex items-center gap-1"><span className="status-dot bg-safe animate-pulse"/>STREAMING</span>}>
          <div className="divide-y divide-border -m-4">
            {ALERTS.map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-4 py-2.5 hover:bg-surface-2">
                <span className="mono text-[10.5px] text-muted-foreground tabular-nums shrink-0 w-16 mt-0.5">{a.t}</span>
                <span className={`mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 shrink-0 mt-0.5 ${sevPill(a.sev)}`}>{a.sev}</span>
                <span className="mono text-[10.5px] text-muted-foreground shrink-0 w-10 mt-0.5">{a.zone}</span>
                <span className="text-[12.5px] flex-1">{a.msg}</span>
                <ArrowUpRight size={12} className="text-muted-foreground shrink-0 mt-1" />
              </div>
            ))}
          </div>
        </Panel>

        {/* Breakdown */}
        <Panel title="Risk Contribution Breakdown" className="col-span-12 lg:col-span-7">
          <div className="h-[200px]">
            <ResponsiveContainer>
              <BarChart data={RISK_BREAKDOWN} layout="vertical" margin={{ left: 10, right: 20, top: 4, bottom: 0 }}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="2 4" horizontal={false} />
                <XAxis type="number" stroke="var(--color-muted-foreground)" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="factor" stroke="var(--color-muted-foreground)" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={70} />
                <Tooltip contentStyle={{ background: "var(--color-surface-2)", border: "1px solid var(--color-border-strong)", fontSize: 11, borderRadius: 2 }} />
                <Bar dataKey="value" radius={0}>
                  {RISK_BREAKDOWN.map((d,i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 border-t border-border pt-3 text-[12px] text-muted-foreground">
            <span className="text-foreground font-medium">Reasoning · </span>
            Gas anomaly (H₂S 87ppm) co-occurs with active hot work permit and SCADA pressure transient on Boiler-3.
            7 workers within 30m of the anomaly source. Synergy uplift applied per rule G-HW-04.
          </div>
        </Panel>

        {/* Zones */}
        <Panel title="Zone Status Matrix" className="col-span-12 lg:col-span-5" action={<span className="mono text-[10px] text-muted-foreground">8 ZONES</span>}>
          <div className="grid grid-cols-2 gap-2">
            {ZONES.map(z => (
              <div key={z.id} className={`border bg-surface-2 p-2.5 ${
                z.status === "critical" ? "border-critical/60" : z.status === "warning" ? "border-warning/40" : "border-border"
              }`}>
                <div className="flex items-center justify-between">
                  <span className="mono text-[10px] text-muted-foreground">{z.id}</span>
                  <StatusDot tone={z.status as any} />
                </div>
                <div className="text-[12px] font-medium mt-0.5 truncate">{z.name}</div>
                <div className="mt-1.5 flex items-baseline gap-1.5">
                  <span className={`mono text-[16px] font-semibold ${z.status === "critical" ? "text-critical" : z.status === "warning" ? "text-warning" : "text-safe"}`}>{z.risk}</span>
                  <span className="mono text-[9px] text-muted-foreground uppercase">risk</span>
                </div>
                <div className="mt-1 mono text-[10px] text-muted-foreground">
                  {z.workers}w · {z.permits}p · {z.gas}ppm
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}

function sevPill(s: string) {
  if (s === "critical") return "text-critical border border-critical/40 bg-critical/10";
  if (s === "warning") return "text-warning border border-warning/40 bg-warning/10";
  if (s === "info") return "text-info border border-info/40 bg-info/10";
  return "text-safe border border-safe/40 bg-safe/10";
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "safe"|"warning"|"critical"|"info" }) {
  const c = tone === "critical" ? "text-critical" : tone === "warning" ? "text-warning" : tone === "info" ? "text-info" : "text-safe";
  return (
    <div className="bg-surface p-2.5">
      <div className="mono text-[9.5px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mono text-[16px] font-semibold mt-0.5 ${c}`}>{value}</div>
    </div>
  );
}

function RiskGauge({ score }: { score: number }) {
  const r = 78;
  const c = 2 * Math.PI * r;
  const pct = score / 100;
  const arc = c * 0.75; // 270deg
  const dash = arc * pct;
  const tone = STATUS_TONE;
  const color = tone === "critical" ? "var(--color-critical)" : tone === "warning" ? "var(--color-warning)" : tone === "info" ? "var(--color-info)" : "var(--color-safe)";

  return (
    <div className="relative flex items-center justify-center h-[220px]">
      <svg viewBox="0 0 200 200" className="w-[220px] h-[220px] -rotate-[135deg]">
        <circle cx="100" cy="100" r={r} stroke="var(--color-surface-3)" strokeWidth="10" fill="none" strokeDasharray={`${arc} ${c}`} />
        <circle cx="100" cy="100" r={r} stroke={color} strokeWidth="10" fill="none" strokeDasharray={`${dash} ${c}`} strokeLinecap="butt" />
        {/* ticks */}
        {Array.from({ length: 11 }).map((_, i) => {
          const a = (i / 10) * 0.75 * 2 * Math.PI;
          const x1 = 100 + Math.cos(a) * 90;
          const y1 = 100 + Math.sin(a) * 90;
          const x2 = 100 + Math.cos(a) * 96;
          const y2 = 100 + Math.sin(a) * 96;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--color-muted-foreground)" strokeWidth="1" opacity="0.6" />;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Compound Risk</div>
        <div className={`mono text-[56px] font-semibold leading-none mt-1 ${
          tone === "critical" ? "text-critical" : tone === "warning" ? "text-warning" : tone === "info" ? "text-info" : "text-safe"
        }`}>{score}</div>
        <div className={`mt-1 mono text-[11px] font-semibold uppercase tracking-[0.2em] px-2 py-0.5 border ${
          tone === "critical" ? "text-critical border-critical/50 bg-critical/10" :
          tone === "warning" ? "text-warning border-warning/50 bg-warning/10" :
          tone === "info" ? "text-info border-info/50 bg-info/10" :
          "text-safe border-safe/50 bg-safe/10"
        }`}>{STATUS_LABEL}</div>
      </div>
    </div>
  );
}
