-- Function to check if an email is authorized (invited or already has account)
create or replace function check_email_authorized(user_email text)
returns boolean as $$
declare
  email_lower text;
begin
  email_lower := lower(trim(user_email));
  
  -- Check if email exists in clients table
  if exists (select 1 from clients where lower(email) = email_lower) then
    return true;
  end if;
  
  -- Check if email exists in admin_invites table
  if exists (select 1 from admin_invites where lower(email) = email_lower) then
    return true;
  end if;
  
  -- Check if user already exists in auth.users (for existing accounts)
  if exists (select 1 from auth.users where lower(email) = email_lower) then
    return true;
  end if;
  
  return false;
end;
$$ language plpgsql security definer;

