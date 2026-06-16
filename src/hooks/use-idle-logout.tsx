import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const EVENTS = ["mousemove", "mousedown", "keydown", "touchstart", "scroll"] as const;

export const useIdleLogout = (timeoutMs = 30 * 60 * 1000) => {
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const expire = async () => {
      try { await supabase.auth.signOut({ scope: "global" }); } catch {}
      try {
        [localStorage, sessionStorage].forEach(s => {
          for (let i = s.length - 1; i >= 0; i--) {
            const k = s.key(i);
            if (k && (k.startsWith("sb-") || k.includes("supabase"))) s.removeItem(k);
          }
        });
      } catch {}
      window.location.href = "/login";
    };

    const reset = () => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(expire, timeoutMs);
    };

    EVENTS.forEach(e => window.addEventListener(e, reset, { passive: true }));
    reset();

    return () => {
      EVENTS.forEach(e => window.removeEventListener(e, reset));
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [timeoutMs]);
};
