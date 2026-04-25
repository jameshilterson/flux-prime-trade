import { Button } from "@/components/ui/button";
import { ArrowRight, Bitcoin, TrendingUp, Wallet, Sparkles, CircleDollarSign, LineChart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FLOATING = [
  { icon: Bitcoin, label: "BTC", price: "$107,642", trend: "+2.41%", pos: "top-[8%] left-[6%]", rot: "-rotate-6", delay: "0s" },
  { icon: CircleDollarSign, label: "ETH", price: "$3,210", trend: "+1.88%", pos: "top-[18%] right-[8%]", rot: "rotate-6", delay: "1.2s" },
  { icon: LineChart, label: "AI Vault", price: "+34.7% APY", trend: "live", pos: "bottom-[14%] left-[10%]", rot: "rotate-3", delay: "2.4s" },
  { icon: Wallet, label: "Copy Pro", price: "$8,402", trend: "+5.12%", pos: "bottom-[10%] right-[6%]", rot: "-rotate-3", delay: "0.6s" },
];

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-hero-gradient min-h-[92vh] flex items-center">
      {/* Ambient glows */}
      <div className="absolute -top-32 -left-32 h-[28rem] w-[28rem] rounded-full bg-gold/20 blur-[120px] animate-glow-pulse" />
      <div className="absolute -bottom-40 -right-40 h-[32rem] w-[32rem] rounded-full bg-primary/40 blur-[140px] animate-glow-pulse" style={{ animationDelay: "2s" }} />
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />

      {/* Floating crypto cards (hidden on small screens) */}
      {FLOATING.map((c, i) => (
        <div
          key={c.label}
          className={`hidden lg:flex absolute ${c.pos} ${c.rot} animate-float-card items-center gap-3 rounded-2xl border border-gold/20 bg-card/60 backdrop-blur-xl px-4 py-3 shadow-elegant`}
          style={{ animationDelay: c.delay }}
        >
          <div className="h-10 w-10 rounded-xl bg-gold-gradient text-midnight flex items-center justify-center shadow-gold">
            <c.icon className="h-5 w-5" />
          </div>
          <div className="text-left">
            <div className="text-xs text-white/60">{c.label}</div>
            <div className="text-sm font-bold text-white">{c.price}</div>
          </div>
          <span className="text-xs font-semibold text-success">{c.trend}</span>
          {i === 0 && <Sparkles className="absolute -top-2 -right-2 h-4 w-4 text-gold animate-subtle-pulse" />}
        </div>
      ))}

      <div className="container relative py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold mb-8 animate-word-rise">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-success opacity-75 animate-ping" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
            </span>
            Live markets · 24/7 automated profits
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.02]">
            <span className="block animate-word-rise" style={{ animationDelay: "0.1s" }}>Your Wealth.</span>
            <span className="block animate-word-rise bg-gold-gradient bg-clip-text text-transparent" style={{ animationDelay: "0.35s" }}>
              Engineered Daily.
            </span>
          </h1>

          <p
            className="mt-8 text-base md:text-lg text-white/70 max-w-2xl mx-auto animate-word-rise"
            style={{ animationDelay: "0.6s" }}
          >
            Tap into algorithmic mining rigs, neural-network trading and elite copy traders — all in one
            vault. Start with as little as <span className="text-gold font-semibold">$50</span> and watch your portfolio compound.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-word-rise" style={{ animationDelay: "0.85s" }}>
            <Button variant="hero" size="lg" className="w-full sm:w-auto" onClick={() => navigate("/signup")}>
              Sign Up <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outlineGold" size="lg" className="w-full sm:w-auto" onClick={() => navigate("/login")}>
              Login
            </Button>
          </div>

          {/* Trust strip */}
          <div className="mt-14 grid grid-cols-3 gap-4 max-w-xl mx-auto animate-word-rise" style={{ animationDelay: "1.1s" }}>
            {[
              { v: "$2.4B+", l: "Assets Managed" },
              { v: "250K+", l: "Active Traders" },
              { v: "99.9%", l: "Uptime" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-gold/15 bg-white/5 backdrop-blur px-3 py-3">
                <div className="text-lg md:text-2xl font-black text-gold">{s.v}</div>
                <div className="text-[10px] md:text-xs text-white/60 uppercase tracking-wider">{s.l}</div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-white/50">
            <TrendingUp className="h-3.5 w-3.5 text-success" />
            Today's vault performance · <span className="text-success font-semibold">+1.84%</span>
          </div>
        </div>
      </div>
    </section>
  );
};