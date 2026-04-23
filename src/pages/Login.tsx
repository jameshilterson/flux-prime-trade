import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { LiveEarningsPopup } from "@/components/LiveEarningsPopup";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let email = identifier.trim();
    if (!email.includes("@")) {
      const { data } = await supabase.rpc("get_email_by_username", { _username: email });
      if (!data) { setLoading(false); toast.error("User not found"); return; }
      email = data as string;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-hero-gradient relative flex items-center">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="container relative max-w-md py-12">
        <Link to="/" className="inline-flex items-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-lg bg-gold-gradient flex items-center justify-center font-black text-midnight">C</div>
          <span className="font-bold text-lg text-white">CryptoVault</span>
        </Link>
        <Card className="p-6 md:p-8 border-gold/20 shadow-elegant">
          <h1 className="text-2xl md:text-3xl font-black">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">Login with your email or username.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Email or Username</Label>
              <Input value={identifier} onChange={e => setIdentifier(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Password</Label>
              <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox defaultChecked /> Remember me
              </label>
              <Link to="/forgot-password" className="text-sm text-gold">Forgot?</Link>
            </div>
            <Button type="submit" variant="gold" disabled={loading} className="w-full">
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-4">
            New here? <Link to="/signup" className="text-gold font-medium">Create an account</Link>
          </p>
        </Card>
      </div>
      <LiveEarningsPopup />
    </div>
  );
};

export default Login;