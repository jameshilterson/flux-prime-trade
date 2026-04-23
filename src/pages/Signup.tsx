import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { COUNTRIES, CURRENCIES, ACCOUNT_TYPES } from "@/lib/constants";
import { LiveEarningsPopup } from "@/components/LiveEarningsPopup";
import { z } from "zod";

const schema = z.object({
  full_name: z.string().trim().min(2).max(100),
  username: z.string().trim().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers, underscore only"),
  email: z.string().trim().email().max(255),
  password: z.string().min(8, "Min 8 characters").max(72),
  confirm: z.string(),
  country: z.string().min(1, "Select a country"),
  gender: z.string().min(1, "Select gender"),
  phone: z.string().trim().min(5).max(20),
  account_type: z.string().min(1),
  preferred_currency: z.string().min(1),
}).refine(d => d.password === d.confirm, { path: ["confirm"], message: "Passwords don't match" });

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "", username: "", email: "", password: "", confirm: "",
    country: "", gender: "", phone: "", account_type: "crypto_mining", preferred_currency: "USD",
  });

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) { toast.error(parsed.error.issues[0].message); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: form.full_name, username: form.username, country: form.country,
          gender: form.gender, phone: form.phone, account_type: form.account_type,
          preferred_currency: form.preferred_currency,
        },
      },
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Account created! Welcome to CryptoVault.");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-hero-gradient relative">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="container relative max-w-2xl py-12">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-lg bg-gold-gradient flex items-center justify-center font-black text-midnight">C</div>
          <span className="font-bold text-lg text-white">CryptoVault</span>
        </Link>
        <Card className="p-6 md:p-8 border-gold/20 shadow-elegant">
          <h1 className="text-2xl md:text-3xl font-black">Create your account</h1>
          <p className="text-sm text-muted-foreground mt-1">Join 250,000+ investors earning passive income.</p>
          <form onSubmit={submit} className="grid sm:grid-cols-2 gap-4 mt-6">
            <Field label="Full Name"><Input value={form.full_name} onChange={set("full_name")} required /></Field>
            <Field label="Username"><Input value={form.username} onChange={set("username")} required /></Field>
            <Field label="Email"><Input type="email" value={form.email} onChange={set("email")} required /></Field>
            <Field label="Phone Number"><Input value={form.phone} onChange={set("phone")} required /></Field>
            <Field label="Country">
              <select value={form.country} onChange={set("country")} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" required>
                <option value="">Select country</option>
                {COUNTRIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Gender">
              <select value={form.gender} onChange={set("gender")} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm" required>
                <option value="">Select</option>
                <option>Male</option><option>Female</option><option>Other</option>
              </select>
            </Field>
            <Field label="Account Type">
              <select value={form.account_type} onChange={set("account_type")} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                {ACCOUNT_TYPES.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
              </select>
            </Field>
            <Field label="Preferred Currency">
              <select value={form.preferred_currency} onChange={set("preferred_currency")} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                {CURRENCIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Password"><Input type="password" value={form.password} onChange={set("password")} required /></Field>
            <Field label="Confirm Password"><Input type="password" value={form.confirm} onChange={set("confirm")} required /></Field>
            <div className="sm:col-span-2 flex items-center gap-2 text-sm">
              <Checkbox id="tos" defaultChecked />
              <label htmlFor="tos" className="text-muted-foreground">I agree to the <a className="text-gold underline">Terms & Conditions</a></label>
            </div>
            <Button type="submit" variant="gold" disabled={loading} className="sm:col-span-2 w-full">
              {loading ? "Creating..." : "Create Account"}
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-4">
            Already have an account? <Link to="/login" className="text-gold font-medium">Login</Link>
          </p>
        </Card>
      </div>
      <LiveEarningsPopup />
    </div>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1.5">
    <Label className="text-xs font-medium">{label}</Label>
    {children}
  </div>
);

export default Signup;