import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldAlert, Lock, User2, Siren } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "SentinelAI — Secure Access" }] }),
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [role, setRole] = useState<"officer"|"admin"|"emergency">("officer");
  const submit = (e: React.FormEvent) => { e.preventDefault(); nav({ to: "/" }); };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Industrial visual */}
      <div className="relative hidden lg:block border-r border-border overflow-hidden bg-surface">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background: "radial-gradient(80% 60% at 30% 30%, oklch(0.3 0.05 230 / 0.5), transparent 60%), radial-gradient(60% 60% at 80% 80%, oklch(0.35 0.12 25 / 0.25), transparent 60%)"
          }}
        />
        <div className="absolute inset-0 scanline" />
        <div className="relative h-full flex flex-col justify-between p-10">
          <div className="flex items-center gap-3">
            <div className="size-9 bg-primary/20 border border-primary/60 grid place-items-center">
              <div className="size-3 bg-primary" />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">SentinelAI</div>
              <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Industrial Safety Intelligence Platform</div>
            </div>
          </div>

          <div className="space-y-6 max-w-md">
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-primary">// SECURED TERMINAL</div>
            <h2 className="text-3xl font-semibold leading-tight tracking-tight">
              Predictive safety intelligence for heavy industry.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Unifies IoT gas sensors, SCADA telemetry, permit-to-work systems and worker
              presence into a single compound risk surface. Deployed across 47 facilities
              in steel, refining and power generation.
            </p>
            <div className="grid grid-cols-3 gap-px bg-border">
              {[
                ["facilities", "47"],
                ["sensors", "184k"],
                ["events / day", "2.3M"],
              ].map(([l,v]) => (
                <div key={l} className="bg-surface p-4">
                  <div className="mono text-[10px] uppercase tracking-wider text-muted-foreground">{l}</div>
                  <div className="text-xl font-semibold mono mt-1">{v}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="mono text-[10px] text-muted-foreground">
            © 2026 SentinelAI Systems · ISO 27001 · IEC 61511 · OISD-RP-201 certified
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6">
        <form onSubmit={submit} className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-3 mb-6">
            <div className="size-8 bg-primary/20 border border-primary/60 grid place-items-center">
              <div className="size-2.5 bg-primary" />
            </div>
            <div className="font-semibold tracking-tight">SentinelAI</div>
          </div>
          <div className="mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Access portal</div>
          <h1 className="text-2xl font-semibold mt-1">Authenticate to continue</h1>
          <p className="text-[12.5px] text-muted-foreground mt-2">
            Role-based access. All sessions are logged and audited per OISD-105.
          </p>

          <div className="grid grid-cols-3 gap-px bg-border mt-6">
            {([
              ["officer","Safety Officer", User2],
              ["admin","Administrator", ShieldAlert],
              ["emergency","Emergency", Siren],
            ] as const).map(([k,label,Icon]) => (
              <button
                key={k}
                type="button"
                onClick={() => setRole(k)}
                className={`flex flex-col items-center gap-1.5 py-3 text-[11px] ${
                  role === k ? "bg-surface-2 text-foreground" : "bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={14} className={role === k ? (k === "emergency" ? "text-critical" : "text-primary") : ""} />
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-3 mt-5">
            <Field icon={User2} label="Employee ID" defaultValue="KRAO-0421" />
            <Field icon={Lock} label="Passphrase" type="password" defaultValue="••••••••••" />
            <Field icon={ShieldAlert} label="MFA Token" placeholder="6-digit code" />
          </div>

          <button
            type="submit"
            className={`mt-5 w-full py-2.5 text-[12px] font-semibold uppercase tracking-wider border ${
              role === "emergency"
                ? "bg-critical text-critical-foreground border-critical hover:opacity-90"
                : "bg-primary text-primary-foreground border-primary hover:opacity-90"
            }`}
          >
            {role === "emergency" ? "Engage Emergency Access" : "Authenticate"}
          </button>

          <div className="mt-4 flex items-center justify-between mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Plant: VZA-01</span>
            <Link to="/" className="hover:text-foreground">Skip → Demo</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, ...rest }: any) {
  return (
    <label className="block">
      <div className="mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground mb-1">{label}</div>
      <div className="flex items-center gap-2 border border-border bg-surface-2 px-3 py-2 focus-within:border-primary">
        <Icon size={13} className="text-muted-foreground" />
        <input {...rest} className="bg-transparent text-[13px] outline-none flex-1 placeholder:text-muted-foreground/60" />
      </div>
    </label>
  );
}
