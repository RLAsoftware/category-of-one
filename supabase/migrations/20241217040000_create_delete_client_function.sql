-- Function to delete a client and their associated data
CREATE OR REPLACE FUNCTION public.delete_client_and_user(client_id_param uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_id_val uuid;
BEGIN
  -- Get the user_id if it exists
  SELECT user_id INTO user_id_val FROM clients WHERE id = client_id_param;
  
  -- Delete user_role if it exists
  IF user_id_val IS NOT NULL THEN
    DELETE FROM user_roles WHERE user_id = user_id_val;
    -- Delete from auth.users (this will cascade to related tables)
    DELETE FROM auth.users WHERE id = user_id_val;
  END IF;
  
  -- Delete client record (cascades to brand_knowledge, interview_sessions, style_profiles)
  DELETE FROM clients WHERE id = client_id_param;
END;
$$;

-- Grant execute permissions to authenticated users (admins)
GRANT EXECUTE ON FUNCTION public.delete_client_and_user(uuid) TO authenticated;

