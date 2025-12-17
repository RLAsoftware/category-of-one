-- Allow anonymous users to check if their email exists for login validation
-- This is required because we validate emails BEFORE login, when users are anonymous

-- Allow anonymous users to check email in clients table
CREATE POLICY "Allow anon to check email in clients"
ON clients
FOR SELECT
TO anon
USING (true);

-- Allow anonymous users to check email in admin_invites table
CREATE POLICY "Allow anon to check email in admin_invites"
ON admin_invites
FOR SELECT
TO anon
USING (true);

