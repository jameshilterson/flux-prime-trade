import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { StatsTicker } from "@/components/StatsTicker";
import { LiveCryptoTicker } from "@/components/LiveCryptoTicker";
import { CryptoConverter } from "@/components/CryptoConverter";
import { ProfitCalculator } from "@/components/ProfitCalculator";
import { PlansSection } from "@/components/PlansSection";
import { CopyTradingSection } from "@/components/CopyTradingSection";
import { LiveEarningsPopup } from "@/components/LiveEarningsPopup";
import { Footer } from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Cpu, Brain, Users, Shield, Zap, BarChart3 } from "lucide-react";

const FEATURES = [
  { icon: Cpu, title: "Crypto Mining", desc: "Industrial-grade rigs mining BTC, ETH, and more 24/7." },
  { icon: Brain, title: "AI Trading", desc: "ML models executing trades across major exchanges." },
  { icon: Users, title: "Copy Trading", desc: "Mirror top performing traders with one click." },
  { icon: Shield, title: "Bank-Grade Security", desc: "Multi-layer DDoS protection and encrypted vaults." },
  { icon: Zap, title: "Instant Withdrawals", desc: "Process payouts in BTC, ETH, USDT, bank, and more." },
  { icon: BarChart3, title: "Live Analytics", desc: "Real-time dashboards and projected earnings." },
];

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main>
      <Hero />
      <About />
      <LiveCryptoTicker />

      <section id="calculator" className="py-20">
        <div className="container grid lg:grid-cols-2 gap-8 items-start">
          <div>
            <h2 className="text-3xl md:text-5xl font-black mb-4">Calculate Your Earnings</h2>
            <p className="text-muted-foreground mb-6 max-w-md">Pick a plan, set your investment, and watch your projected returns update in real time.</p>
            <CryptoConverter />
          </div>
          <ProfitCalculator />
        </div>
      </section>

      <StatsTicker />

      <section id="features" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black">Why CryptoVault</h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Everything you need to grow your crypto portfolio in one place.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <Card key={f.title} className="p-6 hover:border-gold/40 transition group">
                <div className="h-12 w-12 rounded-lg bg-gold/10 text-gold flex items-center justify-center mb-4 group-hover:bg-gold-gradient group-hover:text-midnight transition">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg">{f.title}</h3>
                <p className="text-muted-foreground text-sm mt-2">{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <PlansSection />
      <CopyTradingSection />
    </main>
    <Footer />
    <LiveEarningsPopup />
  </div>
);

export default Index;
