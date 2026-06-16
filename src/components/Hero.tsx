import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import skyscrapers from "@/assets/hero-skyscrapers.jpg";
import meeting from "@/assets/hero-meeting.jpg";
import tablet from "@/assets/hero-tablet.jpg";

const SLIDES = [
  {
    image: skyscrapers,
    title: "Secured & Easy Way To Trade Stock, Forex & Crypto",
    subtext:
      "Start making money with Netrix mining. Trade the world's most liquid markets with full transparency.",
  },
  {
    image: meeting,
    title: "Join Over 250K+ Active Traders and Investors",
    subtext:
      "Tap into algorithmic mining, neural-network trading and elite copy traders — all in one platform.",
  },
  {
    image: tablet,
    title: "Copy Your Favorite Expert Traders",
    subtext:
      "Mirror the portfolios of verified top-performing traders in real time. One tap to copy, full control to stop anytime.",
  },
];

const SLIDE_MS = 4500;

export const Hero = () => {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % SLIDES.length), SLIDE_MS);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden min-h-[88vh] md:min-h-[92vh] flex items-center">
      {/* Background slides — crossfade */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out bg-cover bg-center"
          style={{
            backgroundImage: `url(${s.image})`,
            opacity: i === index ? 1 : 0,
          }}
          aria-hidden={i !== index}
        />
      ))}

      {/* Dark overlay so text reads but image still shows through */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />

      <div className="container relative py-24 md:py-32">
        <div className="max-w-3xl text-left md:text-center md:mx-auto">
          {/* Synced text — keyed on index so each transition runs the animation */}
          <div key={index} className="space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
              {SLIDES[index].title}
            </h1>
            <p className="text-base md:text-lg text-white/85 max-w-2xl md:mx-auto">
              {SLIDES[index].subtext}
            </p>
          </div>

          {/* Static CTAs — animate once on first load only */}
          <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-start md:justify-center gap-4 animate-fade-in">
            <Button variant="hero" size="lg" className="w-full sm:w-auto" onClick={() => navigate("/signup")}>
              Sign Up <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outlineGold" size="lg" className="w-full sm:w-auto" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </div>

          {/* Slide indicators */}
          <div className="mt-10 flex items-center gap-2 justify-start md:justify-center">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-gold" : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
