import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TRADERS } from "@/lib/constants";
import { Trophy, Users, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

export const CopyTradingSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <section id="traders" className="py-20">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-gold text-sm font-medium mb-3">
            <Trophy className="h-4 w-4" /> Top Performing Traders
          </div>
          <h2 className="text-3xl md:text-5xl font-black">Copy Expert Traders</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Mirror the trades of verified pros. Auto-sync trade simulation included.
          </p>
        </div>

        <Card className="overflow-hidden border-border">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 px-4 md:px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b border-border bg-muted/30">
            <div>Trader</div>
            <div className="text-right">ROI</div>
            <div className="text-right hidden md:block">Win Rate</div>
            <div className="text-right hidden md:block">Followers</div>
            <div></div>
          </div>
          {TRADERS.map((t, i) => (
            <div key={t.name} className="grid grid-cols-[2fr_1fr_1fr_1fr_auto] md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 items-center px-4 md:px-6 py-4 border-b border-border last:border-0 hover:bg-muted/30 transition">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-gold-gradient flex items-center justify-center text-midnight text-xs font-black">{t.avatar}</div>
                <div>
                  <div className="font-semibold text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">#{i + 1} ranked</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-success font-bold tabular-nums">+{t.roi}%</span>
              </div>
              <div className="text-right hidden md:block tabular-nums">{t.winRate}%</div>
              <div className="text-right hidden md:flex items-center justify-end gap-1 text-muted-foreground text-sm">
                <Users className="h-3 w-3" /> {t.followers.toLocaleString()}
              </div>
              <Button size="sm" variant="gold" onClick={() => navigate(user ? "/dashboard" : "/login")}>
                <TrendingUp className="h-3 w-3 mr-1" /> Copy
              </Button>
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
};