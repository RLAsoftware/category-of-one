-- Update the handle_new_user function to prevent unauthorized signups
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
  
  -- If we get here, the user is not authorized
  -- Delete the unauthorized user immediately
  delete from auth.users where id = new.id;
  
  -- Raise an exception to prevent the user from being created
  raise exception 'Unauthorized signup attempt. Please contact an administrator for access.';
end;
$$ language plpgsql security definer;

