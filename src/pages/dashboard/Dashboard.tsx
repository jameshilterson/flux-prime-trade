import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Wallet, TrendingUp, ArrowDownToLine, Award, ArrowUpFromLine, Users, Bitcoin } from "lucide-react";

type Profile = {
  balance: number; profit: number; total_deposit: number; total_withdraw: number;
  account_level: string; preferred_currency: string;
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [p, setP] = useState<Profile | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("balance, profit, total_deposit, total_withdraw, account_level, preferred_currency")
      .eq("id", user.id).maybeSingle().then(({ data }) => data && setP(data as Profile));
  }, [user]);

  const fmt = (n: number) => `$${(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const btc = ((p?.balance || 0) / 67500).toFixed(8);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BigCard
          icon={Wallet} label="Total Balance"
          primary={fmt(p?.balance || 0)} secondary={`≈ ${btc} BTC`} highlight
        />
        <BigCard icon={TrendingUp} label="Profit" primary={fmt(p?.profit || 0)} secondary="All time" accent="text-success" />
        <BigCard icon={ArrowDownToLine} label="Deposit" primary={fmt(p?.total_deposit || 0)} secondary="All time" />
        <BigCard icon={Award} label="Account Level" primary={(p?.account_level || "Basic").toUpperCase()} secondary="Upgrade available" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SmallCard icon={ArrowUpFromLine} label="Total Withdrawals" value={fmt(p?.total_withdraw || 0)} />
        <SmallCard icon={Users} label="Copied Experts" value="0" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="gold" size="lg" onClick={() => navigate("/dashboard/deposit")}>
          <ArrowDownToLine className="h-4 w-4" /> Deposit
        </Button>
        <Button variant="outlineGold" size="lg" onClick={() => navigate("/dashboard/withdraw")}>
          <ArrowUpFromLine className="h-4 w-4" /> Withdraw
        </Button>
      </div>

      <Card className="p-0 overflow-hidden border-border">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bitcoin className="h-4 w-4 text-gold" />
            <h3 className="font-bold">Live BTC/USD Chart</h3>
          </div>
          <span className="text-xs text-muted-foreground">TradingView</span>
        </div>
        <iframe
          title="trading"
          src="https://s.tradingview.com/widgetembed/?frameElementId=tv&symbol=BINANCE%3ABTCUSDT&interval=60&theme=dark&style=1&hidesidetoolbar=1&hidetoptoolbar=0&saveimage=0"
          className="w-full h-[420px] border-0"
        />
      </Card>
    </div>
  );
};

const BigCard = ({ icon: Icon, label, primary, secondary, highlight, accent }: any) => (
  <Card className={`p-5 ${highlight ? "border-gold/40 bg-gradient-to-br from-card to-gold/5" : ""}`}>
    <div className="flex items-center justify-between">
      <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <Icon className={`h-4 w-4 ${highlight ? "text-gold" : "text-muted-foreground"}`} />
    </div>
    <div className={`mt-3 text-2xl font-black tabular-nums ${accent || ""}`}>{primary}</div>
    <div className="text-xs text-muted-foreground mt-1">{secondary}</div>
  </Card>
);

const SmallCard = ({ icon: Icon, label, value }: any) => (
  <Card className="p-4">
    <div className="flex items-center justify-between">
      <span className="text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      <Icon className="h-3.5 w-3.5 text-muted-foreground" />
    </div>
    <div className="mt-2 text-lg font-bold tabular-nums">{value}</div>
  </Card>
);

export default Dashboard;