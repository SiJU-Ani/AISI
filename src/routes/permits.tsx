import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Panel, StatusDot } from "@/components/layout/AppShell";
import { PERMITS } from "@/lib/mock-data";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/permits")({
  head: () => ({ meta: [{ title: "Permit Intelligence — SentinelAI" }] }),
  component: Permits,
});

function Permits() {
  const conflicts = PERMITS.filter(p => p.conflict !== "safe");
  return (
    <AppShell title="Digital Permit Intelligence" subtitle="AI-monitored permit-to-work register with overlap and contextual hazard detection">
      <div className="grid grid-cols-12 gap-4">
        <Panel title="Active Conflicts" className="col-span-12 lg:col-span-4">
          <div className="space-y-2">
            {conflicts.map(p => (
              <div key={p.id} className={`border ${p.conflict === "critical" ? "border-critical/50 bg-critical/5" : "border-warning/40 bg-warning/5"} p-2.5`}>
                <div className="flex items-center justify-between">
                  <span className="mono text-[10px] text-muted-foreground">{p.id}</span>
                  <span className={`mono text-[10px] uppercase tracking-wider ${p.conflict === "critical" ? "text-critical" : "text-warning"}`}>
                    {p.conflict}
                  </span>
                </div>
                <div className="text-[12.5px] font-medium mt-0.5">{p.type} · {p.zone}</div>
                <div className="text-[11.5px] text-muted-foreground mt-1 flex items-start gap-1.5">
                  <AlertTriangle size={11} className={`mt-0.5 shrink-0 ${p.conflict === "critical" ? "text-critical" : "text-warning"}`} />
                  {p.note}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Permit Register" className="col-span-12 lg:col-span-8" action={<span className="mono text-[10px] text-muted-foreground">{PERMITS.length} ACTIVE</span>}>
          <div className="-m-4">
            <table className="w-full text-[12px]">
              <thead className="bg-surface-2 border-b border-border">
                <tr className="mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {["Permit ID","Type","Zone","Workers","Window","Risk","Notes"].map(h => (
                    <th key={h} className="text-left font-medium px-3 py-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PERMITS.map(p => (
                  <tr key={p.id} className="border-b border-border hover:bg-surface-2">
                    <td className="px-3 py-2.5 mono">{p.id}</td>
                    <td className="px-3 py-2.5">{p.type}</td>
                    <td className="px-3 py-2.5 mono text-muted-foreground">{p.zone}</td>
                    <td className="px-3 py-2.5 mono">{p.workers}</td>
                    <td className="px-3 py-2.5 mono text-muted-foreground">{p.start} – {p.end}</td>
                    <td className="px-3 py-2.5">
                      <span className="inline-flex items-center gap-1.5">
                        <StatusDot tone={p.conflict as any} />
                        <span className={`mono text-[11px] uppercase ${p.conflict === "critical" ? "text-critical" : p.conflict === "warning" ? "text-warning" : "text-safe"}`}>
                          {p.conflict}
                        </span>
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-muted-foreground truncate max-w-[260px]">{p.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Permit Timeline · Today" className="col-span-12">
          <div className="relative border border-border bg-surface-2 p-3 overflow-x-auto">
            <div className="flex justify-between mono text-[10px] text-muted-foreground mb-2 min-w-[700px]">
              {["08","10","12","14","16","18","20"].map(h => <span key={h}>{h}:00</span>)}
            </div>
            <div className="space-y-2 min-w-[700px]">
              {PERMITS.map(p => {
                const s = parseInt(p.start.split(":")[0]) + parseInt(p.start.split(":")[1])/60;
                const e = parseInt(p.end.split(":")[0]) + parseInt(p.end.split(":")[1])/60;
                const left = ((s - 8) / 12) * 100;
                const width = ((e - s) / 12) * 100;
                const c = p.conflict === "critical" ? "bg-critical/30 border-critical" : p.conflict === "warning" ? "bg-warning/25 border-warning" : "bg-safe/20 border-safe";
                return (
                  <div key={p.id} className="relative h-7">
                    <div className="absolute inset-y-0 left-0 mono text-[10px] text-muted-foreground w-24">{p.id} · {p.zone}</div>
                    <div className="absolute inset-y-0 left-24 right-0 bg-surface border border-border">
                      <div className={`absolute inset-y-0 border-l-2 ${c} px-2 flex items-center mono text-[10px] text-foreground`} style={{ left: `${left}%`, width: `${width}%` }}>
                        {p.type}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}
