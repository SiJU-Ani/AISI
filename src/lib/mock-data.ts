export const PLANTS = [
  { id: "vza-01", name: "Vizag Steel Works — Unit 1" },
  { id: "kch-03", name: "Kochi Refinery — Block 3" },
  { id: "ngp-pp", name: "Nagpur Power Plant" },
];

export const ZONES = [
  { id: "Z-01", name: "Boiler Zone",      risk: 92, status: "critical", workers: 7,  permits: 3, gas: 87, temp: 412, pressure: 18.2 },
  { id: "Z-02", name: "Gas Storage",      risk: 78, status: "warning",  workers: 2,  permits: 1, gas: 64, temp: 38,  pressure: 22.1 },
  { id: "Z-03", name: "Furnace Area",     risk: 71, status: "warning",  workers: 5,  permits: 2, gas: 22, temp: 980, pressure: 11.4 },
  { id: "Z-04", name: "Control Room",     risk: 12, status: "safe",     workers: 4,  permits: 0, gas: 2,  temp: 24,  pressure: 1.01 },
  { id: "Z-05", name: "Maintenance Bay",  risk: 34, status: "safe",     workers: 9,  permits: 4, gas: 8,  temp: 31,  pressure: 1.02 },
  { id: "Z-06", name: "Cooling Tower B",  risk: 48, status: "warning",  workers: 3,  permits: 1, gas: 14, temp: 62,  pressure: 4.8  },
  { id: "Z-07", name: "Pipe Rack North",  risk: 25, status: "safe",     workers: 1,  permits: 1, gas: 6,  temp: 44,  pressure: 9.2  },
  { id: "Z-08", name: "Loading Bay",      risk: 19, status: "safe",     workers: 6,  permits: 2, gas: 4,  temp: 29,  pressure: 1.01 },
] as const;

export const AGENTS = [
  { id: "gas",     name: "Gas Agent",            score: 87, status: "critical", anomaly: true,  detail: "H₂S levels exceeded 50 ppm in Boiler Zone" },
  { id: "permit",  name: "Permit Agent",         score: 74, status: "warning",  anomaly: true,  detail: "Hot work permit overlaps gas anomaly window" },
  { id: "worker",  name: "Worker Presence Agent",score: 68, status: "warning",  anomaly: true,  detail: "7 workers inside critical zone perimeter" },
  { id: "scada",   name: "SCADA Agent",          score: 81, status: "critical", anomaly: true,  detail: "Boiler-3 pressure transient +18% in 90s" },
  { id: "thermal", name: "Thermal Context Agent",score: 42, status: "warning",  anomaly: false, detail: "Thermal gradient stable, IR baseline normal" },
] as const;

export const ALERTS = [
  { t: "14:07:22", sev: "critical", zone: "Z-01", msg: "Compound risk score crossed CRITICAL threshold (92)" },
  { t: "14:06:48", sev: "critical", zone: "Z-01", msg: "SCADA: Pressure spike on Boiler-3 — 18.2 bar (+22%)" },
  { t: "14:05:11", sev: "warning",  zone: "Z-02", msg: "H₂S concentration trending upward — 64 ppm" },
  { t: "14:04:02", sev: "warning",  zone: "Z-01", msg: "Permit conflict: Hot Work PTW-4471 active in flammable atmosphere" },
  { t: "14:02:39", sev: "critical", zone: "Z-01", msg: "Gas anomaly detected — H₂S 87 ppm" },
  { t: "13:58:14", sev: "info",     zone: "Z-04", msg: "Shift handover acknowledged by safety officer K. Rao" },
  { t: "13:51:02", sev: "warning",  zone: "Z-06", msg: "Cooling tower B vibration outside nominal band" },
  { t: "13:44:55", sev: "info",     zone: "Z-05", msg: "PTW-4470 issued — vessel entry, 4 workers" },
  { t: "13:38:21", sev: "safe",     zone: "Z-08", msg: "Loading bay inspection completed — no findings" },
] as const;

export const RISK_TREND = [
  { t: "13:30", score: 48 }, { t: "13:35", score: 52 }, { t: "13:40", score: 55 },
  { t: "13:45", score: 61 }, { t: "13:50", score: 64 }, { t: "13:55", score: 70 },
  { t: "14:00", score: 78 }, { t: "14:05", score: 86 }, { t: "14:07", score: 92 },
];

export const RISK_BREAKDOWN = [
  { factor: "Gas",     value: 28, color: "var(--color-chart-1)" },
  { factor: "SCADA",   value: 22, color: "var(--color-chart-2)" },
  { factor: "Permit",  value: 18, color: "var(--color-chart-4)" },
  { factor: "Worker",  value: 14, color: "var(--color-chart-5)" },
  { factor: "Thermal", value: 6,  color: "var(--color-chart-3)" },
  { factor: "Synergy", value: 4,  color: "oklch(0.5 0.15 320)" },
];

export const PERMITS = [
  { id: "PTW-4471", type: "Hot Work",          zone: "Z-01", workers: 4, start: "13:30", end: "16:30", conflict: "critical", note: "Overlap with H₂S anomaly window" },
  { id: "PTW-4470", type: "Vessel Entry",      zone: "Z-05", workers: 4, start: "13:00", end: "17:00", conflict: "safe",     note: "Atmosphere tested OK" },
  { id: "PTW-4469", type: "Working at Height", zone: "Z-03", workers: 2, start: "12:45", end: "15:45", conflict: "warning",  note: "Adjacent to high-temp surface" },
  { id: "PTW-4468", type: "Excavation",        zone: "Z-07", workers: 1, start: "11:00", end: "18:00", conflict: "safe",     note: "Cleared by ground survey" },
  { id: "PTW-4467", type: "Electrical Isolation", zone: "Z-02", workers: 2, start: "12:00", end: "14:30", conflict: "warning", note: "Near gas storage" },
  { id: "PTW-4466", type: "Hot Work",          zone: "Z-06", workers: 3, start: "10:30", end: "16:00", conflict: "warning",  note: "Vibration trending up" },
];

export const COMPLIANCE = [
  { code: "OISD-116",     title: "Fire protection — process plants",  status: "compliant",     last: "2026-05-12", score: 96 },
  { code: "OISD-118",     title: "Layouts for O&G installations",     status: "compliant",     last: "2026-04-22", score: 92 },
  { code: "OISD-144",     title: "LOPA & SIL assessment",             status: "review",        last: "2026-02-08", score: 71 },
  { code: "DGMS-2017/3",  title: "Mines gas monitoring procedure",    status: "non-compliant", last: "2025-11-30", score: 54 },
  { code: "Factory-87A",  title: "Hazardous process — disclosure",    status: "compliant",     last: "2026-06-01", score: 88 },
  { code: "OISD-105",     title: "Work permit system",                status: "review",        last: "2026-03-15", score: 76 },
  { code: "Factory-41B",  title: "Safety committee functioning",      status: "compliant",     last: "2026-05-29", score: 91 },
];

export const INCIDENTS_HISTORICAL = [
  { date: "2023-08-14", plant: "Vizag",  type: "Gas leak + hot work", casualties: 2, similarity: 0.91 },
  { date: "2022-11-02", plant: "Bhilai", type: "Boiler pressure transient", casualties: 0, similarity: 0.78 },
  { date: "2021-05-20", plant: "Kochi",  type: "H₂S exposure",         casualties: 1, similarity: 0.74 },
];
