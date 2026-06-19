import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { StatusPill } from "./Dashboard";

type Tx = { id: string; amount: number; method: string; status: string; created_at: string; type: string };

const Transactions = () => {
  const { user } = useAuth();
  const [txs, setTxs] = useState<Tx[] | null>(null);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    supabase
      .from("transactions")
      .select("id, amount, method, status, created_at, type")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (!cancelled) setTxs((data as Tx[] | null) ?? []); });

    const ch = supabase
      .channel(`tx-${user.id}`)
      .on("postgres_changes",
        { event: "*", schema: "public", table: "transactions", filter: `user_id=eq.${user.id}` },
        () => {
          supabase.from("transactions")
            .select("id, amount, method, status, created_at, type")
            .eq("user_id", user.id).order("created_at", { ascending: false })
            .then(({ data }) => { if (!cancelled) setTxs((data as Tx[] | null) ?? []); });
        })
      .subscribe();
    return () => { cancelled = true; supabase.removeChannel(ch); };
  }, [user?.id]);

  return (
    <div>
      <h1 className="text-2xl font-black mb-6 text-white">Transaction History</h1>
      <Card className="overflow-hidden">
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border bg-muted/30">
          <div>Type</div><div>Method</div><div className="text-right">Amount</div><div className="hidden md:block">Date</div><div>Status</div>
        </div>
        {txs === null && Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 items-center px-4 py-3 border-b border-border last:border-0">
            <div className="skeleton-shimmer h-4 w-20" />
            <div className="skeleton-shimmer h-4 w-16" />
            <div className="skeleton-shimmer h-4 w-20 justify-self-end" />
            <div className="skeleton-shimmer h-4 w-32 hidden md:block" />
            <div className="skeleton-shimmer h-5 w-16 rounded-full" />
          </div>
        ))}
        {txs !== null && txs.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No transactions yet.</div>}
        {txs?.map((t) => (
          <div key={t.id} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3 items-center px-4 py-3 border-b border-border last:border-0 text-sm">
            <div className="font-medium capitalize">{t.type}</div>
            <div>{t.method || "—"}</div>
            <div className="text-right tabular-nums font-bold">{Number(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="hidden md:block text-muted-foreground text-xs">{new Date(t.created_at).toLocaleString()}</div>
            <StatusPill status={t.status} />
          </div>
        ))}
      </Card>
    </div>
  );
};
export default Transactions;
