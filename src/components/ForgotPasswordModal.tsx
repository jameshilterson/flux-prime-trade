import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, KeyRound, Mail, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

const sendEmail = async (payload: { to: string; subject: string; html: string }) => {
  try {
    await fetch(`${SUPABASE_URL}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.warn("send-email failed", e);
  }
};

type Props = { open: boolean; onOpenChange: (o: boolean) => void };

export const ForgotPasswordModal = ({ open, onOpenChange }: Props) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [code, setCode] = useState("");
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");

  const reset = () => {
    setStep(1); setEmail(""); setFirstName(""); setCode(""); setPwd(""); setConfirm("");
  };
  const close = () => { reset(); onOpenChange(false); };

  // Step 1 — request code
  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("get_profile_by_email", { _email: email.trim() });
      if (error) throw error;
      const profile = Array.isArray(data) ? data[0] : data;
      if (!profile) { toast.error("No account found with that email address."); return; }
      setFirstName(profile.first_name || "");

      const newCode = String(Math.floor(100000 + Math.random() * 900000));
      const { error: issueErr } = await supabase.rpc("issue_password_reset_code", {
        _email: email.trim(),
        _code: newCode,
      });
      if (issueErr) throw issueErr;

      await sendEmail({
        to: email.trim(),
        subject: "Your Password Reset Code — CryptoVault",
        html: `
          <div style="font-family:Inter,Arial,sans-serif;background:#f7f7fb;padding:40px 0;">
            <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:14px;padding:32px;">
              <h1 style="margin:0 0 12px;color:#0e1530;">Hello ${profile.first_name || "there"},</h1>
              <p style="color:#475569;font-size:14px;">Your password reset code is:</p>
              <div style="font-size:42px;letter-spacing:10px;font-weight:900;color:#0e1530;text-align:center;padding:24px;border:2px dashed #e2e8f0;border-radius:12px;margin:18px 0;">
                ${newCode}
              </div>
              <p style="color:#64748b;font-size:13px;">This code expires in 15 minutes. If you did not request this, you can ignore this email.</p>
              <p style="color:#94a3b8;font-size:12px;margin-top:24px;">— CryptoVault Security</p>
            </div>
          </div>`,
      });

      toast.success("Code sent. Check your email.");
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally { setLoading(false); }
  };

  // Step 2 — verify code
  const submitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) { toast.error("Enter the 6-digit code."); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("verify_password_reset_code", {
        _email: email.trim(), _code: code,
      });
      if (error) throw error;
      if (!data) { toast.error("Invalid or expired code."); return; }
      setStep(3);
    } catch (err: any) {
      toast.error(err.message || "Verification failed");
    } finally { setLoading(false); }
  };

  // Step 3 — set new password
  const submitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd.length < 8) { toast.error("Password must be at least 8 characters."); return; }
    if (pwd !== confirm) { toast.error("Passwords do not match."); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc("complete_password_reset", {
        _email: email.trim(), _code: code, _new_password: pwd,
      });
      if (error) throw error;
      if (!data) { toast.error("Reset failed. Please request a new code."); return; }

      await sendEmail({
        to: email.trim(),
        subject: "Your password was changed — CryptoVault",
        html: `<p>Hi ${firstName || "there"},</p><p>Your CryptoVault password was just changed. If this wasn't you, contact support immediately.</p>`,
      });

      toast.success("Password changed successfully. You can now sign in.");
      close();
    } catch (err: any) {
      toast.error(err.message || "Reset failed");
    } finally { setLoading(false); }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto h-12 w-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-2">
            {step === 1 && <Mail className="h-5 w-5" />}
            {step === 2 && <KeyRound className="h-5 w-5" />}
            {step === 3 && <ShieldCheck className="h-5 w-5" />}
          </div>
          <DialogTitle className="text-center">
            {step === 1 && "Reset your password"}
            {step === 2 && "Enter verification code"}
            {step === 3 && "Choose a new password"}
          </DialogTitle>
          <p className="text-center text-sm text-muted-foreground">
            {step === 1 && "We'll email you a 6-digit code."}
            {step === 2 && `Code sent to ${email}`}
            {step === 3 && "Must be at least 8 characters."}
          </p>
        </DialogHeader>

        {step === 1 && (
          <form onSubmit={submitEmail} className="space-y-4">
            <div className="space-y-1.5">
              <Label>Email address</Label>
              <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send reset code
            </Button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={submitCode} className="space-y-4">
            <div className="space-y-1.5">
              <Label>6-digit code</Label>
              <Input inputMode="numeric" maxLength={6} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))} className="text-center text-xl tracking-[0.5em] font-bold" />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(1)} disabled={loading}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Verify code
              </Button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={submitNewPassword} className="space-y-4">
            <div className="space-y-1.5">
              <Label>New password</Label>
              <Input type="password" required value={pwd} onChange={e => setPwd(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Confirm password</Label>
              <Input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep(2)} disabled={loading}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button type="submit" className="flex-1" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Change password
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
