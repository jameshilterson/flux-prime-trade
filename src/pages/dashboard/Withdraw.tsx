import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { CURRENCIES } from "@/lib/currencies";

const METHODS = ["Crypto", "Bank Transfer", "PayPal", "CashApp", "Venmo", "Chime"];

const Withdraw = () => {
  const { user } = useAuth();
  const [method, setMethod] = useState("Crypto");
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("preferred_currency").eq("id", user.id).maybeSingle()
      .then(({ data }) => data?.preferred_currency && setCurrency(data.preferred_currency));
  }, [user]);

  const symbol = CURRENCIES.find(c => c.code === currency)?.symbol ?? currency;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("withdrawals").insert({
      user_id: user.id, amount: parseFloat(amount), method, destination,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Withdrawal submitted. Pending review.");
    setAmount(""); setDestination("");
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black mb-1 text-white">Withdraw Funds</h1>
      <p className="text-sm text-white/70 mb-6">Submit a withdrawal request. Authorization happens in the secure modal after you click Request Withdrawal.</p>
      <Card className="p-6 space-y-4">
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Method</Label>
            <select value={method} onChange={e => setMethod(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-white">
              {METHODS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Amount ({currency})</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 text-sm">{symbol}</span>
              <Input type="number" min="1" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required className="pl-8" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>{method === "Crypto" ? "Wallet Address" : "Account Details"}</Label>
            <Input value={destination} onChange={e => setDestination(e.target.value)} required />
          </div>
          <Button variant="gold" type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Processing..." : "Request Withdrawal"}
          </Button>
        </form>
      </Card>
    </div>
  );
};
export default Withdraw;
