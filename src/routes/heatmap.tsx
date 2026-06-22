import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell, Panel, StatusDot } from "@/components/layout/AppShell";
import { ZONES } from "@/lib/mock-data";
import { Users, Flame, FileCheck2, Wind } from "lucide-react";

export const Route = createFileRoute("/heatmap")({
  head: () => ({ meta: [{ title: "Geospatial Heatmap — SentinelAI" }] }),
  component: Heatmap,
});

// Plant layout: x, y, w, h in percent of viewBox
const LAYOUT: Record<string, { x: number; y: number; w: number; h: number }> = {
  "Z-01": { x: 6,  y: 8,  w: 28, h: 30 },
  "Z-02": { x: 36, y: 8,  w: 18, h: 22 },
  "Z-03": { x: 56, y: 8,  w: 38, h: 30 },
  "Z-04": { x: 36, y: 32, w: 18, h: 18 },
  "Z-05": { x: 6,  y: 40, w: 28, h: 22 },
  "Z-06": { x: 56, y: 40, w: 18, h: 22 },
  "Z-07": { x: 76, y: 40, w: 18, h: 22 },
  "Z-08": { x: 6,  y: 64, w: 88, h: 28 },
};

function tone(s: string) {
  return s === "critical" ? "var(--color-critical)" : s === "warning" ? "var(--color-warning)" : "var(--color-safe)";
}

