import { useState, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { 
  LocalChatMessage, 
  InterviewSession,
  CategoryOfOneProfile,
} from '../lib/types';

interface UseCategoryOfOneChatOptions {
  clientId: string;
  clientName: string;
  sessionId?: string;
}

interface UseCategoryOfOneChatReturn {
  messages: LocalChatMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  isSynthesizing: boolean;
  error: string | null;
  session: InterviewSession | null;
  profile: CategoryOfOneProfile | null;
  initializeChat: () => Promise<void>;
  loadSession: (sessionId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  synthesizeProfile: () => Promise<void>;
  resetChat: () => Promise<void>;
  exportProfileAsMarkdown: () => void;
  exportBusinessProfile: () => void;
  exportCategoryOfOneDoc: () => void;
}

export function useCategoryOfOneChat({ 
  clientId, 
  clientName,
  sessionId: initialSessionId
}: UseCategoryOfOneChatOptions): UseCategoryOfOneChatReturn {
  const [messages, setMessages] = useState<LocalChatMessage[]>([]);
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [profile, setProfile] = useState<CategoryOfOneProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Helper to build authenticated headers for Edge Functions
  const getAuthHeaders = useCallback(async () => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey =
      import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

    const {
      data: { session: authSession },
    } = await supabase.auth.getSession();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      apikey: supabaseAnonKey,
    };

    if (authSession?.access_token) {
      headers.Authorization = `Bearer ${authSession.access_token}`;
    }

    return { supabaseUrl, headers };
  }, []);

  // Initialize or load existing chat session
  const initializeChat = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check for existing session with chat status
      const { data: existingSession, error: sessionError } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('client_id', clientId)
        .in('status', ['chatting', 'generating_profile', 'completed'])
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (sessionError && sessionError.code !== 'PGRST116') {
        throw sessionError;
      }

      let currentSession = existingSession;

      if (!currentSession) {
        // Create new session
        const { data: newSession, error: createError } = await supabase
          .from('interview_sessions')
          .insert({
            client_id: clientId,
            status: 'chatting',
          })
          .select()
          .single();

        if (createError) throw createError;
        currentSession = newSession;
      }

      setSession(currentSession);

      // Load existing messages if any
      if (currentSession) {
        const { data: chatMessages, error: messagesError } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', currentSession.id)
          .order('created_at', { ascending: true });

        if (messagesError) throw messagesError;

        if (chatMessages && chatMessages.length > 0) {
          setMessages(chatMessages.map(m => ({
            id: m.id,
            role: m.role,
            content: m.content,
          })));
        } else {
          // Start new conversation - get initial greeting from AI
          await startNewConversation(currentSession.id);
        }

        // Load profile if completed
        if (currentSession.status === 'completed') {
          const { data: existingProfile } = await supabase
            .from('category_of_one_profiles')
            .select('*')
            .eq('session_id', currentSession.id)
            .single();

          if (existingProfile) {
            setProfile(existingProfile);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize chat');
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  // Load an existing session by ID
  const loadSession = useCallback(async (sessionId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch the session
      const { data: existingSession, error: sessionError } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;
      if (!existingSession) throw new Error('Session not found');

      setSession(existingSession);

      // Load messages
      const { data: chatMessages, error: messagesError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      if (chatMessages) {
        setMessages(chatMessages.map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
        })));
      }

      // Load profile if completed
      if (existingSession.status === 'completed') {
        const { data: existingProfile } = await supabase
          .from('category_of_one_profiles')
          .select('*')
          .eq('session_id', sessionId)
          .single();

        if (existingProfile) {
          setProfile(existingProfile);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Start a new conversation with AI greeting
  const startNewConversation = async (sessionId: string) => {
    setIsStreaming(true);
    
    try {
      const { supabaseUrl, headers } = await getAuthHeaders();

      const response = await fetch(`${supabaseUrl}/functions/v1/category-of-one-chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          sessionId,
          messages: [],
          clientName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to start conversation');
      }

      // Handle streaming response
      const assistantMessageId = crypto.randomUUID();
      let fullContent = '';

      // Add empty assistant message that will be updated
      setMessages([{
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        isStreaming: true,
      }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullContent += parsed.content;
                  setMessages(prev => prev.map(m => 
                    m.id === assistantMessageId 
                      ? { ...m, content: fullContent }
                      : m
                  ));
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }
      }

      // Mark message as done streaming
      setMessages(prev => prev.map(m => 
        m.id === assistantMessageId 
          ? { ...m, isStreaming: false }
          : m
      ));

      // Save assistant message to database
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        role: 'assistant',
        content: fullContent,
      });

    } finally {
      setIsStreaming(false);
    }
  };

  // Send a user message and get AI response
  const sendMessage = useCallback(async (content: string) => {
    if (!session || isStreaming) return;

    setError(null);
    setIsStreaming(true);

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    // Add user message immediately
    const userMessageId = crypto.randomUUID();
    const userMessage: LocalChatMessage = {
      id: userMessageId,
      role: 'user',
      content,
    };

    setMessages(prev => [...prev, userMessage]);

    // Save user message to database
    await supabase.from('chat_messages').insert({
      session_id: session.id,
      role: 'user',
      content,
    });

    try {
      // Build messages for API (including the new user message)
      const apiMessages = [...messages, userMessage].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const { supabaseUrl, headers } = await getAuthHeaders();

      const response = await fetch(`${supabaseUrl}/functions/v1/category-of-one-chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          sessionId: session.id,
          messages: apiMessages,
          clientName,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      // Handle streaming response
      const assistantMessageId = crypto.randomUUID();
      let fullContent = '';

      // Add empty assistant message that will be updated
      setMessages(prev => [...prev, {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        isStreaming: true,
      }]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  fullContent += parsed.content;
                  setMessages(prev => prev.map(m => 
                    m.id === assistantMessageId 
                      ? { ...m, content: fullContent }
                      : m
                  ));
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }
      }

      // Mark message as done streaming
      setMessages(prev => prev.map(m => 
        m.id === assistantMessageId 
          ? { ...m, isStreaming: false }
          : m
      ));

      // Save assistant message to database
      await supabase.from('chat_messages').insert({
        session_id: session.id,
        role: 'assistant',
        content: fullContent,
      });

      // Check if synthesis is ready
      if (fullContent.includes('[SYNTHESIS_READY]')) {
        // Auto-trigger synthesis
        await synthesizeProfileInternal(session.id, [...messages, userMessage, {
          id: assistantMessageId,
          role: 'assistant',
          content: fullContent,
        }]);
      }

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsStreaming(false);
    }
  }, [session, messages, clientName, isStreaming]);

  // Internal function to synthesize profile
  const synthesizeProfileInternal = async (sessionId: string, chatMessages: LocalChatMessage[]) => {
    setIsSynthesizing(true);

    try {
      // Update session status
      await supabase
        .from('interview_sessions')
        .update({ status: 'generating_profile' })
        .eq('id', sessionId);

      setSession(prev => prev ? { ...prev, status: 'generating_profile' } : null);

      const { supabaseUrl, headers } = await getAuthHeaders();

      const response = await fetch(`${supabaseUrl}/functions/v1/synthesize-category-of-one`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          sessionId,
          messages: chatMessages.map(m => ({
            role: m.role,
            content: m.content,
          })),
          clientName,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to synthesize profile');
      }

      const data = await response.json();
      const profileData = data.profile;

      // Save profile to database
      const { data: savedProfile, error: saveError } = await supabase
        .from('category_of_one_profiles')
        .insert({
          client_id: clientId,
          session_id: sessionId,
          positioning_statement: profileData.positioning_statement,
          unique_differentiation: profileData.unique_differentiation,
          contrarian_position: profileData.contrarian_position,
          gap_they_fill: profileData.gap_they_fill,
          unique_methodology: profileData.unique_methodology,
          transformation: profileData.transformation,
          competitive_landscape: profileData.competitive_landscape,
          raw_profile: profileData.raw_profile,
          business_profile_md: profileData.business_profile_md,
          category_of_one_md: profileData.category_of_one_md,
        })
        .select()
        .single();

      if (saveError) throw saveError;

      // Update session status to completed
      await supabase
        .from('interview_sessions')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', sessionId);

      setSession(prev => prev ? { 
        ...prev, 
        status: 'completed',
        completed_at: new Date().toISOString(),
      } : null);

      setProfile(savedProfile);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to synthesize profile');
      // Revert session status
      await supabase
        .from('interview_sessions')
        .update({ status: 'chatting' })
        .eq('id', sessionId);
      setSession(prev => prev ? { ...prev, status: 'chatting' } : null);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Public function to manually trigger synthesis
  const synthesizeProfile = useCallback(async () => {
    if (!session) return;
    await synthesizeProfileInternal(session.id, messages);
  }, [session, messages, clientName, clientId]);

  // Reset and start a new chat
  const resetChat = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setMessages([]);
    setProfile(null);

    try {
      // Create new session
      const { data: newSession, error: createError } = await supabase
        .from('interview_sessions')
        .insert({
          client_id: clientId,
          status: 'chatting',
        })
        .select()
        .single();

      if (createError) throw createError;
      setSession(newSession);

      // Start new conversation
      await startNewConversation(newSession.id);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset chat');
    } finally {
      setIsLoading(false);
    }
  }, [clientId, clientName]);

  // Export profile as markdown file
  const exportProfileAsMarkdown = useCallback(() => {
    if (!profile?.raw_profile) return;

    const blob = new Blob([profile.raw_profile], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `category-of-one-full-${clientName.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [profile, clientName]);

  const exportBusinessProfile = useCallback(() => {
    if (!profile?.business_profile_md) return;

    const blob = new Blob([profile.business_profile_md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-profile-${clientName.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [profile, clientName]);

  const exportCategoryOfOneDoc = useCallback(() => {
    const content = profile?.category_of_one_md || profile?.raw_profile;
    if (!content) return;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `category-of-one-${clientName.toLowerCase().replace(/\s+/g, '-')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [profile, clientName]);

  return {
    messages,
    isLoading,
    isStreaming,
    isSynthesizing,
    error,
    session,
    profile,
    initializeChat,
    loadSession,
    sendMessage,
    synthesizeProfile,
    resetChat,
    exportProfileAsMarkdown,
    exportBusinessProfile,
    exportCategoryOfOneDoc,
  };
}

