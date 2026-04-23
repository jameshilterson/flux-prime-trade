import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { PLANS } from "@/lib/constants";
import { useNavigate } from "react-router-dom";

export const PlansSection = () => {
  const navigate = useNavigate();
  return (
    <section id="plans" className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black">Investment Plans</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">Choose the plan that matches your investment goals. All plans include 24/7 support.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {PLANS.map((p) => (
            <Card key={p.name} className={`relative p-8 ${p.popular ? "border-gold/50 shadow-gold scale-[1.02]" : "border-border"}`}>
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gold-gradient px-3 py-1 text-xs font-bold text-midnight flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Most Popular
                </div>
              )}
              <h3 className="text-xl font-bold">{p.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-black text-gold">{p.roi}%</span>
                <span className="text-muted-foreground">/ daily</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">for {p.duration} days</p>
              <ul className="mt-6 space-y-3 text-sm">
                <li className="flex gap-2"><Check className="h-4 w-4 text-gold mt-0.5" /> Min deposit ${p.min.toLocaleString()}</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-gold mt-0.5" /> Daily ROI payouts</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-gold mt-0.5" /> 24/7 expert support</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-gold mt-0.5" /> Instant withdrawals</li>
                <li className="flex gap-2"><Check className="h-4 w-4 text-gold mt-0.5" /> Copy trading access</li>
              </ul>
              <Button variant={p.popular ? "gold" : "outline"} className="w-full mt-8" onClick={() => navigate("/signup")}>
                Invest Now
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};