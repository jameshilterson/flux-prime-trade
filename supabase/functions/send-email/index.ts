// Generic transactional email sender used by the manual forgot-password flow.
// Tries Resend (if RESEND_API_KEY is set via the Resend connector or as a project secret).
// If no provider is configured, logs the email and returns success so the
// forgot-password flow continues to work in development.

import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

interface Payload { to: string; subject: string; html: string; from?: string }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const { to, subject, html, from } = (await req.json()) as Payload;
    if (!to || !subject || !html) {
      return new Response(JSON.stringify({ error: "Missing to/subject/html" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const sender = from || "CryptoVault <onboarding@resend.dev>";

    if (RESEND_API_KEY && LOVABLE_API_KEY) {
      // Via Lovable connector gateway
      const r = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "X-Connection-Api-Key": RESEND_API_KEY,
        },
        body: JSON.stringify({ from: sender, to: [to], subject, html }),
      });
      const body = await r.json().catch(() => ({}));
      if (!r.ok) {
        console.error("Resend gateway error", r.status, body);
        return new Response(JSON.stringify({ error: "send failed", details: body }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      return new Response(JSON.stringify({ ok: true, id: body?.id }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fallback: no provider configured — log and pretend success.
    console.log("[send-email] (no provider) ->", { to, subject });
    console.log("[send-email] html:", html);
    return new Response(JSON.stringify({ ok: true, dryRun: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-email error", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
