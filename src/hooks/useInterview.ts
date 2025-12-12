import { useState, useCallback } from 'react';
import { supabase, getBrandKnowledge } from '../lib/supabase';
import type { InterviewSession, BaseAnswers, BrandKnowledge } from '../lib/types';

interface UseInterviewOptions {
  clientId: string;
}

export function useInterview({ clientId }: UseInterviewOptions) {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [brandKnowledge, setBrandKnowledge] = useState<BrandKnowledge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const loadSession = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Load brand knowledge
      const knowledge = await getBrandKnowledge(clientId);
      setBrandKnowledge(knowledge);

      // Check for existing session
      const { data: existingSession, error: sessionError } = await supabase
        .from('interview_sessions')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (sessionError && sessionError.code !== 'PGRST116') {
        throw sessionError;
      }

      if (existingSession) {
        setSession(existingSession);
      } else {
        // Create new session
        const { data: newSession, error: createError } = await supabase
          .from('interview_sessions')
          .insert({
            client_id: clientId,
            status: 'base_questions',
          })
          .select()
          .single();

        if (createError) throw createError;
        setSession(newSession);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load session');
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  const submitBaseAnswers = useCallback(async (answers: BaseAnswers) => {
    if (!session) return;

    setGenerating(true);
    setError(null);

    try {
      // Update session with base answers and set status to analyzing
      await supabase
        .from('interview_sessions')
        .update({
          base_answers: answers,
          status: 'analyzing',
        })
        .eq('id', session.id);

      setSession(prev => prev ? { ...prev, base_answers: answers, status: 'analyzing' } : null);

      // Call edge function to generate follow-up questions
      const { data, error: fnError } = await supabase.functions.invoke('generate-followups', {
        body: {
          sessionId: session.id,
          answers,
          brandKnowledge: brandKnowledge.map(k => ({ title: k.title, content: k.content })),
        },
      });

      if (fnError) throw fnError;

      // Update session with follow-up questions
      await supabase
        .from('interview_sessions')
        .update({
          follow_up_questions: data.questions,
          status: 'follow_up',
        })
        .eq('id', session.id);

      setSession(prev => prev ? {
        ...prev,
        follow_up_questions: data.questions,
        status: 'follow_up',
      } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate follow-up questions');
      // Revert status
      await supabase
        .from('interview_sessions')
        .update({ status: 'base_questions' })
        .eq('id', session.id);
      setSession(prev => prev ? { ...prev, status: 'base_questions' } : null);
    } finally {
      setGenerating(false);
    }
  }, [session, brandKnowledge]);

  const submitFollowUpAnswers = useCallback(async (answers: Record<string, string>) => {
    if (!session) return;

    setGenerating(true);
    setError(null);

    try {
      // Update session with follow-up answers and set status to synthesizing
      await supabase
        .from('interview_sessions')
        .update({
          follow_up_answers: answers,
          status: 'synthesizing',
        })
        .eq('id', session.id);

      setSession(prev => prev ? { ...prev, follow_up_answers: answers, status: 'synthesizing' } : null);

      // Call edge function to synthesize profile
      const { data, error: fnError } = await supabase.functions.invoke('synthesize-profile', {
        body: {
          sessionId: session.id,
          baseAnswers: session.base_answers,
          followUpQuestions: session.follow_up_questions,
          followUpAnswers: answers,
          brandKnowledge: brandKnowledge.map(k => ({ title: k.title, content: k.content })),
        },
      });

      if (fnError) throw fnError;

      // Update session with profile and mark as completed
      await supabase
        .from('interview_sessions')
        .update({
          style_profile: data.profile,
          status: 'completed',
          completed_at: new Date().toISOString(),
        })
        .eq('id', session.id);

      // Create style profile record
      await supabase
        .from('style_profiles')
        .insert({
          client_id: clientId,
          session_id: session.id,
          raw_profile: data.profile,
          core_voice: data.coreVoice,
          linkedin_rules: data.linkedinRules,
          twitter_rules: data.twitterRules,
          email_rules: data.emailRules,
        });

      setSession(prev => prev ? {
        ...prev,
        style_profile: data.profile,
        status: 'completed',
        completed_at: new Date().toISOString(),
      } : null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to synthesize profile');
      // Revert status
      await supabase
        .from('interview_sessions')
        .update({ status: 'follow_up' })
        .eq('id', session.id);
      setSession(prev => prev ? { ...prev, status: 'follow_up' } : null);
    } finally {
      setGenerating(false);
    }
  }, [session, clientId, brandKnowledge]);

  const resetSession = useCallback(async () => {
    if (!session) return;

    setLoading(true);
    try {
      // Create a new session
      const { data: newSession, error: createError } = await supabase
        .from('interview_sessions')
        .insert({
          client_id: clientId,
          status: 'base_questions',
        })
        .select()
        .single();

      if (createError) throw createError;
      setSession(newSession);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset session');
    } finally {
      setLoading(false);
    }
  }, [session, clientId]);

  return {
    session,
    brandKnowledge,
    loading,
    error,
    generating,
    loadSession,
    submitBaseAnswers,
    submitFollowUpAnswers,
    resetSession,
  };
}

