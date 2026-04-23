import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Upload } from "lucide-react";
import { toast } from "sonner";

const KYC = () => (
  <div className="max-w-2xl">
    <h1 className="text-2xl font-black mb-1">AML / KYC Verification</h1>
    <p className="text-sm text-muted-foreground mb-6">Verify your identity to unlock higher limits.</p>
    <Card className="p-6 space-y-4">
      <div className="rounded-lg border border-gold/30 bg-gold/5 p-3 flex gap-3 items-start">
        <ShieldCheck className="h-5 w-5 text-gold shrink-0 mt-0.5" />
        <div className="text-xs text-muted-foreground"><strong className="text-foreground">Status:</strong> Not verified. Submit a government-issued ID.</div>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); toast.success("KYC submitted for review"); }} className="space-y-4">
        <div className="space-y-1.5"><Label>Document Type</Label>
          <select className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
            <option>Passport</option><option>Driver License</option><option>National ID</option>
          </select>
        </div>
        <div className="space-y-1.5"><Label>Document Number</Label><Input required /></div>
        <div className="space-y-1.5"><Label>Upload Front</Label>
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center text-muted-foreground text-sm">
            <Upload className="h-6 w-6 mx-auto mb-2" /> Click to upload (JPG/PNG)
            <input type="file" className="hidden" />
          </div>
        </div>
        <Button variant="gold" type="submit" className="w-full">Submit for Review</Button>
      </form>
    </Card>
  </div>
);
export default KYC;