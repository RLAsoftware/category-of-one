-- Enforce unique, case-insensitive emails for admin invites and clients
-- and strengthen client/user role consistency.

-- 1) ADMIN INVITES: prevent duplicate admin invitations by email
-- -------------------------------------------------------------

-- Remove duplicate admin_invites rows (keep the earliest accepted invite,
-- then earliest created) before adding a unique index.
with ranked_invites as (
  select
    id,
    lower(email) as email_lower,
    accepted_at,
    created_at,
    row_number() over (
      partition by lower(email)
      order by
        -- Prefer accepted invites over pending
        case when accepted_at is not null then 0 else 1 end,
        created_at asc
    ) as rn
  from public.admin_invites
),
invites_to_delete as (
  select id
  from ranked_invites
  where rn > 1
)
delete from public.admin_invites ai
using invites_to_delete d
where ai.id = d.id;

-- Ensure email cannot be null
alter table public.admin_invites
  alter column email set not null;

-- Enforce case-insensitive uniqueness on admin invite emails
create unique index if not exists admin_invites_email_lower_key
  on public.admin_invites (lower(email));


-- 2) CLIENTS: prevent duplicate client records per email & user
-- -------------------------------------------------------------

-- Ensure client email is not null
alter table public.clients
  alter column email set not null;

-- Enforce case-insensitive uniqueness on client emails
create unique index if not exists clients_email_lower_key
  on public.clients (lower(email));

-- Ensure each user_id can only be associated with a single client row.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'clients_user_id_unique'
      and conrelid = 'public.clients'::regclass
  ) then
    alter table public.clients
      add constraint clients_user_id_unique unique (user_id);
  end if;
end $$;


