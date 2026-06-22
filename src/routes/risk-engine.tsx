import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Panel } from "@/components/layout/AppShell";
import { AGENTS } from "@/lib/mock-data";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/risk-engine")({
  head: () => ({ meta: [{ title: "Compound Risk Engine — SentinelAI" }] }),
  component: RiskEngine,
});

const WEIGHTS = [
  { k: "Gas Score",     w: 0.22, v: 87, contrib: 19.1 },
  { k: "SCADA Score",   w: 0.20, v: 81, contrib: 16.2 },
  { k: "Permit Score",  w: 0.18, v: 74, contrib: 13.3 },
  { k: "Worker Score",  w: 0.16, v: 68, contrib: 10.9 },
  { k: "Thermal Score", w: 0.12, v: 42, contrib: 5.0  },
  { k: "Synergy Score", w: 0.08, v: 88, contrib: 7.0  },
  { k: "Trend Escalation Bonus", w: 0.04, v: 95, contrib: 3.8 },
];

const RULES = [
  { a: "Gas Anomaly", b: "Hot Work Permit", out: "Explosion Risk",       sev: "critical" },
  { a: "Gas Anomaly", b: "Pressure Spike",  out: "Critical Process Risk",sev: "critical" },
  { a: "Gas Anomaly", b: "Workers in Zone", out: "Mass Casualty Risk",   sev: "critical" },
  { a: "Permit Overlap", b: "Worker Density", out: "Coordination Risk",  sev: "warning"  },
  { a: "Thermal Anomaly", b: "Pressure Drift", out: "Equipment Failure", sev: "warning"  },
  { a: "Vibration", b: "Pressure Spike",    out: "Pump/Compressor Fault",sev: "warning"  },
];

function RiskEngine() {
  const total = WEIGHTS.reduce((s, w) => s + w.contrib, 0).toFixed(1);
  return (
    <AppShell title="Compound Risk Engine" subtitle="Transparent multi-agent risk fusion · weighted formula with synergy uplift">
      <div className="grid grid-cols-12 gap-4">
        <Panel title="Weighted Risk Formula" className="col-span-12 lg:col-span-8">
          <div className="border border-border bg-surface-2 p-4 mono text-[12.5px] leading-relaxed">
            <span className="text-muted-foreground">R<sub>compound</sub> = </span>
            {WEIGHTS.map((w,i) => (
              <span key={w.k}>
                {i > 0 && <span className="text-muted-foreground"> + </span>}
                <span className="text-warning">{w.w.toFixed(2)}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-info">{w.k.split(" ")[0]}</span>
              </span>
            ))}
            <span className="text-muted-foreground"> + ε</span>
          </div>

          <div className="mt-4 space-y-1.5">
            {WEIGHTS.map(w => (
              <div key={w.k} className="grid grid-cols-12 items-center gap-2 text-[12px]">
                <div className="col-span-3 text-muted-foreground">{w.k}</div>
                <div className="col-span-1 mono text-warning">{w.w.toFixed(2)}</div>
                <div className="col-span-1 mono text-info">{w.v}</div>
                <div className="col-span-5 h-2 bg-surface-3 relative">
                  <div className="absolute inset-y-0 left-0 bg-primary/60" style={{ width: `${(w.contrib / 25) * 100}%` }} />
                </div>
                <div className="col-span-2 text-right mono font-semibold">+{w.contrib.toFixed(1)}</div>
              </div>
            ))}
            <div className="grid grid-cols-12 items-center gap-2 text-[12px] border-t border-border pt-2 mt-2">
              <div className="col-span-10 text-right mono uppercase tracking-wider text-muted-foreground">Compound Risk Score</div>
              <div className="col-span-2 text-right mono text-[20px] font-semibold text-critical">{total}</div>
            </div>
          </div>
        </Panel>

        <Panel title="Agent Inputs" className="col-span-12 lg:col-span-4">
          <div className="space-y-2">
            {AGENTS.map(a => (
              <div key={a.id} className="flex items-center justify-between border border-border bg-surface-2 px-2.5 py-2">
                <span className="text-[12px]">{a.name}</span>
                <span className={`mono text-[14px] font-semibold ${a.status === "critical" ? "text-critical" : a.status === "warning" ? "text-warning" : "text-foreground"}`}>{a.score}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Synergy Interaction Rules" className="col-span-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
            {RULES.map((r,i) => (
              <div key={i} className="bg-surface-2 p-3">
                <div className="flex items-center gap-2 text-[12.5px]">
                  <span className="border border-border bg-surface px-2 py-0.5 mono text-[11px]">{r.a}</span>
                  <span className="text-muted-foreground">+</span>
                  <span className="border border-border bg-surface px-2 py-0.5 mono text-[11px]">{r.b}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <ArrowRight size={13} className="text-muted-foreground" />
                  <span className={`mono text-[11px] uppercase tracking-wider font-semibold ${r.sev === "critical" ? "text-critical" : "text-warning"}`}>
                    {r.out}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
