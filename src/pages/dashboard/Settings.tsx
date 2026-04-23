import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

const Settings = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({ full_name: "", phone: "", country: "" });

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("full_name, phone, country").eq("id", user.id).maybeSingle()
      .then(({ data }) => data && setForm(data as any));
  }, [user]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const { error } = await supabase.from("profiles").update(form).eq("id", user.id);
    if (error) toast.error(error.message); else toast.success("Profile updated");
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-black mb-6">Settings</h1>
      <Card className="p-6">
        <form onSubmit={save} className="space-y-4">
          <div className="space-y-1.5"><Label>Full Name</Label>
            <Input value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} />
          </div>
          <div className="space-y-1.5"><Label>Phone</Label>
            <Input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          </div>
          <div className="space-y-1.5"><Label>Country</Label>
            <Input value={form.country} onChange={e => setForm({...form, country: e.target.value})} />
          </div>
          <Button variant="gold" type="submit" className="w-full">Save Changes</Button>
        </form>
      </Card>
    </div>
  );
};
export default Settings;