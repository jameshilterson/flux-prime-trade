import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const RATES: Record<string, number> = {
  BTC: 67500, ETH: 3450, USDT: 1, USDC: 1, BNB: 590, SOL: 165, XRP: 0.58, USD: 1, EUR: 1.08, GBP: 1.27,
};

export const CryptoConverter = () => {
  const [amount, setAmount] = useState("1");
  const [from, setFrom] = useState("BTC");
  const [to, setTo] = useState("USD");

  const convert = () => {
    const a = parseFloat(amount) || 0;
    return ((a * RATES[from]) / RATES[to]).toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  const swap = () => { setFrom(to); setTo(from); };

  return (
    <Card className="p-6 border-gold/20 bg-card/80 backdrop-blur shadow-elegant">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-gold animate-pulse" /> Live Crypto Converter
      </h3>
      <div className="space-y-3">
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <Input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="text-lg font-semibold" />
          <select value={from} onChange={e => setFrom(e.target.value)} className="rounded-md border border-input bg-background px-3 text-sm font-semibold">
            {Object.keys(RATES).map(k => <option key={k}>{k}</option>)}
          </select>
        </div>
        <Button variant="ghost" size="sm" onClick={swap} className="w-full text-gold"><ArrowDownUp className="h-4 w-4" /></Button>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <div className="rounded-md border border-input bg-muted/50 px-3 py-2 text-lg font-bold tabular-nums truncate">{convert()}</div>
          <select value={to} onChange={e => setTo(e.target.value)} className="rounded-md border border-input bg-background px-3 text-sm font-semibold">
            {Object.keys(RATES).map(k => <option key={k}>{k}</option>)}
          </select>
        </div>
      </div>
    </Card>
  );
};