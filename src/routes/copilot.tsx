import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { AppShell, Panel } from "@/components/layout/AppShell";
import { INCIDENTS_HISTORICAL } from "@/lib/mock-data";
import { Send, BookOpen, FileText, Database } from "lucide-react";

export const Route = createFileRoute("/copilot")({
  head: () => ({ meta: [{ title: "Incident Pattern Copilot — SentinelAI" }] }),
  component: Copilot,
});

type Msg = { role: "user" | "assistant"; content: string; citations?: { src: string; ref: string }[] };

const SEED: Msg[] = [
  {
    role: "assistant",
    content:
      "Connected to incident pattern index. 12,847 historical records across 47 facilities indexed. Ask about a zone, anomaly, or recommended intervention.",
  },
];

const SUGGEST = [
  "Why is Zone B (Boiler Zone) critical right now?",
  "Has a similar gas + hot work incident happened before?",
  "What is the recommended action for the current state?",
  "Which OISD clauses apply to this scenario?",
];

const RESP: Record<string, Msg> = {
  default: {
    role: "assistant",
    content:
      "Boiler Zone (Z-01) currently registers a compound risk of 92 (CRITICAL). Three concurrent factors drive this:\n\n• Gas Agent reports H₂S at 87 ppm — 74% above OSHA STEL.\n• Permit Agent shows active Hot Work PTW-4471 overlapping the gas anomaly window.\n• SCADA Agent detected an 18.2 bar pressure transient on Boiler-3 (+22% in 90 s).\n\nThe synergy rule G-HW-04 (Gas Anomaly × Hot Work) escalates risk to mass-casualty class. Recommend immediate suspension of PTW-4471, evacuation of the 30 m exclusion radius (7 workers currently inside), and root-cause inspection of Boiler-3 relief valve KV-301.",
    citations: [
      { src: "Incident DB", ref: "VZA-2023-08-14 · H₂S + Hot Work (similarity 0.91)" },
      { src: "Regulation",  ref: "OISD-RP-105 §6.3 — Permit conflict resolution" },
      { src: "SOP",         ref: "VZA-SOP-014 — Boiler exclusion protocol" },
    ],
  },
};

function Copilot() {
  const [messages, setMessages] = useState<Msg[]>(SEED);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { role: "user", content: text }]);
    setInput("");
    setBusy(true);
    setTimeout(() => {
      setMessages(m => [...m, RESP.default]);
      setBusy(false);
    }, 700);
  };

  return (
    <AppShell title="Incident Pattern Copilot" subtitle="Retrieval-augmented assistant grounded in incident history, SOPs, and regulatory corpora">
      <div className="grid grid-cols-12 gap-4 h-[calc(100vh-160px)]">
        <Panel title="Conversation" className="col-span-12 lg:col-span-8 flex flex-col" action={<span className="mono text-[10px] text-muted-foreground">RAG · GROUNDED · AUDITED</span>}>
          <div className="flex-1 overflow-y-auto -m-4 p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className={`mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 shrink-0 self-start mt-1 border ${
                  m.role === "user" ? "border-info/50 text-info bg-info/10" : "border-primary/50 text-primary bg-primary/10"
                }`}>
                  {m.role === "user" ? "OFFICER" : "COPILOT"}
                </div>
                <div className={`max-w-[80%] border bg-surface-2 px-3 py-2.5 text-[13px] whitespace-pre-wrap leading-relaxed ${
                  m.role === "user" ? "border-info/30" : "border-border"
                }`}>
                  {m.content}
                  {m.citations && (
                    <div className="mt-3 pt-3 border-t border-border space-y-1">
                      <div className="mono text-[9.5px] uppercase tracking-wider text-muted-foreground">Citations</div>
                      {m.citations.map((c, j) => (
                        <div key={j} className="flex items-start gap-2 text-[11.5px]">
                          <span className="mono text-[9px] uppercase tracking-wider border border-border px-1 py-0.5 text-muted-foreground shrink-0">{c.src}</span>
                          <span className="text-muted-foreground">{c.ref}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {busy && (
              <div className="flex gap-3">
                <div className="mono text-[9px] uppercase tracking-wider px-1.5 py-0.5 border border-primary/50 text-primary bg-primary/10">COPILOT</div>
                <div className="border border-border bg-surface-2 px-3 py-2 text-[12px] text-muted-foreground mono">retrieving · synthesizing…</div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border -mx-4 px-4 pt-3 mt-3">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {SUGGEST.map(s => (
                <button key={s} onClick={() => send(s)} className="mono text-[10.5px] border border-border bg-surface-2 hover:bg-surface-3 px-2 py-1 text-muted-foreground hover:text-foreground">
                  {s}
                </button>
              ))}
            </div>
            <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex items-center gap-2 border border-border bg-surface-2 px-3 py-2 focus-within:border-primary">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Query the safety knowledge base…"
                className="flex-1 bg-transparent text-[13px] outline-none placeholder:text-muted-foreground/60"
              />
              <button type="submit" className="size-6 grid place-items-center bg-primary text-primary-foreground"><Send size={12} /></button>
            </form>
          </div>
        </Panel>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-4 min-h-0">
          <Panel title="Similar Historical Incidents">
            <div className="space-y-2">
              {INCIDENTS_HISTORICAL.map(i => (
                <div key={i.date} className="border border-border bg-surface-2 p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="mono text-[10.5px] text-muted-foreground">{i.date} · {i.plant}</span>
                    <span className="mono text-[11px] text-warning">{(i.similarity * 100).toFixed(0)}%</span>
                  </div>
                  <div className="text-[12.5px] mt-0.5">{i.type}</div>
                  <div className="mono text-[10.5px] text-critical mt-1">Casualties: {i.casualties}</div>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Knowledge Sources" className="flex-1">
            <div className="space-y-2 text-[12px]">
              {[
                { i: Database, l: "Incident DB", d: "12,847 records · indexed 14:00 UTC" },
                { i: BookOpen, l: "OISD Standards", d: "RP-105 / 116 / 118 / 144" },
                { i: BookOpen, l: "DGMS Circulars", d: "2017–2026 · 218 documents" },
                { i: FileText, l: "Plant SOPs",     d: "VZA-01 · 412 procedures" },
              ].map(s => (
                <div key={s.l} className="flex items-center gap-3 border border-border bg-surface-2 px-2.5 py-2">
                  <s.i size={14} className="text-primary" />
                  <div className="flex-1">
                    <div className="font-medium">{s.l}</div>
                    <div className="mono text-[10.5px] text-muted-foreground">{s.d}</div>
                  </div>
                  <span className="status-dot bg-safe" />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
