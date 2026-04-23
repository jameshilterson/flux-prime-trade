
-- Roles enum
create type public.app_role as enum ('admin', 'user');
create type public.account_level as enum ('basic', 'veteran', 'ultimate', 'master', 'diamond');
create type public.account_type as enum ('crypto_mining', 'pro_trader', 'copy_trading', 'ai_trading');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  full_name text not null,
  email text not null,
  country text,
  gender text,
  phone text,
  account_type public.account_type default 'crypto_mining',
  preferred_currency text default 'USD',
  account_level public.account_level default 'basic',
  balance numeric default 0,
  profit numeric default 0,
  total_deposit numeric default 0,
  total_withdraw numeric default 0,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;

-- User roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique(user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- RLS profiles
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles for select using (public.has_role(auth.uid(), 'admin'));
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- RLS user_roles
create policy "Users view own roles" on public.user_roles for select using (auth.uid() = user_id);
create policy "Admins view all roles" on public.user_roles for select using (public.has_role(auth.uid(), 'admin'));

-- Lookup username -> email (for username login)
create or replace function public.get_email_by_username(_username text)
returns text language sql stable security definer set search_path = public as $$
  select email from public.profiles where username = _username limit 1
$$;

-- Auto profile from signup metadata
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, username, full_name, email, country, gender, phone, account_type, preferred_currency)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    new.raw_user_meta_data->>'country',
    new.raw_user_meta_data->>'gender',
    new.raw_user_meta_data->>'phone',
    coalesce((new.raw_user_meta_data->>'account_type')::public.account_type, 'crypto_mining'),
    coalesce(new.raw_user_meta_data->>'preferred_currency', 'USD')
  );
  insert into public.user_roles (user_id, role) values (new.id, 'user');
  return new;
end; $$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Deposits
create table public.deposits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  amount numeric not null,
  method text not null,
  wallet_address text,
  proof_url text,
  status text default 'pending',
  created_at timestamptz default now()
);
alter table public.deposits enable row level security;
create policy "Users view own deposits" on public.deposits for select using (auth.uid() = user_id);
create policy "Users insert own deposits" on public.deposits for insert with check (auth.uid() = user_id);
create policy "Admins view all deposits" on public.deposits for select using (public.has_role(auth.uid(), 'admin'));

-- Withdrawals
create table public.withdrawals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  amount numeric not null,
  method text not null,
  destination text,
  status text default 'pending',
  created_at timestamptz default now()
);
alter table public.withdrawals enable row level security;
create policy "Users view own withdrawals" on public.withdrawals for select using (auth.uid() = user_id);
create policy "Users insert own withdrawals" on public.withdrawals for insert with check (auth.uid() = user_id);
create policy "Admins view all withdrawals" on public.withdrawals for select using (public.has_role(auth.uid(), 'admin'));
