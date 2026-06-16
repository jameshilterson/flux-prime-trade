import { Star } from "lucide-react";

const TESTIMONIALS = [
  { name: "Marcus Bell", role: "Investor · USA", initials: "MB", rating: 5,
    quote: "I've tripled my portfolio in 4 months copying the top traders. Withdrawals are processed within hours every single time." },
  { name: "Sofia Chen", role: "Day Trader · Singapore", initials: "SC", rating: 5,
    quote: "The AI signals are incredibly accurate. Cleanest dashboard I've used, and the platform feels safer than anything else I've tried." },
  { name: "Alex Petrov", role: "Crypto Miner · UAE", initials: "AP", rating: 5,
    quote: "Set up my mining plan in under 5 minutes. Daily payouts hit my wallet on the dot. Support team is responsive and human." },
  { name: "Liam Walsh", role: "Forex Trader · Ireland", initials: "LW", rating: 5,
    quote: "Best copy-trading platform I've used. The expert leaderboard is transparent and verifiable." },
  { name: "Aisha Khan", role: "Investor · UAE", initials: "AK", rating: 5,
    quote: "I started with $1,000 and grew it to $14,500 in just 6 months following the AI signals." },
  { name: "Yuki Tanaka", role: "Pro Trader · Japan", initials: "YT", rating: 5,
    quote: "Lightning-fast execution and pristine UX. The mobile experience is on par with any top fintech." },
];

const Card = ({ t }: { t: typeof TESTIMONIALS[number] }) => (
  <div
    className="shrink-0 w-[85vw] sm:w-[420px] rounded-2xl p-6 text-white"
    style={{ backgroundColor: "#253E60" }}
  >
    <div className="flex items-center gap-1 mb-4">
      {Array.from({ length: t.rating }).map((_, i) => (
        <Star key={i} className="h-4 w-4" style={{ color: "#00D4FF", fill: "#00D4FF" }} />
      ))}
    </div>
    <p className="text-sm md:text-base text-white/85 leading-relaxed">"{t.quote}"</p>
    <div className="mt-6 flex items-center gap-3">
      <div
        className="h-10 w-10 rounded-full text-white font-black flex items-center justify-center text-sm"
        style={{ backgroundColor: "#00D4FF" }}
      >
        {t.initials}
      </div>
      <div>
        <div className="font-bold text-white text-sm">{t.name}</div>
        <div className="text-xs text-white/60">{t.role}</div>
      </div>
    </div>
  </div>
);

export const TestimonialsSection = () => (
  <section className="py-20 overflow-hidden" style={{ backgroundColor: "#172640" }}>
    <div className="container">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-white">Loved by traders worldwide</h2>
        <p className="text-white/70 mt-3 max-w-xl mx-auto">
          Real stories from real investors growing their portfolios with us.
        </p>
      </div>
    </div>
    <div className="relative w-full overflow-hidden">
      <div className="flex gap-6 animate-marquee w-max">
        {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
          <Card key={i} t={t} />
        ))}
      </div>
    </div>
  </section>
);
