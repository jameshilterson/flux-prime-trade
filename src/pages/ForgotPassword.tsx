import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password reset link sent. Check your email.");
  };

  return (
    <div className="min-h-screen bg-hero-gradient flex items-center">
      <div className="container max-w-md">
        <Card className="p-8 border-gold/20 shadow-elegant">
          <h1 className="text-2xl font-black">Reset your password</h1>
          <p className="text-sm text-muted-foreground mt-1">We'll email you a secure link.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <Button variant="gold" type="submit" disabled={loading} className="w-full">
              {loading ? "Sending..." : "Send reset link"}
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-4">
            <Link to="/login" className="text-gold">Back to login</Link>
          </p>
        </Card>
      </div>
    </div>
  );
};
export default ForgotPassword;