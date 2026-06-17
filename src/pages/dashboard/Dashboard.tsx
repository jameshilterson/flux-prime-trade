import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import {
  Wallet, TrendingUp, ArrowDownToLine, Award, ArrowUpFromLine, Users, Bitcoin,
  Activity, CheckCircle2, Clock, XCircle,
} from "lucide-react";

type Profile = {
  full_name: string;
  balance: number;
  profit: number;
  total_deposit: number;
  total_withdraw: number;
  account_level: string;
  preferred_currency: string;
  assigned_expert_id: string | null;
};

type Expert = {
  id: string;
  name: string;
  handle: string;
  specialty: string | null;
};

type Tx = {
  id: string;
  type: string;
  method: string | null;
  amount_usd: number;
  status: string;
  created_at: string;
};

const fmt = (n: number) =>
  `$${(n || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [p, setP] = useState<Profile | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [expert, setExpert] = useState<Expert | null>(null);

  useEffect(() => {
    if (!user) return;

    // Fetch profile (now includes assigned_expert_id)
    supabase
      .from("profiles")
      .select(
        "full_name, balance, profit, total_deposit, total_withdraw, account_level, preferred_currency, assigned_expert_id"
      )
      .eq("id", user.id)
      .maybeSingle()
      .then(async ({ data }) => {
        if (!data) return;
        const profile = data as Profile;
        setP(profile);

        // If admin has assigned an expert, fetch their details
        if (profile.assigned_expert_id) {
          const { data: ex } = await supabase
            .from("expert_traders")
            .select("id, name, handle, specialty")
            .eq("id", profile.assigned_expert_id)
            .maybeSingle();
          setExpert((ex as Expert | null) ?? null);
        } else {
          setExpert(null);
        }
      });

    // Fetch recent transactions
    Promise.all([
      supabase
        .from("deposits")
        .select("id, method, amount, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("withdrawals")
        .select("id, method, amount, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(4),
    ]).then(([d, w]) => {
      const dep = (d.data || []).map((r: any) => ({
        id: r.id, type: "deposit", method: r.method,
        amount_usd: Number(r.amount), status: r.status, created_at: r.created_at,
      }));
      const wd = (w.data || []).map((r: any) => ({
        id: r.id, type: "withdrawal", method: r.method,
        amount_usd: Number(r.amount), status: r.status, created_at: r.created_at,
      }));
      setTxs(
        [...dep, ...wd]
          .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
          .slice(0, 5)
      );
    });
  }, [user]);

  const btc = ((p?.balance || 0) / 67500).toFixed(8);
  const firstName = (p?.full_name || "").trim().split(" ")[0];

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div className="pt-2">
        <h1 className="text-2xl md:text-3xl font-black text-white">
          Welcome back{firstName ? `, ${firstName}` : ""}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Here's your portfolio at a glance.</p>
      </div>

      {/* ── Assigned expert pill ── */}
      {expert && (
        <Link
          to="/dashboard/copy-experts"
          className="flex w-full items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 hover:bg-emerald-500/20 hover:border-emerald-500/50 hover:scale-[1.02] transition-all duration-200 shadow-sm"
        >
          {/* Live pulse */}
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>

          {/* Avatar initials */}
          <span className="w-6 h-6 rounded-full bg-gold-gradient flex items-center justify-center text-midnight text-[9px] font-black shrink-0">
            {expert.name.split(" ").map((s) => s[0]).join("").slice(0, 2)}
          </span>

          {/* Text */}
          <span className="text-[13px] text-muted-foreground whitespace-nowrap">
            YOU ARE COPYING{" "}
            <span className="text-white font-bold">{expert.name}</span>
            {expert.handle && (
              <span className="text-muted-foreground/50"> {expert.handle}</span>
            )}
            {expert.specialty && (
              <span className="text-gold text-[11px]"> · {expert.specialty}</span>
            )}
          </span>
        </Link>
      )}

      {/* Balance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <BigCard icon={Wallet}        label="Total Balance"  primary={fmt(p?.balance || 0)}       secondary={`≈ ${btc} BTC`}        highlight hero />
        <BigCard icon={TrendingUp}    label="Profit"         primary={fmt(p?.profit || 0)}         secondary="All time"               accent="text-success" />
        <BigCard icon={ArrowDownToLine} label="Deposit"      primary={fmt(p?.total_deposit || 0)}  secondary="All time" />
        <BigCard icon={Award}         label="Account Level"  primary={(p?.account_level || "Basic").toUpperCase()} secondary="Upgrade available" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <SmallCard icon={ArrowUpFromLine} label="Total Withdrawals" value={fmt(p?.total_withdraw || 0)} />
        <SmallCard icon={Users}           label="Copied Experts"    value={expert ? "1" : "0"} />
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
            {txs.map((t) => (
              <li key={t.id} className="px-5 py-3 flex items-center gap-3">
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                    t.type === "deposit"
                      ? "bg-success/15 text-success"
                      : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {t.type === "deposit"
                    ? <ArrowDownToLine className="h-4 w-4" />
                    : <ArrowUpFromLine className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium capitalize">
                    {t.type} · <span className="text-muted-foreground">{t.method || "—"}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(t.created_at).toLocaleString()}
                  </div>
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

// ─── Shared sub-components ──────────────────────────────────────────────────

export const StatusPill = ({ status }: { status: string }) => {
  const s = status?.toLowerCase();
  const map: Record<string, { style: React.CSSProperties; Icon: any; label: string }> = {
    pending:   { style: { backgroundColor: "rgba(255,230,0,0.15)",    color: "#FFE600", borderColor: "#FFE600" },               Icon: Clock,        label: "Pending" },
    approved:  { style: { backgroundColor: "rgba(34,197,94,0.15)",    color: "#22c55e", borderColor: "rgba(34,197,94,0.4)" },   Icon: CheckCircle2, label: "Approved" },
    completed: { style: { backgroundColor: "rgba(34,197,94,0.15)",    color: "#22c55e", borderColor: "rgba(34,197,94,0.4)" },   Icon: CheckCircle2, label: "Completed" },
    rejected:  { style: { backgroundColor: "rgba(239,68,68,0.15)",    color: "#ef4444", borderColor: "rgba(239,68,68,0.4)" },   Icon: XCircle,      label: "Rejected" },
  };
  const cfg = map[s] || map.pending;
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase"
      style={cfg.style}
    >
      <cfg.Icon className="h-3 w-3" /> {cfg.label}
    </span>
  );
};

const BigCard = ({ icon: Icon, label, primary, secondary, highlight, accent, hero }: any) => (
  <Card
    className="p-5 border-0 text-white"
    style={{
      backgroundColor: "#34486B",
      border: hero ? "1px solid rgba(0,212,255,0.35)" : undefined,
      boxShadow: hero ? "0 0 0 1px rgba(0,212,255,0.15), 0 4px 24px -8px rgba(0,212,255,0.35)" : undefined,
    }}
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
