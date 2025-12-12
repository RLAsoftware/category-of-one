-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User roles (admin vs client)
create table user_roles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade unique not null,
  role text not null check (role in ('admin', 'client')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Admin invites (for inviting new admins)
create table admin_invites (
  id uuid primary key default uuid_generate_v4(),
  email text not null,
  invited_by uuid references auth.users on delete set null,
  accepted_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Clients table (created by admins)
create table clients (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete set null,
  name text not null,
  email text not null,
  company text,
  invite_token text unique,
  invite_sent_at timestamp with time zone,
  created_by uuid references auth.users on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Brand knowledge files (markdown context per client)
create table brand_knowledge (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients on delete cascade not null,
  title text not null,
  content text not null,
  created_by uuid references auth.users on delete set null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Interview sessions
create table interview_sessions (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients on delete cascade not null,
  status text not null default 'base_questions' check (status in ('base_questions', 'analyzing', 'follow_up', 'synthesizing', 'completed')),
  base_answers jsonb,
  follow_up_questions jsonb,
  follow_up_answers jsonb,
  style_profile text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone
);

-- Style profiles (the final output)
create table style_profiles (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid references clients on delete cascade not null,
  session_id uuid references interview_sessions on delete cascade not null,
  core_voice text,
  linkedin_rules text,
  twitter_rules text,
  email_rules text,
  raw_profile text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security
alter table user_roles enable row level security;
alter table admin_invites enable row level security;
alter table clients enable row level security;
alter table brand_knowledge enable row level security;
alter table interview_sessions enable row level security;
alter table style_profiles enable row level security;

-- RLS Policies

-- user_roles: Users can read their own role
create policy "Users can read own role" on user_roles
  for select using (auth.uid() = user_id);

-- user_roles: Admins can read all roles
create policy "Admins can read all roles" on user_roles
  for select using (
    exists (select 1 from user_roles where user_id = auth.uid() and role = 'admin')
  );

-- admin_invites: Admins can manage invites
create policy "Admins can manage invites" on admin_invites
  for all using (
    exists (select 1 from user_roles where user_id = auth.uid() and role = 'admin')
  );

-- clients: Admins can manage all clients
create policy "Admins can manage clients" on clients
  for all using (
    exists (select 1 from user_roles where user_id = auth.uid() and role = 'admin')
  );

-- clients: Clients can read their own record
create policy "Clients can read own record" on clients
  for select using (user_id = auth.uid());

-- brand_knowledge: Admins can manage all brand knowledge
create policy "Admins can manage brand knowledge" on brand_knowledge
  for all using (
    exists (select 1 from user_roles where user_id = auth.uid() and role = 'admin')
  );

-- interview_sessions: Admins can manage all sessions
create policy "Admins can manage sessions" on interview_sessions
  for all using (
    exists (select 1 from user_roles where user_id = auth.uid() and role = 'admin')
  );

-- interview_sessions: Clients can manage their own sessions
create policy "Clients can manage own sessions" on interview_sessions
  for all using (
    client_id in (select id from clients where user_id = auth.uid())
  );

-- style_profiles: Admins can manage all profiles
create policy "Admins can manage profiles" on style_profiles
  for all using (
    exists (select 1 from user_roles where user_id = auth.uid() and role = 'admin')
  );

-- style_profiles: Clients can read their own profiles
create policy "Clients can read own profiles" on style_profiles
  for select using (
    client_id in (select id from clients where user_id = auth.uid())
  );

-- Create indexes for performance
create index idx_user_roles_user_id on user_roles(user_id);
create index idx_clients_user_id on clients(user_id);
create index idx_clients_email on clients(email);
create index idx_clients_invite_token on clients(invite_token);
create index idx_brand_knowledge_client_id on brand_knowledge(client_id);
create index idx_interview_sessions_client_id on interview_sessions(client_id);
create index idx_style_profiles_client_id on style_profiles(client_id);

-- Function to auto-create user role when a user signs up via invite
create or replace function handle_new_user()
returns trigger as $$
declare
  client_record record;
  admin_invite_record record;
begin
  -- Check if this email matches a client invite
  select * into client_record from clients where email = new.email and user_id is null;
  
  if found then
    -- Link user to client record
    update clients set user_id = new.id where id = client_record.id;
    -- Create client role
    insert into user_roles (user_id, role) values (new.id, 'client');
    return new;
  end if;
  
  -- Check if this email matches an admin invite
  select * into admin_invite_record from admin_invites where email = new.email and accepted_at is null;
  
  if found then
    -- Mark invite as accepted
    update admin_invites set accepted_at = now() where id = admin_invite_record.id;
    -- Create admin role
    insert into user_roles (user_id, role) values (new.id, 'admin');
    return new;
  end if;
  
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

