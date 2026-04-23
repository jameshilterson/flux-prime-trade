import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Row = {
  id: string; user_id: string; amount: number; method: string; destination: string | null;
  status: string | null; created_at: string | null;
  profile?: { email: string; balance: number | null; total_withdraw: number | null } | null;
};

const AdminWithdrawals = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  const load = async () => {
    const { data } = await supabase.from("withdrawals").select("*").order("created_at", { ascending: false });
    const list = (data ?? []) as Row[];
    const ids = [...new Set(list.map(r => r.user_id))];
    if (ids.length) {
      const { data: profs } = await supabase.from("profiles").select("id, email, balance, total_withdraw").in("id", ids);
      const map = new Map((profs ?? []).map((p: any) => [p.id, p]));
      list.forEach(r => (r.profile = map.get(r.user_id) as any));
    }
    setRows(list);
  };
  useEffect(() => { load(); }, []);

  const setStatus = async (r: Row, status: "approved" | "rejected") => {
    const { error } = await supabase.from("withdrawals").update({ status }).eq("id", r.id);
    if (error) { toast.error(error.message); return; }
    if (status === "approved" && r.profile) {
      await supabase.from("profiles").update({
        balance: Math.max(0, Number(r.profile.balance ?? 0) - Number(r.amount)),
        total_withdraw: Number(r.profile.total_withdraw ?? 0) + Number(r.amount),
      }).eq("id", r.user_id);
    }
    toast.success(`Withdrawal ${status}`);
    load();
  };

  const filtered = rows.filter(r => filter === "all" || r.status === filter);

  return (
    <div>
      <h1 className="text-2xl font-black mb-4">Withdrawal Requests</h1>
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["pending","approved","rejected","all"] as const).map(f => (
          <Button key={f} size="sm" variant={filter === f ? "gold" : "outline"} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(r => (
          <Card key={r.id} className="p-4">
            <div className="flex flex-wrap justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold">${Number(r.amount).toLocaleString()} <span className="text-xs font-normal text-muted-foreground">via {r.method}</span></p>
                <p className="text-xs text-muted-foreground">{r.profile?.email || r.user_id} • {r.created_at?.slice(0, 16).replace("T", " ")}</p>
                {r.destination && <p className="text-xs font-mono mt-1 break-all">{r.destination}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs uppercase font-bold rounded-full px-2.5 py-1 border ${
                  r.status === "approved" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30" :
                  r.status === "rejected" ? "bg-destructive/10 text-destructive border-destructive/30" :
                  "bg-gold/10 text-gold border-gold/30"
                }`}>{r.status}</span>
                {r.status === "pending" && (
                  <>
                    <Button size="sm" variant="gold" onClick={() => setStatus(r, "approved")}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => setStatus(r, "rejected")}>Reject</Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
        {!filtered.length && <p className="text-center text-muted-foreground py-12">No withdrawals.</p>}
      </div>
    </div>
  );
};
export default AdminWithdrawals;