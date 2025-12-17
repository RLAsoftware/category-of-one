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
  // Get current user ID
  const { data: { user } } = await supabase.auth.getUser();
  
  const { data, error } = await supabase
    .from('llm_configs')
    .update({
      model: payload.model,
      chat_system_prompt: payload.chat_system_prompt,
      synthesis_system_prompt: payload.synthesis_system_prompt,
      updated_by: user?.id,
      updated_at: new Date().toISOString(),
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

// ============================================
// Session Management Functions
// ============================================

/**
 * Get all sessions for a client (non-deleted by default)
 */
export async function getClientSessions(clientId: string, includeDeleted: boolean = false) {
  let query = supabase
    .from('interview_sessions')
    .select('*')
    .eq('client_id', clientId)
    .eq('archived', false)
    .order('last_message_at', { ascending: false, nullsFirst: false });

  if (!includeDeleted) {
    query = query.is('deleted_at', null);
  }

  const { data, error } = await query;

  if (error) {
    console.error('getClientSessions error:', error.message);
    return [];
  }

  return data;
}

/**
 * Get soft-deleted sessions for Recently Deleted section
 */
export async function getDeletedSessions(clientId: string) {
  const { data, error } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('client_id', clientId)
    .not('deleted_at', 'is', null)
    .order('deleted_at', { ascending: false });

  if (error) {
    console.error('getDeletedSessions error:', error.message);
    return [];
  }

  return data;
}

/**
 * Search sessions by title or content
 */
export async function searchSessions(clientId: string, query: string) {
  if (!query.trim()) {
    return getClientSessions(clientId);
  }

  // Search in session titles
  const { data: sessions, error } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('client_id', clientId)
    .eq('archived', false)
    .is('deleted_at', null)
    .ilike('title', `%${query}%`)
    .order('last_message_at', { ascending: false, nullsFirst: false });

  if (error) {
    console.error('searchSessions error:', error.message);
    return [];
  }

  return sessions;
}

/**
 * Filter sessions by completion status
 */
export async function filterSessionsByStatus(clientId: string, statusFilter: 'all' | 'in_progress' | 'completed') {
  let query = supabase
    .from('interview_sessions')
    .select('*')
    .eq('client_id', clientId)
    .eq('archived', false)
    .is('deleted_at', null)
    .order('last_message_at', { ascending: false, nullsFirst: false });

  if (statusFilter === 'completed') {
    query = query.eq('status', 'completed');
  } else if (statusFilter === 'in_progress') {
    query = query.neq('status', 'completed');
  }

  const { data, error } = await query;

  if (error) {
    console.error('filterSessionsByStatus error:', error.message);
    return [];
  }

  return data;
}

/**
 * Get a specific session by ID with all messages
 */
export async function getSessionById(sessionId: string) {
  const { data: session, error: sessionError } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('id', sessionId)
    .single();

  if (sessionError) {
    console.error('getSessionById error:', sessionError.message);
    return null;
  }

  // Fetch messages for this session
  const { data: messages, error: messagesError } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true });

  if (messagesError) {
    console.error('getMessages error:', messagesError.message);
  }

  return {
    ...session,
    messages: messages || []
  };
}

/**
 * Get profile for a specific session
 */
export async function getProfileBySessionId(sessionId: string) {
  const { data, error } = await supabase
    .from('category_of_one_profiles')
    .select('*')
    .eq('session_id', sessionId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No profile found
      return null;
    }
    console.error('getProfileBySessionId error:', error.message);
    return null;
  }

  return data;
}

/**
 * Update session title (for inline editing)
 */
export async function updateSessionTitle(sessionId: string, title: string) {
  const { data, error } = await supabase
    .from('interview_sessions')
    .update({ title: title.trim() })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('updateSessionTitle error:', error.message);
    throw error;
  }

  return data;
}

/**
 * Soft delete a session (sets deleted_at timestamp)
 */
export async function softDeleteSession(sessionId: string) {
  const { data, error } = await supabase
    .from('interview_sessions')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('softDeleteSession error:', error.message);
    throw error;
  }

  return data;
}

/**
 * Restore a soft-deleted session
 */
export async function restoreSession(sessionId: string) {
  const { data, error } = await supabase
    .from('interview_sessions')
    .update({ deleted_at: null })
    .eq('id', sessionId)
    .select()
    .single();

  if (error) {
    console.error('restoreSession error:', error.message);
    throw error;
  }

  return data;
}

/**
 * Permanently delete a session (hard delete)
 */
export async function permanentlyDeleteSession(sessionId: string) {
  const { error } = await supabase
    .from('interview_sessions')
    .delete()
    .eq('id', sessionId);

  if (error) {
    console.error('permanentlyDeleteSession error:', error.message);
    throw error;
  }

  return true;
}

/**
 * Create a new session with auto-generated title
 */
export async function createSession(clientId: string) {
  const now = new Date();
  const title = `Interview - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  const { data, error } = await supabase
    .from('interview_sessions')
    .insert({
      client_id: clientId,
      status: 'chatting',
      title,
      last_message_at: now.toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('createSession error:', error.message);
    throw error;
  }

  return data;
}

/**
 * Update session activity timestamp
 */
export async function updateSessionActivity(sessionId: string) {
  const { error } = await supabase
    .from('interview_sessions')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', sessionId);

  if (error) {
    console.error('updateSessionActivity error:', error.message);
  }

  return !error;
}

/**
 * Get the latest completed profile for a client
 */
export async function getLatestProfileForClient(clientId: string) {
  const { data, error } = await supabase
    .from('category_of_one_profiles')
    .select('*, interview_sessions!inner(*)')
    .eq('client_id', clientId)
    .eq('interview_sessions.status', 'completed')
    .is('interview_sessions.deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No profile found
      return null;
    }
    console.error('getLatestProfileForClient error:', error.message);
    return null;
  }

  return data;
}

/**
 * Get count of messages in a session
 */
export async function getSessionMessageCount(sessionId: string) {
  const { count, error } = await supabase
    .from('chat_messages')
    .select('*', { count: 'exact', head: true })
    .eq('session_id', sessionId);

  if (error) {
    console.error('getSessionMessageCount error:', error.message);
    return 0;
  }

  return count || 0;
}

