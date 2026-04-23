import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Users, ArrowDownToLine, ArrowUpFromLine, Wallet } from "lucide-react";

const AdminOverview = () => {
  const [stats, setStats] = useState({ users: 0, deposits: 0, withdrawals: 0, pending: 0 });

  useEffect(() => {
    (async () => {
      const [u, d, w, pd] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("deposits").select("amount"),
        supabase.from("withdrawals").select("amount"),
        supabase.from("deposits").select("id", { count: "exact", head: true }).eq("status", "pending"),
      ]);
      setStats({
        users: u.count ?? 0,
        deposits: (d.data ?? []).reduce((s, r: any) => s + Number(r.amount), 0),
        withdrawals: (w.data ?? []).reduce((s, r: any) => s + Number(r.amount), 0),
        pending: pd.count ?? 0,
      });
    })();
  }, []);

  const cards = [
    { label: "Total Users", value: stats.users, icon: Users },
    { label: "Total Deposits", value: `$${stats.deposits.toLocaleString()}`, icon: ArrowDownToLine },
    { label: "Total Withdrawals", value: `$${stats.withdrawals.toLocaleString()}`, icon: ArrowUpFromLine },
    { label: "Pending Deposits", value: stats.pending, icon: Wallet },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black mb-6">Admin Overview</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <Card key={c.label} className="p-5">
            <c.icon className="h-5 w-5 text-gold mb-3" />
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{c.label}</p>
            <p className="text-2xl font-black mt-1">{c.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
export default AdminOverview;