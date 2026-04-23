import { useEffect, useState } from "react";

const stats = [
  { label: "Total Users", value: 254830, prefix: "" },
  { label: "Total Deposits", value: 84_500_000, prefix: "$" },
  { label: "Payouts", value: 62_300_000, prefix: "$" },
  { label: "Active Traders", value: 4820, prefix: "" },
  { label: "Countries", value: 142, prefix: "" },
];

const fmt = (n: number, prefix: string) =>
  prefix + (n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "M" : n >= 1000 ? (n / 1000).toFixed(1) + "K" : n.toLocaleString());

export const StatsTicker = () => {
  const [vals, setVals] = useState(stats.map(s => s.value));
  useEffect(() => {
    const t = setInterval(() => {
      setVals(v => v.map((x, i) => x + Math.floor(Math.random() * (stats[i].value > 1_000_000 ? 5000 : 5))));
    }, 2500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="border-y border-border/40 bg-card/30 backdrop-blur">
      <div className="container py-6 grid grid-cols-2 md:grid-cols-5 gap-6">
        {stats.map((s, i) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl md:text-3xl font-black text-gold tabular-nums">{fmt(vals[i], s.prefix)}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};