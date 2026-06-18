
-- Add assigned_expert_id column on profiles (canonical), keep in sync with legacy assigned_trader_id
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS assigned_expert_id text;

-- Backfill from existing assigned_trader_id
UPDATE public.profiles
   SET assigned_expert_id = assigned_trader_id::text
 WHERE assigned_expert_id IS NULL AND assigned_trader_id IS NOT NULL;

-- Keep both columns in sync via trigger (both directions)
CREATE OR REPLACE FUNCTION public.sync_assigned_expert()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.assigned_expert_id IS NULL AND NEW.assigned_trader_id IS NOT NULL THEN
      NEW.assigned_expert_id := NEW.assigned_trader_id::text;
    ELSIF NEW.assigned_trader_id IS NULL AND NEW.assigned_expert_id IS NOT NULL THEN
      BEGIN NEW.assigned_trader_id := NEW.assigned_expert_id::uuid; EXCEPTION WHEN OTHERS THEN NULL; END;
    END IF;
    RETURN NEW;
  END IF;
  IF NEW.assigned_expert_id IS DISTINCT FROM OLD.assigned_expert_id THEN
    BEGIN NEW.assigned_trader_id := NEW.assigned_expert_id::uuid; EXCEPTION WHEN OTHERS THEN NULL; END;
  ELSIF NEW.assigned_trader_id IS DISTINCT FROM OLD.assigned_trader_id THEN
    NEW.assigned_expert_id := NEW.assigned_trader_id::text;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS sync_assigned_expert_trg ON public.profiles;
CREATE TRIGGER sync_assigned_expert_trg
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_assigned_expert();
