import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Panel } from "@/components/layout/AppShell";
import { Siren, CheckCircle2, Phone, Radio, Lock, FileText } from "lucide-react";

export const Route = createFileRoute("/emergency")({
  head: () => ({ meta: [{ title: "Emergency Response — SentinelAI" }] }),
  component: Emergency,
});

const STEPS = [
  { id: "siren",     label: "Plant siren activated",            icon: Radio,        done: true,  t: "14:07:24" },
  { id: "supervisor",label: "Shift supervisor notified",        icon: Phone,        done: true,  t: "14:07:26" },
  { id: "lockdown",  label: "Boiler Zone (Z-01) locked down",   icon: Lock,         done: true,  t: "14:07:31" },
  { id: "evac",      label: "Evacuation order broadcast — 30m perimeter", icon: Siren, done: true, t: "14:07:33" },
  { id: "valves",    label: "Isolation valves KV-301/KV-307 closed",  icon: CheckCircle2, done: true, t: "14:07:48" },
  { id: "ems",       label: "External EMS dispatched (ETA 6 min)", icon: Phone,    done: false, t: "PENDING" },
  { id: "evidence",  label: "Sensor evidence snapshot preserved",  icon: FileText, done: true,  t: "14:07:52" },
  { id: "report",    label: "Incident report INC-2026-0418 drafted", icon: FileText, done: false, t: "AWAITING" },
];

function Emergency() {
  const [active, setActive] = useState(true);
  return (
    <AppShell title="Emergency Response Orchestrator" subtitle="Coordinated incident response · Z-01 Boiler Zone · Compound risk 92">
      {active && (
        <div className="mb-4 border-2 border-critical bg-critical/10 px-4 py-3 flex items-center gap-3">
          <Siren size={20} className="text-critical animate-pulse" />
          <div className="flex-1">
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-critical font-semibold">ACTIVE INCIDENT · INC-2026-0418</div>
            <div className="text-[13px] mt-0.5">Compound risk threshold breached at 14:07:22 UTC. Emergency protocol P-CRIT-04 engaged.</div>
          </div>
          <button onClick={() => setActive(false)} className="border border-border bg-surface-2 px-3 py-1.5 text-[11px] uppercase tracking-wider hover:bg-surface-3">
            Acknowledge
          </button>
        </div>
      )}

      <div className="grid grid-cols-12 gap-4">
        <Panel title="Response Checklist · P-CRIT-04" className="col-span-12 lg:col-span-7">
          <div className="space-y-1.5">
            {STEPS.map(s => (
              <div key={s.id} className={`flex items-center gap-3 border px-3 py-2.5 ${s.done ? "border-safe/30 bg-safe/5" : "border-warning/40 bg-warning/5"}`}>
                <div className={`size-7 grid place-items-center border ${s.done ? "border-safe/50 bg-safe/10 text-safe" : "border-warning/50 bg-warning/10 text-warning"}`}>
                  <s.icon size={13} />
                </div>
                <div className="flex-1">
                  <div className="text-[12.5px] font-medium">{s.label}</div>
                </div>
                <div className={`mono text-[10.5px] uppercase tracking-wider ${s.done ? "text-safe" : "text-warning"}`}>
                  {s.done ? "✓ DONE" : "PENDING"}
                </div>
                <div className="mono text-[10.5px] text-muted-foreground w-20 text-right">{s.t}</div>
              </div>
            ))}
          </div>
        </Panel>

        <div className="col-span-12 lg:col-span-5 flex flex-col gap-4">
          <Panel title="Notified Personnel">
            <div className="space-y-2">
              {[
                { n: "R. Sharma",  role: "Plant Manager",    state: "ack" },
                { n: "K. Rao",     role: "Safety Officer",   state: "ack" },
                { n: "P. Iyer",    role: "Shift Supervisor", state: "ack" },
                { n: "External EMS", role: "Vizag Fire Dept", state: "enroute" },
                { n: "M. Singh",   role: "Operations Head",  state: "pending" },
              ].map(p => (
                <div key={p.n} className="flex items-center justify-between border border-border bg-surface-2 px-2.5 py-2">
                  <div>
                    <div className="text-[12.5px] font-medium">{p.n}</div>
                    <div className="mono text-[10px] uppercase tracking-wider text-muted-foreground">{p.role}</div>
                  </div>
                  <span className={`mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 border ${
                    p.state === "ack" ? "text-safe border-safe/40 bg-safe/10" :
                    p.state === "enroute" ? "text-warning border-warning/40 bg-warning/10" :
                    "text-muted-foreground border-border"
                  }`}>
                    {p.state}
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Critical Actions">
            <div className="space-y-2">
              <button className="w-full py-2.5 text-[12px] font-semibold uppercase tracking-wider bg-critical text-critical-foreground hover:opacity-90">
                Trigger Full-Plant Evacuation
              </button>
              <button className="w-full py-2.5 text-[12px] uppercase tracking-wider border border-warning/50 bg-warning/10 text-warning hover:bg-warning/20">
                Escalate to District Authority
              </button>
              <button className="w-full py-2.5 text-[12px] uppercase tracking-wider border border-border bg-surface-2 hover:bg-surface-3">
                Download Incident Snapshot (.zip)
              </button>
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
