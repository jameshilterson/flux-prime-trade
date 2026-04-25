import { useEffect, useState } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

type Coin = { symbol: string; name: string; price: number; change: number };

const SEED: Coin[] = [
  { symbol: "BTC", name: "Bitcoin", price: 107642.0, change: -1.44 },
  { symbol: "ETH", name: "Ethereum", price: 2310.68, change: -3.33 },
  { symbol: "USDT", name: "Tether", price: 1.0, change: 0.01 },
  { symbol: "BNB", name: "BNB", price: 612.42, change: 0.82 },
  { symbol: "SOL", name: "Solana", price: 168.55, change: 2.41 },
  { symbol: "XRP", name: "Ripple", price: 0.524, change: -0.92 },
  { symbol: "ADA", name: "Cardano", price: 0.392, change: 1.12 },
  { symbol: "DOGE", name: "Dogecoin", price: 0.124, change: -2.18 },
  { symbol: "AVAX", name: "Avalanche", price: 27.84, change: 3.04 },
  { symbol: "TRX", name: "TRON", price: 0.118, change: 0.56 },
  { symbol: "LINK", name: "Chainlink", price: 14.62, change: -1.21 },
  { symbol: "MATIC", name: "Polygon", price: 0.582, change: 1.94 },
  { symbol: "LTC", name: "Litecoin", price: 73.22, change: -0.48 },
  { symbol: "DOT", name: "Polkadot", price: 6.18, change: 0.74 },
  { symbol: "SHIB", name: "Shiba Inu", price: 0.0000182, change: 4.21 },
];

const fmtPrice = (p: number) =>
  p < 0.01 ? p.toFixed(7) : p < 1 ? p.toFixed(4) : p.toLocaleString("en-US", { maximumFractionDigits: 2 });

export const LiveCryptoTicker = () => {
  const [coins, setCoins] = useState<Coin[]>(SEED);

  useEffect(() => {
    const t = setInterval(() => {
      setCoins(prev =>
        prev.map(c => {
          const drift = (Math.random() - 0.5) * 0.004;
          const newPrice = Math.max(c.price * (1 + drift), 0.0000001);
          const newChange = c.change + (Math.random() - 0.5) * 0.15;
          return { ...c, price: newPrice, change: parseFloat(newChange.toFixed(2)) };
        })
      );
    }, 2000);
    return () => clearInterval(t);
  }, []);

  const row = [...coins, ...coins];

  return (
    <div className="relative w-full overflow-hidden border-y border-gold/20 bg-midnight">
      <div className="absolute left-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-r from-midnight to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 z-10 w-16 bg-gradient-to-l from-midnight to-transparent pointer-events-none" />
      <div className="flex animate-ticker-scroll whitespace-nowrap py-3">
        {row.map((c, i) => {
          const up = c.change >= 0;
          return (
            <div
              key={`${c.symbol}-${i}`}
              className="flex items-center gap-2 px-5 border-r border-white/5 shrink-0"
            >
              <span className="text-xs font-bold text-gold tracking-wider">{c.symbol}</span>
              <span className="text-sm font-semibold text-white tabular-nums">
                ${fmtPrice(c.price)}
              </span>
              <span
                className={`flex items-center gap-1 text-xs font-medium tabular-nums ${
                  up ? "text-success" : "text-destructive"
                }`}
              >
                {up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {up ? "+" : ""}
                {c.change.toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};