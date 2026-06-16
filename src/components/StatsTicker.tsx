import { useEffect, useState } from "react";
import { Users, Wallet, ArrowUpFromLine, TrendingUp, Globe2 } from "lucide-react";

const stats = [
  { label: "Total Users", value: 254830, prefix: "", Icon: Users },
  { label: "Total Deposits", value: 84_700_000, prefix: "$", Icon: Wallet },
  { label: "Payouts", value: 62_500_000, prefix: "$", Icon: ArrowUpFromLine },
  { label: "Active Traders", value: 5020, prefix: "", Icon: TrendingUp },
  { label: "Countries", value: 316, prefix: "", Icon: Globe2 },
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
    <section className="border-y border-border bg-card/30 backdrop-blur py-10">
      <div className="container grid grid-cols-2 md:grid-cols-5 gap-6">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="text-center animate-fade-in"
            style={{ animationDelay: `${i * 120}ms`, animationFillMode: "both" }}
          >
            <div className="mx-auto h-12 w-12 rounded-xl bg-gold/10 text-gold flex items-center justify-center mb-3">
              <s.Icon className="h-5 w-5" />
            </div>
            <div className="text-2xl md:text-3xl font-black text-gold tabular-nums">{fmt(vals[i], s.prefix)}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
