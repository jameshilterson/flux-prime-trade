
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS user_id uuid;

UPDATE public.profiles SET user_id = id WHERE user_id IS NULL;

CREATE OR REPLACE FUNCTION public.sync_profile_user_id()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.user_id IS NULL THEN NEW.user_id := NEW.id; END IF;
  IF NEW.user_id IS DISTINCT FROM NEW.id THEN NEW.id := NEW.user_id; END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS sync_profile_user_id_trg ON public.profiles;
CREATE TRIGGER sync_profile_user_id_trg
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_profile_user_id();

CREATE UNIQUE INDEX IF NOT EXISTS profiles_user_id_key ON public.profiles(user_id);
