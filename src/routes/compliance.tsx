import { createFileRoute } from "@tanstack/react-router";
import { AppShell, Panel } from "@/components/layout/AppShell";
import { COMPLIANCE } from "@/lib/mock-data";
import { Download, FileText } from "lucide-react";

export const Route = createFileRoute("/compliance")({
  head: () => ({ meta: [{ title: "Compliance & Audit — SentinelAI" }] }),
  component: Compliance,
});

function Compliance() {
  const avg = Math.round(COMPLIANCE.reduce((s, c) => s + c.score, 0) / COMPLIANCE.length);
  const tone = avg >= 85 ? "safe" : avg >= 70 ? "warning" : "critical";

  return (
    <AppShell title="Compliance & Audit" subtitle="Regulatory posture across OISD · DGMS · Factory Act · last consolidated 2026-06-22">
      <div className="grid grid-cols-12 gap-4">
        <Panel title="Overall Compliance Posture" className="col-span-12 lg:col-span-4">
          <div className="flex items-baseline gap-3">
            <div className={`mono text-[52px] font-semibold leading-none ${tone === "safe" ? "text-safe" : tone === "warning" ? "text-warning" : "text-critical"}`}>{avg}</div>
            <div>
              <div className="mono text-[10px] uppercase tracking-wider text-muted-foreground">aggregate score</div>
              <div className={`mono text-[11px] font-semibold uppercase tracking-wider ${tone === "safe" ? "text-safe" : tone === "warning" ? "text-warning" : "text-critical"}`}>
                {tone === "safe" ? "WITHIN TOLERANCE" : tone === "warning" ? "REVIEW REQUIRED" : "NON-COMPLIANT"}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px bg-border mt-4">
            <Mini label="Compliant"      value={String(COMPLIANCE.filter(c => c.status === "compliant").length)}     tone="safe" />
            <Mini label="Under review"   value={String(COMPLIANCE.filter(c => c.status === "review").length)}        tone="warning" />
            <Mini label="Non-compliant"  value={String(COMPLIANCE.filter(c => c.status === "non-compliant").length)} tone="critical" />
          </div>
          <div className="mt-4 space-y-2 text-[12px]">
            <Row k="Missing inspections"    v="3"  tone="warning" />
            <Row k="Open audit findings"    v="7"  tone="warning" />
            <Row k="Safety violations (30d)" v="2" tone="critical" />
            <Row k="Next scheduled audit"   v="2026-07-14" />
          </div>
        </Panel>

        <Panel title="Regulatory Register" className="col-span-12 lg:col-span-8" action={
          <button className="mono text-[10px] uppercase tracking-wider flex items-center gap-1.5 border border-border bg-surface-2 hover:bg-surface-3 px-2 py-1">
            <Download size={11} /> Export Audit (.PDF)
          </button>
        }>
          <div className="-m-4">
            <table className="w-full text-[12px]">
              <thead className="bg-surface-2 border-b border-border">
                <tr className="mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {["Code","Title","Status","Last Audit","Score",""].map(h => (
                    <th key={h} className="text-left font-medium px-3 py-2">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPLIANCE.map(c => (
                  <tr key={c.code} className="border-b border-border hover:bg-surface-2">
                    <td className="px-3 py-2.5 mono">{c.code}</td>
                    <td className="px-3 py-2.5">{c.title}</td>
                    <td className="px-3 py-2.5">
                      <span className={`mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 border ${
                        c.status === "compliant" ? "text-safe border-safe/40 bg-safe/10" :
                        c.status === "review" ? "text-warning border-warning/40 bg-warning/10" :
                        "text-critical border-critical/40 bg-critical/10"
                      }`}>{c.status}</span>
                    </td>
                    <td className="px-3 py-2.5 mono text-muted-foreground">{c.last}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-surface-3">
                          <div className={`h-full ${c.score >= 85 ? "bg-safe" : c.score >= 70 ? "bg-warning" : "bg-critical"}`} style={{ width: `${c.score}%` }} />
                        </div>
                        <span className="mono font-semibold">{c.score}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <button className="mono text-[10px] uppercase tracking-wider border border-border bg-surface-2 hover:bg-surface-3 px-2 py-1 flex items-center gap-1">
                        <FileText size={10} /> Report
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}

function Mini({ label, value, tone }: { label: string; value: string; tone: "safe"|"warning"|"critical" }) {
  const c = tone === "safe" ? "text-safe" : tone === "warning" ? "text-warning" : "text-critical";
  return (
    <div className="bg-surface p-2.5">
      <div className="mono text-[9.5px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mono text-[18px] font-semibold mt-0.5 ${c}`}>{value}</div>
    </div>
  );
}
function Row({ k, v, tone }: { k: string; v: string; tone?: "warning"|"critical" }) {
  const c = tone === "critical" ? "text-critical" : tone === "warning" ? "text-warning" : "text-foreground";
  return (
    <div className="flex items-center justify-between border-b border-border pb-1.5">
      <span className="text-muted-foreground">{k}</span>
      <span className={`mono font-semibold ${c}`}>{v}</span>
    </div>
  );
}
