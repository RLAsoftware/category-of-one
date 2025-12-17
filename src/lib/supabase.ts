import { createClient } from '@supabase/supabase-js';
import type { LLMConfig } from './types';

// Note: Vite requires VITE_ prefix for client-side env vars
// In Vercel, set these as VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY;

// CRITICAL: Validate we're using the correct production Supabase project
const EXPECTED_SUPABASE_URL = 'https://oonsnlwzipwdnbicqysr.supabase.co';

if (!supabaseUrl || !supabaseKey) {
  const missing = [];
  if (!supabaseUrl) missing.push('VITE_SUPABASE_URL');
  if (!supabaseKey) missing.push('VITE_SUPABASE_PUBLISHABLE_KEY (or VITE_SUPABASE_ANON_KEY)');
  throw new Error(`Missing Supabase environment variables: ${missing.join(', ')}. Please ensure these are set in your Vercel project settings.`);
}

// Validate we're connected to the correct Supabase project
if (supabaseUrl !== EXPECTED_SUPABASE_URL) {
  throw new Error(
    `❌ WRONG SUPABASE PROJECT DETECTED!\n\n` +
    `Expected: ${EXPECTED_SUPABASE_URL}\n` +
    `Got: ${supabaseUrl}\n\n` +
    `Please update VITE_SUPABASE_URL in your environment variables.`
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);

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

export async function getLLMConfig(name: string = 'category_of_one'): Promise<LLMConfig | null> {
  const { data, error } = await supabase
    .from('llm_configs')
    .select('*')
    .eq('name', name)
    .single();

  if (error) {
    console.error('getLLMConfig error:', error.message);
    return null;
  }

  return data as LLMConfig;
}

export async function updateLLMConfig(
  name: string,
  payload: Pick<LLMConfig, 'model' | 'chat_system_prompt' | 'synthesis_system_prompt'>
): Promise<LLMConfig | null> {
  const { data, error } = await supabase
    .from('llm_configs')
    .update({
      model: payload.model,
      chat_system_prompt: payload.chat_system_prompt,
      synthesis_system_prompt: payload.synthesis_system_prompt,
    })
    .eq('name', name)
    .select('*')
    .single();

  if (error) {
    console.error('updateLLMConfig error:', error.message);
    throw error;
  }

  return data as LLMConfig;
}

export async function isEmailInvited(email: string): Promise<boolean> {
  const normalizedEmail = email.toLowerCase().trim();
  
  // Check clients table
  const { data: clientData, error: clientError } = await supabase
    .from('clients')
    .select('email')
    .ilike('email', normalizedEmail)
    .maybeSingle();
  
  if (clientError && clientError.code !== 'PGRST116') {
    console.error('Error checking clients table:', clientError);
  }
  
  if (clientData) {
    return true;
  }
  
  // Check admin_invites table
  const { data: adminData, error: adminError } = await supabase
    .from('admin_invites')
    .select('email')
    .ilike('email', normalizedEmail)
    .maybeSingle();
  
  if (adminError && adminError.code !== 'PGRST116') {
    console.error('Error checking admin_invites table:', adminError);
  }
  
  if (adminData) {
    return true;
  }
  
  return false;
}

