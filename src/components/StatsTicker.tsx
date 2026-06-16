import { useEffect, useRef, useState } from "react";
import { Users, Repeat, DollarSign, LineChart } from "lucide-react";

const stats = [
  { label: "Total Users", value: 255_000, fmt: (n: number) => `${Math.round(n / 1000)}K`, Icon: Users },
  { label: "Daily Transactions", value: 1_397, fmt: (n: number) => n.toLocaleString(), Icon: Repeat },
  { label: "Payouts", value: 62_500_000, fmt: (n: number) => `$${(n / 1_000_000).toFixed(1)}M`, Icon: DollarSign },
  { label: "Active Traders", value: 59, fmt: (n: number) => n.toString(), Icon: LineChart },
];

export const StatsTicker = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setVisible(true),
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="border-y border-border bg-card/30 py-14">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`text-center ${visible ? "animate-slide-up-fade" : "opacity-0"}`}
            style={{ animationDelay: `${i * 140}ms`, animationFillMode: "both" }}
          >
            <div className="mx-auto h-14 w-14 rounded-2xl bg-primary/15 text-primary flex items-center justify-center mb-4">
              <s.Icon className="h-6 w-6" />
            </div>
            <div className="text-3xl md:text-4xl font-black text-primary tabular-nums">{s.fmt(s.value)}</div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mt-2">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
