import { useEffect, useState } from "react";
import { Bitcoin } from "lucide-react";

const COINS = ["₿", "Ξ", "₮", "◎", "Ł"];

export const SplashIntro = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("splash_shown");
  });

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem("splash_shown", "1");
    const t = setTimeout(() => setShow(false), 2700);
    return () => clearTimeout(t);
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-hero-gradient animate-splash-out">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="relative flex flex-col items-center">
        <div className="relative h-40 w-40 flex items-center justify-center">
          {COINS.map((c, i) => (
            <span
              key={i}
              className="absolute text-2xl font-bold text-gold/80"
              style={{
                animation: `orbit 3s linear infinite`,
                animationDelay: `${-i * 0.6}s`,
              }}
            >
              {c}
            </span>
          ))}
          <div className="h-24 w-24 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold animate-pulse-glow">
            <Bitcoin className="h-12 w-12 text-midnight animate-coin-spin" />
          </div>
        </div>
        <div className="mt-8 text-center animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
            Crypto<span className="text-gold">Vault</span>
          </h1>
          <p className="mt-2 text-sm text-white/60 uppercase tracking-[0.3em]">Initializing Markets...</p>
        </div>
        <div className="mt-6 h-1 w-48 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-1/2 bg-gold-gradient animate-ticker-scroll" style={{ animationDuration: "1.4s" }} />
        </div>
      </div>
    </div>
  );
};