import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [pwd, setPwd] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.location.hash.includes("type=recovery")) setReady(true);
    else setReady(true);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: pwd });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated.");
    navigate("/login");
  };

  if (!ready) return null;
  return (
    <div className="min-h-screen bg-hero-gradient flex items-center">
      <div className="container max-w-md">
        <Card className="p-8 border-gold/20 shadow-elegant">
          <h1 className="text-2xl font-black">Set a new password</h1>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div className="space-y-1.5">
              <Label>New password</Label>
              <Input type="password" value={pwd} onChange={e => setPwd(e.target.value)} minLength={8} required />
            </div>
            <Button variant="gold" type="submit" disabled={loading} className="w-full">
              {loading ? "Updating..." : "Update password"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
export default ResetPassword;