import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { ShieldAlert } from "lucide-react";

const METHODS = ["Crypto", "Bank Transfer", "PayPal", "CashApp", "Venmo", "Chime"];

const Withdraw = () => {
  const { user } = useAuth();
  const [method, setMethod] = useState("Crypto");
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!authCode) { toast.error("Authorization code required (contact support)"); return; }
    setLoading(true);
    const { error } = await supabase.from("withdrawals").insert({
      user_id: user.id, amount: parseFloat(amount), method, destination,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Withdrawal submitted. Pending review.");
    setAmount(""); setDestination(""); setAuthCode("");
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black mb-1">Withdraw Funds</h1>
      <p className="text-sm text-muted-foreground mb-6">Withdrawals require an authorization code from support.</p>
      <Card className="p-6 space-y-4">
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Method</Label>
            <select value={method} onChange={e => setMethod(e.target.value)} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
              {METHODS.map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Amount (USD)</Label>
            <Input type="number" min="1" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>{method === "Crypto" ? "Wallet Address" : "Account Details"}</Label>
            <Input value={destination} onChange={e => setDestination(e.target.value)} required />
          </div>
          <div className="rounded-lg border border-gold/30 bg-gold/5 p-3 flex gap-3">
            <ShieldAlert className="h-5 w-5 text-gold shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <strong className="text-foreground">Authorization required.</strong> Contact support to obtain your Level 1 code before withdrawing.
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Authorization Code</Label>
            <Input value={authCode} onChange={e => setAuthCode(e.target.value)} placeholder="XXXX-XXXX" required />
          </div>
          <Button variant="gold" type="submit" disabled={loading} className="w-full">
            {loading ? "Processing..." : "Request Withdrawal"}
          </Button>
        </form>
      </Card>
    </div>
  );
};
export default Withdraw;