import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Copy } from "lucide-react";

const WALLETS = {
  BTC: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  ETH: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1",
  USDT: "TEXcRoAo9pH3KXqvNqU8M7C8q3F5z2bF4d",
};

const Deposit = () => {
  const { user } = useAuth();
  const [method, setMethod] = useState<keyof typeof WALLETS>("BTC");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    const { error } = await supabase.from("deposits").insert({
      user_id: user.id, amount: parseFloat(amount), method, wallet_address: WALLETS[method],
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Deposit submitted. Awaiting confirmation.");
    setAmount("");
  };

  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${WALLETS[method]}`;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black mb-1">Deposit Funds</h1>
      <p className="text-sm text-muted-foreground mb-6">Send crypto to the address below, then submit the form.</p>
      <Card className="p-6">
        <div className="grid grid-cols-3 gap-2 mb-6">
          {(Object.keys(WALLETS) as (keyof typeof WALLETS)[]).map(m => (
            <button key={m} onClick={() => setMethod(m)}
              className={`rounded-lg border-2 p-3 font-bold transition ${
                method === m ? "border-gold bg-gold/10 text-gold" : "border-border hover:border-gold/40"
              }`}>{m}</button>
          ))}
        </div>
        <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-muted/30">
          <img src={qr} alt={`${method} QR`} className="rounded-lg" width={180} height={180} />
          <div className="w-full">
            <Label className="text-xs">Wallet Address</Label>
            <div className="flex gap-2 mt-1">
              <Input readOnly value={WALLETS[method]} className="font-mono text-xs" />
              <Button type="button" variant="outline" size="icon" onClick={() => { navigator.clipboard.writeText(WALLETS[method]); toast.success("Copied"); }}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label>Amount (USD)</Label>
            <Input type="number" min="1" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required />
          </div>
          <Button variant="gold" type="submit" disabled={loading} className="w-full">
            {loading ? "Submitting..." : "Confirm Deposit"}
          </Button>
        </form>
      </Card>
    </div>
  );
};
export default Deposit;