function Heatmap() {
  const [sel, setSel] = useState<typeof ZONES[number] | null>(ZONES[0]);
  const [layer, setLayer] = useState({ workers: true, permits: true, gas: true, thermal: false });

  return (
    <AppShell title="Geospatial Safety Heatmap" subtitle="Plant layout · live overlay of risk, presence, permits, and anomaly fields">
      <div className="grid grid-cols-12 gap-4">
        <Panel title="Vizag Steel Works · Unit 1 — Plant Layout" className="col-span-12 lg:col-span-9" action={
          <div className="flex gap-1">
            {Object.entries(layer).map(([k,v]) => (
              <button key={k} onClick={() => setLayer(l => ({ ...l, [k]: !v }))}
                className={`mono text-[10px] uppercase tracking-wider px-2 py-0.5 border ${v ? "bg-primary/10 border-primary/50 text-primary" : "bg-surface-2 border-border text-muted-foreground"}`}>
                {k}
              </button>
            ))}
          </div>
        }>
          <div className="relative bg-background border border-border" style={{ aspectRatio: "16 / 10" }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
              <defs>
                <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse">
                  <path d="M 5 0 L 0 0 0 5" fill="none" stroke="var(--color-border)" strokeWidth="0.1" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
              {ZONES.map(z => {
                const L = LAYOUT[z.id];
                const c = tone(z.status);
                const isSel = sel?.id === z.id;
                return (
                  <g key={z.id} onMouseEnter={() => setSel(z)} className="cursor-pointer">
                    <rect x={L.x} y={L.y} width={L.w} height={L.h} fill={c} fillOpacity={z.status === "critical" ? 0.28 : z.status === "warning" ? 0.16 : 0.08}
                      stroke={c} strokeWidth={isSel ? 0.5 : 0.2} strokeOpacity={isSel ? 1 : 0.5} />
                    {z.status === "critical" && (
                      <rect x={L.x} y={L.y} width={L.w} height={L.h} fill="none" stroke={c} strokeWidth="0.3" strokeDasharray="1 0.6" className="animate-pulse" />
                    )}
                    <text x={L.x + 1} y={L.y + 3} fontSize="1.6" fill="var(--color-muted-foreground)" fontFamily="monospace">{z.id}</text>
                    <text x={L.x + 1} y={L.y + 6} fontSize="2.2" fill="var(--color-foreground)" fontWeight="600">{z.name}</text>
                    <text x={L.x + L.w - 1} y={L.y + L.h - 1.5} fontSize="3.5" fill={c} fontFamily="monospace" fontWeight="700" textAnchor="end">{z.risk}</text>

                    {layer.workers && Array.from({ length: Math.min(z.workers, 6) }).map((_,i) => (
                      <circle key={i} cx={L.x + 2 + i * 1.8} cy={L.y + L.h - 4} r="0.6" fill="var(--color-info)" />
                    ))}
                    {layer.permits && z.permits > 0 && (
                      <rect x={L.x + L.w - 4} y={L.y + 2} width="2.5" height="1.4" fill="var(--color-warning)" opacity="0.8" />
                    )}
                    {layer.gas && z.gas > 30 && (
                      <circle cx={L.x + L.w / 2} cy={L.y + L.h / 2} r={Math.min(z.gas / 12, 8)} fill={c} fillOpacity="0.15" stroke={c} strokeOpacity="0.4" strokeWidth="0.15" strokeDasharray="0.6 0.4" />
                    )}
                  </g>
                );
              })}
            </svg>
            <div className="absolute bottom-2 left-2 mono text-[9px] text-muted-foreground tracking-wider uppercase border border-border bg-surface/80 px-2 py-1">
              N ↑ · Scale 1:2000 · Lat 17.6868 Lng 83.2185
            </div>
            <div className="absolute bottom-2 right-2 flex items-center gap-3 mono text-[9px] uppercase tracking-wider text-muted-foreground border border-border bg-surface/80 px-2 py-1">
              <span className="flex items-center gap-1"><span className="size-2 bg-safe inline-block" />Safe</span>
              <span className="flex items-center gap-1"><span className="size-2 bg-warning inline-block" />Warning</span>
              <span className="flex items-center gap-1"><span className="size-2 bg-critical inline-block" />Critical</span>
            </div>
          </div>
        </Panel>

        <Panel title="Zone Intelligence" className="col-span-12 lg:col-span-3">
          {sel && (
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between">
                  <span className="mono text-[10px] text-muted-foreground">{sel.id}</span>
                  <StatusDot tone={sel.status as any} />
                </div>
                <div className="text-[15px] font-semibold mt-0.5">{sel.name}</div>
                <div className={`mono text-[28px] font-semibold mt-1 ${sel.status === "critical" ? "text-critical" : sel.status === "warning" ? "text-warning" : "text-safe"}`}>
                  {sel.risk}<span className="text-[11px] text-muted-foreground ml-1">/ 100</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-px bg-border">
                <KV icon={Users}      label="Workers"    value={String(sel.workers)} />
                <KV icon={FileCheck2} label="Permits"    value={String(sel.permits)} />
                <KV icon={Wind}       label="H₂S ppm"    value={String(sel.gas)} tone={sel.gas > 50 ? "critical" : sel.gas > 20 ? "warning" : "safe"} />
                <KV icon={Flame}      label="Temp °C"    value={String(sel.temp)} tone={sel.temp > 400 ? "critical" : sel.temp > 60 ? "warning" : "safe"} />
              </div>
              <div className="border-t border-border pt-3">
                <div className="mono text-[10px] uppercase tracking-wider text-muted-foreground">Pressure</div>
                <div className="mono text-[14px] font-semibold mt-0.5">{sel.pressure} bar</div>
              </div>
              <button className="w-full py-2 text-[11px] uppercase tracking-wider font-medium border border-critical/50 bg-critical/10 text-critical hover:bg-critical hover:text-critical-foreground">
                Initiate Zone Lockdown
              </button>
            </div>
          )}
        </Panel>
      </div>
    </AppShell>
  );
}

function KV({ icon: Icon, label, value, tone }: any) {
  const c = tone === "critical" ? "text-critical" : tone === "warning" ? "text-warning" : "text-foreground";
  return (
    <div className="bg-surface p-2.5">
      <div className="flex items-center gap-1.5 mono text-[9.5px] uppercase tracking-wider text-muted-foreground">
        <Icon size={11} /> {label}
      </div>
      <div className={`mono text-[14px] font-semibold mt-1 ${c}`}>{value}</div>
    </div>
  );
}
