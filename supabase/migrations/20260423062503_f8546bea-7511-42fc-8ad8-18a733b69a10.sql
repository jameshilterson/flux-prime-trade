-- Admin update/delete policies on deposits
CREATE POLICY "Admins update deposits" ON public.deposits FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete deposits" ON public.deposits FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Admin update/delete policies on withdrawals
CREATE POLICY "Admins update withdrawals" ON public.withdrawals FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete withdrawals" ON public.withdrawals FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Admin update on profiles (balance, account level, etc.)
CREATE POLICY "Admins update profiles" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- Admin manage user_roles
CREATE POLICY "Admins insert roles" ON public.user_roles FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete roles" ON public.user_roles FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- Helper: promote a user to admin by email (callable by existing admin only)
CREATE OR REPLACE FUNCTION public.promote_to_admin(_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _uid uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can promote users';
  END IF;
  SELECT id INTO _uid FROM public.profiles WHERE email = _email LIMIT 1;
  IF _uid IS NULL THEN RAISE EXCEPTION 'User not found'; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (_uid, 'admin')
  ON CONFLICT DO NOTHING;
END; $$;