import { useEffect, useMemo, useState } from "react";
import { Bitcoin } from "lucide-react";

// Pre-computed network nodes for blockchain visualization
const NODES = [
  { x: 20, y: 25 }, { x: 50, y: 15 }, { x: 80, y: 28 },
  { x: 12, y: 55 }, { x: 35, y: 50 }, { x: 65, y: 48 }, { x: 88, y: 60 },
  { x: 25, y: 80 }, { x: 55, y: 85 }, { x: 78, y: 78 },
  { x: 45, y: 35 }, { x: 60, y: 70 },
];

// Connections between nodes (indices into NODES)
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [0, 4], [1, 4], [1, 10], [2, 5], [2, 6],
  [3, 4], [4, 5], [5, 6], [4, 7], [5, 11], [6, 9],
  [7, 8], [8, 9], [8, 11], [10, 5], [3, 7], [10, 4],
];

const CRYPTO_SYMBOLS = ["₿", "Ξ", "₮", "◎", "Ł", "Đ"];

export const SplashIntro = () => {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("splash_shown");
  });

  useEffect(() => {
    if (!show) return;
    sessionStorage.setItem("splash_shown", "1");
    const t = setTimeout(() => setShow(false), 4400);
    return () => clearTimeout(t);
  }, [show]);

  // Random floating particles
  const particles = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        px: (Math.random() - 0.5) * 80,
        py: (Math.random() - 0.5) * 80,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
        size: 2 + Math.random() * 3,
      })),
    []
  );

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#02040a] animate-splash-cinematic">
      {/* Deep gradient base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, hsl(230 60% 12%) 0%, hsl(240 80% 4%) 60%, #02040a 100%)",
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(hsl(195 100% 60% / 0.15) 1px, transparent 1px), linear-gradient(90deg, hsl(195 100% 60% / 0.15) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Ambient color glows — neon blue & purple */}
      <div
        className="absolute top-1/4 left-1/4 h-[40rem] w-[40rem] rounded-full blur-[120px] opacity-60"
        style={{ background: "hsl(195 100% 55% / 0.4)" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 h-[40rem] w-[40rem] rounded-full blur-[120px] opacity-60"
        style={{ background: "hsl(265 90% 60% / 0.45)" }}
      />

      {/* Blockchain network SVG */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="hsl(195 100% 60%)" stopOpacity="0.2" />
            <stop offset="50%" stopColor="hsl(220 100% 70%)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(265 90% 65%)" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="nodeGrad">
            <stop offset="0%" stopColor="hsl(195 100% 80%)" />
            <stop offset="60%" stopColor="hsl(195 100% 55%)" />
            <stop offset="100%" stopColor="hsl(265 90% 50%)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Connection lines */}
        {EDGES.map(([a, b], i) => {
          const n1 = NODES[a];
          const n2 = NODES[b];
          return (
            <line
              key={i}
              x1={n1.x}
              y1={n1.y}
              x2={n2.x}
              y2={n2.y}
              stroke="url(#lineGrad)"
              strokeWidth="0.15"
              strokeDasharray="600"
              className="animate-line-draw"
              style={{ animationDelay: `${0.2 + i * 0.05}s` }}
            />
          );
        })}

        {/* Pulse nodes */}
        {NODES.map((n, i) => (
          <g key={i}>
            <circle
              cx={n.x}
              cy={n.y}
              r="2"
              fill="url(#nodeGrad)"
              className="animate-node-pulse"
              style={{ animationDelay: `${0.5 + i * 0.12}s`, transformOrigin: `${n.x}px ${n.y}px` }}
            />
            <circle cx={n.x} cy={n.y} r="0.5" fill="hsl(195 100% 90%)" />
          </g>
        ))}

        {/* Floating crypto symbols at select nodes */}
        {CRYPTO_SYMBOLS.map((sym, i) => {
          const n = NODES[i * 2];
          if (!n) return null;
          return (
            <text
              key={sym}
              x={n.x}
              y={n.y - 3}
              fontSize="2.2"
              fill="hsl(195 100% 75%)"
              fontWeight="700"
              textAnchor="middle"
              style={{
                opacity: 0,
                animation: `fade-in 0.8s ease-out ${1.2 + i * 0.15}s forwards`,
                filter: "drop-shadow(0 0 2px hsl(195 100% 60%))",
              }}
            >
              {sym}
            </text>
          );
        })}
      </svg>

      {/* Drifting particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background:
              p.id % 2 === 0 ? "hsl(195 100% 70%)" : "hsl(265 90% 70%)",
            boxShadow: `0 0 ${p.size * 3}px currentColor`,
            color: p.id % 2 === 0 ? "hsl(195 100% 70%)" : "hsl(265 90% 70%)",
            ["--px" as string]: `${p.px}px`,
            ["--py" as string]: `${p.py}px`,
            animation: `particle-drift ${p.duration}s ease-out ${p.delay}s infinite`,
          }}
        />
      ))}

      {/* Scan line — tech feel */}
      <div
        className="absolute inset-x-0 h-[2px] pointer-events-none animate-scan-line"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsl(195 100% 70% / 0.9), hsl(265 90% 70% / 0.9), transparent)",
          boxShadow: "0 0 20px hsl(195 100% 60%)",
        }}
      />

      {/* Center logo reveal */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="relative animate-logo-reveal" style={{ perspective: "800px" }}>
          {/* Expanding rings */}
          <div
            className="absolute inset-0 rounded-full border animate-ring-expand"
            style={{ borderColor: "hsl(195 100% 60% / 0.5)" }}
          />
          <div
            className="absolute inset-0 rounded-full border animate-ring-expand"
            style={{ borderColor: "hsl(265 90% 65% / 0.5)", animationDelay: "0.8s" }}
          />
          <div
            className="absolute inset-0 rounded-full border animate-ring-expand"
            style={{ borderColor: "hsl(195 100% 60% / 0.5)", animationDelay: "1.6s" }}
          />

          {/* Logo coin with 3D depth */}
          <div
            className="relative h-28 w-28 md:h-36 md:w-36 rounded-full flex items-center justify-center animate-logo-glow"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, hsl(195 100% 70%), hsl(220 90% 40%) 50%, hsl(265 90% 30%) 100%)",
              transform: "translateZ(0)",
              boxShadow:
                "inset 0 -8px 20px hsl(265 90% 20% / 0.6), inset 0 8px 20px hsl(195 100% 80% / 0.4), 0 20px 60px hsl(220 100% 50% / 0.4)",
            }}
          >
            <Bitcoin
              className="h-14 w-14 md:h-20 md:w-20 text-white"
              strokeWidth={2.5}
              style={{ filter: "drop-shadow(0 2px 4px hsl(220 100% 20% / 0.8))" }}
            />
          </div>
        </div>

        {/* Brand name */}
        <div className="mt-10 text-center">
          <h1
            className="text-3xl md:text-5xl font-black tracking-tight text-white"
            style={{
              opacity: 0,
              animation: "fade-in 1s ease-out 1.4s forwards",
              textShadow: "0 0 30px hsl(195 100% 60% / 0.8)",
            }}
          >
            Crypto
            <span
              style={{
                background: "linear-gradient(135deg, hsl(195 100% 70%), hsl(265 90% 70%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Vault
            </span>
          </h1>
          <p className="mt-4 text-[10px] md:text-xs text-white/60 uppercase animate-text-fade-up">
            Decentralized · Secure · Intelligent
          </p>
        </div>

        {/* Loading data stream */}
        <div className="mt-8 flex items-center gap-2 font-mono text-[10px] text-cyan-300/70" style={{ opacity: 0, animation: "fade-in 0.6s ease-out 2s forwards" }}>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>SYNCING BLOCKCHAIN · 0x{Math.floor(Math.random() * 0xfffff).toString(16).padStart(5, "0").toUpperCase()}</span>
        </div>
      </div>

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.7) 100%)",
        }}
      />
    </div>
  );
};
