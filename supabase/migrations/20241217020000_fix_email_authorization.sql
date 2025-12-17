-- Fix email authorization to properly check for roles, not just auth.users existence
create or replace function check_email_authorized(user_email text)
returns boolean as $$
declare
  email_lower text;
begin
  email_lower := lower(trim(user_email));
  
  -- Check if email exists in clients table (invited or active clients)
  if exists (select 1 from clients where lower(email) = email_lower) then
    return true;
  end if;
  
  -- Check if email exists in admin_invites table  
  if exists (select 1 from admin_invites where lower(email) = email_lower) then
    return true;
  end if;
  
  -- Check if user has an active role (for existing users)
  -- This properly handles users who already signed up
  -- KEY FIX: Join with user_roles to ensure they have a role, not just exist in auth.users
  if exists (
    select 1 
    from auth.users u
    inner join user_roles ur on ur.user_id = u.id
    where lower(u.email) = email_lower
  ) then
    return true;
  end if;
  
  return false;
end;
$$ language plpgsql security definer;

-- Function to delete a client and their associated data
create or replace function delete_client_and_user(client_id_param uuid)
returns void as $$
declare
  user_id_val uuid;
begin
  -- Get the user_id if it exists
  select user_id into user_id_val from clients where id = client_id_param;
  
  -- Delete user_role if it exists
  if user_id_val is not null then
    delete from user_roles where user_id = user_id_val;
    -- Delete from auth.users (this will cascade to related tables)
    delete from auth.users where id = user_id_val;
  end if;
  
  -- Delete client record (cascades to brand_knowledge, interview_sessions, style_profiles)
  delete from clients where id = client_id_param;
end;
$$ language plpgsql security definer;

