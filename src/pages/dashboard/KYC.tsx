import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

type DocType = "Passport" | "National ID" | "Driver License";

const FileField = ({ label, value, onChange }: { label: string; value: File | null; onChange: (f: File | null) => void }) => (
  <div className="space-y-1.5">
    <Label>{label}</Label>
    <label className="block cursor-pointer border-2 border-dashed border-border rounded-lg p-6 text-center text-sm hover:border-primary/60 transition">
      {value ? (
        <span className="flex items-center justify-center gap-2 text-primary"><CheckCircle2 className="h-5 w-5" />{value.name}</span>
      ) : (
        <span className="flex flex-col items-center text-muted-foreground"><Upload className="h-6 w-6 mb-2" />Click to upload (JPG/PNG/PDF, max 5MB)</span>
      )}
      <input
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={e => {
          const f = e.target.files?.[0] ?? null;
          if (f && f.size > 5 * 1024 * 1024) { toast.error("File exceeds 5MB"); return; }
          onChange(f);
        }}
      />
    </label>
  </div>
);

const KYC = () => {
  const [docType, setDocType] = useState<DocType>("Passport");
  const [docNumber, setDocNumber] = useState("");
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front) return toast.error("ID Front is required");
    if (docType !== "Passport" && !back) return toast.error("ID Back is required");
    if (!selfie) return toast.error("Selfie is required");
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    toast.success("KYC submitted for review");
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-black mb-1 text-white">AML / KYC Verification</h1>
      <p className="text-sm text-white/70 mb-6">Verify your identity to unlock higher limits.</p>
      <Card className="p-6 space-y-4">
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 flex gap-3 items-start">
          <ShieldCheck className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs text-white/80"><strong className="text-white">Status:</strong> Not verified. Submit a government-issued ID.</div>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Document Type</Label>
            <select
              value={docType}
              onChange={e => setDocType(e.target.value as DocType)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm text-white"
            >
              <option>Passport</option>
              <option>National ID</option>
              <option>Driver License</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Document Number</Label>
            <Input value={docNumber} onChange={e => setDocNumber(e.target.value)} required />
          </div>
          <FileField label="ID Front" value={front} onChange={setFront} />
          {docType !== "Passport" && <FileField label="ID Back" value={back} onChange={setBack} />}
          <FileField label="Selfie" value={selfie} onChange={setSelfie} />
          <Button type="submit" disabled={loading} className="w-full bg-primary text-white hover:bg-[#00B8E0]">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Submitting..." : "Submit for Review"}
          </Button>
        </form>
      </Card>
    </div>
  );
};
export default KYC;
