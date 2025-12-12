import { createClient } from '@supabase/supabase-js';

// Note: Vite requires VITE_ prefix for client-side env vars
// In Vercel, set these as VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  const missing = [];
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
  if (!supabaseKey) missing.push('VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY)');
  throw new Error(`Missing Supabase environment variables: ${missing.join(', ')}. Please ensure these are set in your Vercel project settings.`);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getUserRole(userId: string) {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('getUserRole error:', error.message);
    return null;
  }
  
  return data?.role as 'admin' | 'client' | null;
}

export async function getClientByUserId(userId: string) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data;
}

export async function getBrandKnowledge(clientId: string) {
  const { data, error } = await supabase
    .from('brand_knowledge')
    .select('*')
    .eq('client_id', clientId)
    .order('created_at', { ascending: true });

  if (error) return [];
  return data;
}
