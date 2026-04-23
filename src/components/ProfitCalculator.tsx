import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { PLANS } from "@/lib/constants";

export const ProfitCalculator = () => {
  const [amount, setAmount] = useState(5000);
  const [planIdx, setPlanIdx] = useState(1);
  const plan = PLANS[planIdx];

  const result = useMemo(() => {
    const daily = amount * (plan.roi / 100);
    const total = daily * plan.duration;
    return { daily, total, final: amount + total };
  }, [amount, plan]);

  return (
    <Card className="p-6 md:p-8 border-gold/20 bg-card shadow-elegant">
      <h3 className="text-2xl font-bold mb-1">Profit Calculator</h3>
      <p className="text-sm text-muted-foreground mb-6">See your projected earnings instantly</p>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium flex justify-between mb-2">
            <span>Investment Amount</span>
            <span className="text-gold font-bold">${amount.toLocaleString()}</span>
          </label>
          <Input type="number" value={amount} onChange={e => setAmount(Math.max(plan.min, +e.target.value || 0))} />
          <Slider min={plan.min} max={50000} step={100} value={[amount]} onValueChange={(v) => setAmount(v[0])} className="mt-3" />
        </div>

        <div className="grid grid-cols-3 gap-2">
          {PLANS.map((p, i) => (
            <button
              key={p.name}
              onClick={() => { setPlanIdx(i); setAmount(Math.max(amount, p.min)); }}
              className={`rounded-lg border-2 p-3 text-sm font-semibold transition ${
                planIdx === i ? "border-gold bg-gold/10 text-gold" : "border-border hover:border-gold/40"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
          <Stat label="Daily Profit" value={`$${result.daily.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
          <Stat label="Total Profit" value={`$${result.total.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} />
          <Stat label="Final Amount" value={`$${result.final.toLocaleString(undefined, { maximumFractionDigits: 2 })}`} highlight />
        </div>
      </div>
    </Card>
  );
};

const Stat = ({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) => (
  <div className="text-center">
    <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
    <div className={`mt-1 font-bold tabular-nums ${highlight ? "text-gold text-lg" : "text-foreground"}`}>{value}</div>
  </div>
);