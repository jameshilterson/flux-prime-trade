import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";
import { Copy, Upload, CheckCircle2, Loader2 } from "lucide-react";
import { CURRENCIES } from "@/lib/currencies";

const WALLETS = {
  BTC: { addr: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", color: "#F7931A" },
  ETH: { addr: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb1", color: "#627EEA" },
  USDT: { addr: "TEXcRoAo9pH3KXqvNqU8M7C8q3F5z2bF4d", color: "#26A17B" },
} as const;

type Method = keyof typeof WALLETS;

const Deposit = () => {
  const { user } = useAuth();
  const [method, setMethod] = useState<Method>("BTC");
  const [amount, setAmount] = useState("");
  const [proof, setProof] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currency, setCurrency] = useState("USD");

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("preferred_currency").eq("id", user.id).maybeSingle()
      .then(({ data }) => data?.preferred_currency && setCurrency(data.preferred_currency));
  }, [user]);

  const symbol = CURRENCIES.find(c => c.code === currency)?.symbol ?? currency;

  const onFile = (f: File | null) => {
    if (f && f.size > 5 * 1024 * 1024) { toast.error("File exceeds 5MB"); return; }
    setProof(f);
    if (f && f.type.startsWith("image/")) {
      const r = new FileReader();
      r.onload = () => setProofPreview(r.result as string);
      r.readAsDataURL(f);
    } else { setProofPreview(null); }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!proof) return toast.error("Please upload proof of payment");
    setLoading(true);
    const { error } = await supabase.from("deposits").insert({
      user_id: user.id, amount: parseFloat(amount), method, wallet_address: WALLETS[method].addr,
      proof_url: proofPreview ?? proof.name,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Deposit submitted. Awaiting confirmation.");
    setAmount(""); setProof(null); setProofPreview(null);
  };

  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${WALLETS[method].addr}`;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black mb-1 text-white">Deposit Funds</h1>
      <p className="text-sm text-white/70 mb-6">Send crypto to the address below, then submit proof of payment.</p>
      <Card className="p-6">
        <div className="grid grid-cols-3 gap-2 mb-6">
          {(Object.keys(WALLETS) as Method[]).map(m => {
            const active = method === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className="rounded-lg border-2 p-3 font-bold transition text-white"
                style={{
                  borderColor: active ? WALLETS[m].color : "rgba(255,255,255,0.15)",
                  backgroundColor: active ? `${WALLETS[m].color}22` : "transparent",
                  color: active ? WALLETS[m].color : "#fff",
                }}
              >{m}</button>
            );
          })}
        </div>
        <div className="flex flex-col items-center gap-4 p-6 rounded-lg bg-muted/30">
          <img src={qr} alt={`${method} QR`} className="rounded-lg bg-white p-2" width={180} height={180} />
          <div className="w-full">
            <Label className="text-xs">Wallet Address</Label>
            <div className="flex gap-2 mt-1">
              <Input readOnly value={WALLETS[method].addr} className="font-mono text-xs" />
              <Button type="button" variant="outline" size="icon"
                onClick={() => { navigator.clipboard.writeText(WALLETS[method].addr); toast.success("Copied"); }}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="space-y-1.5">
            <Label>Amount ({currency})</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 text-sm">{symbol}</span>
              <Input type="number" min="1" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} required className="pl-8" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Proof of Payment</Label>
            <label className="block cursor-pointer border-2 border-dashed border-border rounded-lg p-6 text-center text-sm hover:border-primary/60 transition">
              {proof ? (
                <span className="flex items-center justify-center gap-2 text-primary"><CheckCircle2 className="h-5 w-5" />{proof.name}</span>
              ) : (
                <span className="flex flex-col items-center text-muted-foreground"><Upload className="h-6 w-6 mb-2" />Click to upload (JPG/PNG/PDF, max 5MB)</span>
              )}
              <input type="file" accept="image/*,application/pdf" className="hidden" onChange={e => onFile(e.target.files?.[0] ?? null)} />
            </label>
            {proofPreview && <img src={proofPreview} alt="proof preview" className="mt-2 max-h-48 rounded-lg border border-border" />}
          </div>
          <Button variant="gold" type="submit" disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Submitting..." : "Confirm Deposit"}
          </Button>
        </form>
      </Card>
    </div>
  );
};
export default Deposit;
