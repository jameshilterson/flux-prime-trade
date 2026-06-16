import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  Wallet, TrendingUp, ArrowDownToLine, Award, ArrowUpFromLine, Users, Bitcoin,
  Activity, CheckCircle2, Clock, XCircle,
} from "lucide-react";

type Profile = {
  full_name: string;
  balance: number; profit: number; total_deposit: number; total_withdraw: number;
  account_level: string; preferred_currency: string;
};

type Tx = { id: string; type: string; method: string | null; amount_usd: number; status: string; created_at: string };

const EXPERTS = [
  { name: "Alex Petrov", country: "🇷🇺", winRate: 87, monthly: 24.5, avatar: "AP" },
  { name: "Sofia Chen", country: "🇸🇬", winRate: 82, monthly: 19.8, avatar: "SC" },
  { name: "Marcus Bell", country: "🇺🇸", winRate: 79, monthly: 17.6, avatar: "MB" },
  { name: "Yuki Tanaka", country: "🇯🇵", winRate: 76, monthly: 15.4, avatar: "YT" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [p, setP] = useState<Profile | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, balance, profit, total_deposit, total_withdraw, account_level, preferred_currency")
      .eq("id", user.id).maybeSingle().then(({ data }) => data && setP(data as Profile));

    Promise.all([
      supabase.from("deposits").select("id, method, amount, status, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(4),
      supabase.from("withdrawals").select("id, method, amount, status, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(4),
    ]).then(([d, w]) => {
      const dep = (d.data || []).map((r: any) => ({ id: r.id, type: "deposit", method: r.method, amount_usd: Number(r.amount), status: r.status, created_at: r.created_at }));
      const wd = (w.data || []).map((r: any) => ({ id: r.id, type: "withdrawal", method: r.method, amount_usd: Number(r.amount), status: r.status, created_at: r.created_at }));
      setTxs([...dep, ...wd].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at)).slice(0, 5));
    });
  }, [user]);

  const fmt = (n: number) => `$${(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const btc = ((p?.balance || 0) / 67500).toFixed(8);
  const firstName = (p?.full_name || "").trim().split(" ")[0];

  return (
    <div className="space-y-8">
      {/* Greeting at very top, above everything */}
      <div className="pt-2">
        <h1 className="text-2xl md:text-3xl font-black text-white">
          Welcome back{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Here's your portfolio at a glance.</p>
      </div>

      {/* Balance cards with proper top spacing */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BigCard icon={Wallet} label="Total Balance" primary={fmt(p?.balance || 0)} secondary={`≈ ${btc} BTC`} highlight />
        <BigCard icon={TrendingUp} label="Profit" primary={fmt(p?.profit || 0)} secondary="All time" accent="text-success" />
        <BigCard icon={ArrowDownToLine} label="Deposit" primary={fmt(p?.total_deposit || 0)} secondary="All time" />
        <BigCard icon={Award} label="Account Level" primary={(p?.account_level || "Basic").toUpperCase()} secondary="Upgrade available" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SmallCard icon={ArrowUpFromLine} label="Total Withdrawals" value={fmt(p?.total_withdraw || 0)} />
        <SmallCard icon={Users} label="Copied Experts" value="0" />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="gold" size="lg" onClick={() => navigate("/dashboard/deposit")}>
          <ArrowDownToLine className="h-4 w-4" /> Deposit
        </Button>
        <Button variant="outlineGold" size="lg" onClick={() => navigate("/dashboard/withdraw")}>
          <ArrowUpFromLine className="h-4 w-4" /> Withdraw
        </Button>
      </div>

      {/* Live chart */}
      <Card className="p-0 overflow-hidden border-border">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2"><Bitcoin className="h-4 w-4 text-gold" /><h3 className="font-bold">Live BTC/USD Chart</h3></div>
          <span className="text-xs text-muted-foreground">TradingView</span>
        </div>
        <iframe
          title="trading"
          src="https://s.tradingview.com/widgetembed/?frameElementId=tv&symbol=BINANCE%3ABTCUSDT&interval=60&theme=dark&style=1&hidesidetoolbar=1&hidetoptoolbar=0&saveimage=0"
          className="w-full h-[420px] border-0"
        />
      </Card>

      {/* Recent Activity */}
      <Card className="p-0 overflow-hidden border-border">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Activity className="h-4 w-4 text-gold" />
          <h3 className="font-bold">Recent Activity</h3>
        </div>
        {txs.length === 0 ? (
          <div className="p-6 text-center text-sm text-muted-foreground">No transactions yet.</div>
        ) : (
          <ul className="divide-y divide-border">
            {txs.map(t => (
              <li key={t.id} className="px-5 py-3 flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${t.type === "deposit" ? "bg-success/15 text-success" : "bg-destructive/15 text-destructive"}`}>
                  {t.type === "deposit" ? <ArrowDownToLine className="h-4 w-4" /> : <ArrowUpFromLine className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium capitalize">{t.type} · <span className="text-muted-foreground">{t.method || "—"}</span></div>
                  <div className="text-xs text-muted-foreground">{new Date(t.created_at).toLocaleString()}</div>
                </div>
                <div className="text-sm font-bold tabular-nums">{fmt(t.amount_usd)}</div>
                <StatusPill status={t.status} />
              </li>
            ))}
          </ul>
        )}
      </Card>

    </div>
  );
};

const StatusPill = ({ status }: { status: string }) => {
  const s = status?.toLowerCase();
  const map: Record<string, { cls: string; Icon: any; label: string }> = {
    pending: { cls: "bg-amber-500/15 text-amber-600 border-amber-500/30", Icon: Clock, label: "Pending" },
    approved: { cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30", Icon: CheckCircle2, label: "Approved" },
    completed: { cls: "bg-emerald-500/15 text-emerald-600 border-emerald-500/30", Icon: CheckCircle2, label: "Completed" },
    rejected: { cls: "bg-red-500/15 text-red-600 border-red-500/30", Icon: XCircle, label: "Rejected" },
  };
  const cfg = map[s] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${cfg.cls}`}>
      <cfg.Icon className="h-3 w-3" /> {cfg.label}
    </span>
  );
};

const BigCard = ({ icon: Icon, label, primary, secondary, highlight, accent }: any) => (
  <Card
    className="p-5 border-0 text-white"
    style={{ backgroundColor: "#34486B" }}
  >
    <div className="flex items-center justify-between">
      <span className="text-xs uppercase tracking-wider text-white/70">{label}</span>
      <Icon className={`h-4 w-4 ${highlight ? "text-primary" : "text-white/70"}`} />
    </div>
    <div className={`mt-3 text-2xl font-black tabular-nums ${accent || "text-white"}`}>{primary}</div>
    <div className="text-xs text-white/60 mt-1">{secondary}</div>
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
