
-- 1) Automatic balance/deposit adjustments based on transaction status
CREATE OR REPLACE FUNCTION public.apply_transaction_balance_changes()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  ded_old boolean := false;
  ded_new boolean := false;
  add_old boolean := false;
  add_new boolean := false;
BEGIN
  IF NEW.type = 'withdrawal' THEN
    ded_new := lower(coalesce(NEW.status,'')) IN ('pending','awaiting_code','pending_review','approved');
    IF TG_OP = 'INSERT' THEN
      IF ded_new THEN
        UPDATE public.profiles
           SET total_balance = COALESCE(total_balance,0) - NEW.amount
         WHERE user_id = NEW.user_id;
      END IF;
    ELSIF TG_OP = 'UPDATE' THEN
      ded_old := lower(coalesce(OLD.status,'')) IN ('pending','awaiting_code','pending_review','approved');
      IF ded_old AND NOT ded_new THEN
        UPDATE public.profiles
           SET total_balance = COALESCE(total_balance,0) + OLD.amount
         WHERE user_id = NEW.user_id;
        IF lower(NEW.status) = 'approved' THEN
          UPDATE public.profiles
             SET withdrawal = COALESCE(withdrawal,0) + NEW.amount,
                 total_balance = COALESCE(total_balance,0) - NEW.amount
           WHERE user_id = NEW.user_id;
        END IF;
      ELSIF NOT ded_old AND ded_new THEN
        UPDATE public.profiles
           SET total_balance = COALESCE(total_balance,0) - NEW.amount
         WHERE user_id = NEW.user_id;
      END IF;
    END IF;
  ELSIF NEW.type = 'deposit' THEN
    add_new := lower(coalesce(NEW.status,'')) = 'approved';
    IF TG_OP = 'INSERT' AND add_new THEN
      UPDATE public.profiles
         SET total_balance = COALESCE(total_balance,0) + NEW.amount,
             deposit = COALESCE(deposit,0) + NEW.amount
       WHERE user_id = NEW.user_id;
    ELSIF TG_OP = 'UPDATE' THEN
      add_old := lower(coalesce(OLD.status,'')) = 'approved';
      IF add_new AND NOT add_old THEN
        UPDATE public.profiles
           SET total_balance = COALESCE(total_balance,0) + NEW.amount,
               deposit = COALESCE(deposit,0) + NEW.amount
         WHERE user_id = NEW.user_id;
      ELSIF add_old AND NOT add_new THEN
        UPDATE public.profiles
           SET total_balance = COALESCE(total_balance,0) - OLD.amount,
               deposit = GREATEST(COALESCE(deposit,0) - OLD.amount, 0)
         WHERE user_id = NEW.user_id;
      END IF;
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_apply_tx_balance ON public.transactions;
CREATE TRIGGER trg_apply_tx_balance
AFTER INSERT OR UPDATE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.apply_transaction_balance_changes();

-- 2) When admin inserts a new withdrawal code, flip existing pending withdrawals to awaiting_code
CREATE OR REPLACE FUNCTION public.flag_pending_withdrawals_on_new_code()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.transactions
     SET status = 'awaiting_code'
   WHERE user_id = NEW.user_id
     AND type = 'withdrawal'
     AND lower(coalesce(status,'')) = 'pending';
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_flag_pending_wd ON public.account_withdrawal_codes;
CREATE TRIGGER trg_flag_pending_wd
AFTER INSERT ON public.account_withdrawal_codes
FOR EACH ROW EXECUTE FUNCTION public.flag_pending_withdrawals_on_new_code();

-- 3) Enable realtime on profiles + transactions
ALTER TABLE public.profiles REPLICA IDENTITY FULL;
ALTER TABLE public.transactions REPLICA IDENTITY FULL;
DO $$ BEGIN
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles; EXCEPTION WHEN duplicate_object THEN NULL; END;
  BEGIN ALTER PUBLICATION supabase_realtime ADD TABLE public.transactions; EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;
