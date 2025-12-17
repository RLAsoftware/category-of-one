-- Create a function to auto-activate clients when they first log in
-- This runs with elevated privileges to bypass RLS

CREATE OR REPLACE FUNCTION public.auto_activate_client(
  p_user_id UUID,
  p_email TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER -- Run with elevated privileges
SET search_path = public
AS $$
DECLARE
  v_client RECORD;
  v_result JSON;
BEGIN
  -- Find client by email (case-insensitive)
  SELECT * INTO v_client
  FROM public.clients
  WHERE LOWER(email) = LOWER(p_email)
  LIMIT 1;

  -- If no matching client found, return error
  IF v_client IS NULL THEN
    RETURN json_build_object(
      'success', false,
      'error', 'No client invitation found for this email'
    );
  END IF;

  -- Check if client is already activated
  IF v_client.user_id IS NOT NULL THEN
    RETURN json_build_object(
      'success', true,
      'client_id', v_client.id,
      'message', 'Client already activated'
    );
  END IF;

  -- Link auth user to client record
  UPDATE public.clients
  SET user_id = p_user_id
  WHERE id = v_client.id;

  -- Create user_roles entry
  INSERT INTO public.user_roles (user_id, role)
  VALUES (p_user_id, 'client')
  ON CONFLICT (user_id) DO NOTHING;

  -- Return success with client_id
  RETURN json_build_object(
    'success', true,
    'client_id', v_client.id,
    'message', 'Client activated successfully'
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN json_build_object(
      'success', false,
      'error', SQLERRM
    );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.auto_activate_client(UUID, TEXT) TO authenticated;

-- Add comment
COMMENT ON FUNCTION public.auto_activate_client IS 'Auto-activates a client when they first authenticate via magic link or password';

