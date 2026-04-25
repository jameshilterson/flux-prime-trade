import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImg from "@/assets/hero-crypto.jpg";

const WORDS = ["Crypto Mining", "AI Trading", "Copy Trading"];

const useTypewriter = () => {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "hold" | "deleting">("typing");

  useEffect(() => {
    const word = WORDS[wordIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (phase === "typing") {
      if (text.length < word.length) {
        timeout = setTimeout(() => setText(word.slice(0, text.length + 1)), 90);
      } else {
        timeout = setTimeout(() => setPhase("hold"), 1800);
      }
    } else if (phase === "hold") {
      timeout = setTimeout(() => setPhase("deleting"), 600);
    } else {
      if (text.length > 0) {
        timeout = setTimeout(() => setText(text.slice(0, -1)), 40);
      } else {
        setWordIdx((i) => (i + 1) % WORDS.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [text, phase, wordIdx]);

  return text;
};

export const Hero = () => {
  const navigate = useNavigate();
  const typed = useTypewriter();

  return (
    <section className="relative overflow-hidden bg-hero-gradient">
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div
        className="absolute inset-0 opacity-30 mix-blend-screen"
        style={{ backgroundImage: `url(${heroImg})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <div className="container relative pt-20 pb-32 md:pt-28 md:pb-40">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-xs font-medium text-gold mb-8">
            <Shield className="h-3 w-3" /> Trusted by 250,000+ investors worldwide
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] animate-slide-in-left">
            Earn Passive Income<br />
            Through Smart{" "}
            <span className="bg-gold-gradient bg-clip-text text-transparent inline-block min-h-[1.1em]">
              {typed}
              <span className="animate-blink text-gold">|</span>
            </span>
          </h1>

          <div className="mt-8 h-8 overflow-hidden">
            <p className="text-lg md:text-xl text-gold font-medium animate-slide-blur">
              Secured & Easy Way To Trade Forex & Crypto
            </p>
          </div>

          <p
            className="mt-6 text-base md:text-lg text-white/70 max-w-2xl mx-auto animate-fade-in animate-subtle-pulse opacity-0"
            style={{ animationDelay: "0.9s, 1.5s", animationFillMode: "forwards" }}
          >
            At <span className="text-gold font-semibold">CryptoVault</span>, we are committed to providing you with a secure, reliable,
            and high-performance trading experience.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="hero" size="lg" className="w-full sm:w-auto" onClick={() => navigate("/signup")}>
              Sign Up <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outlineGold" size="lg" className="w-full sm:w-auto" onClick={() => navigate("/login")}>
              Login
            </Button>
            <Button variant="ghost" size="lg" className="text-white/80 hover:text-white hover:bg-white/10" onClick={() => document.getElementById("calculator")?.scrollIntoView({ behavior: "smooth" })}>
              <TrendingUp className="mr-2 h-4 w-4" /> Invest Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};