import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

type Tx = { id: string; amount: number; method: string; status: string; created_at: string; type: "Deposit" | "Withdrawal" };

const Transactions = () => {
  const { user } = useAuth();
  const [txs, setTxs] = useState<Tx[]>([]);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("deposits").select("id, amount, method, status, created_at").eq("user_id", user.id),
      supabase.from("withdrawals").select("id, amount, method, status, created_at").eq("user_id", user.id),
    ]).then(([d, w]) => {
      const combined: Tx[] = [
        ...((d.data || []) as any[]).map(x => ({ ...x, type: "Deposit" as const })),
        ...((w.data || []) as any[]).map(x => ({ ...x, type: "Withdrawal" as const })),
      ].sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
      setTxs(combined);
    });
  }, [user]);

  return (
    <div>
      <h1 className="text-2xl font-black mb-6">Transaction History</h1>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
          <div>Type</div><div>Method</div><div className="text-right">Amount</div><div className="hidden md:block">Date</div><div>Status</div>
        </div>
        {txs.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No transactions yet.</div>}
        {txs.map(t => (
          <div key={t.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 items-center px-4 py-3 border-b border-border last:border-0 text-sm">
            <div className="font-medium">{t.type}</div>
            <div>{t.method}</div>
            <div className="text-right tabular-nums font-bold">${Number(t.amount).toFixed(2)}</div>
            <div className="hidden md:block text-muted-foreground text-xs">{new Date(t.created_at).toLocaleString()}</div>
            <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${
              t.status === "approved" ? "bg-success/10 text-success" :
              t.status === "rejected" ? "bg-destructive/10 text-destructive" :
              "bg-gold/10 text-gold"
            }`}>{t.status}</span>
          </div>
        ))}
      </Card>
    </div>
  );
};
export default Transactions;