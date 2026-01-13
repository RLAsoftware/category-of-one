import { useState, useEffect, useCallback } from 'react';
import { supabase, getClientSessions, getDeletedSessions, getLatestProfileForClient, softDeleteSession, restoreSession } from '../lib/supabase';
import type { InterviewSession, CategoryOfOneProfile } from '../lib/types';

interface UseDashboardOptions {
  clientId: string;
}

export function useDashboard({ clientId }: UseDashboardOptions) {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [deletedSessions, setDeletedSessions] = useState<InterviewSession[]>([]);
  const [latestProfile, setLatestProfile] = useState<CategoryOfOneProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasInProgressSession, setHasInProgressSession] = useState(false);
  const [hasCompletedSession, setHasCompletedSession] = useState(false);

  // Fetch all sessions (does not control loading state - that's handled by fetchAllData)
  const fetchSessions = useCallback(async () => {
    if (!clientId) {
      return;
    }

    try {
      const sessionData = await getClientSessions(clientId);
      setSessions(sessionData);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setSessions([]);
    }
  }, [clientId]);

  // Fetch deleted sessions for "Recently Deleted" section
  const fetchDeletedSessions = useCallback(async () => {
    if (!clientId) return;
    
    try {
      const deletedData = await getDeletedSessions(clientId);
      setDeletedSessions(deletedData);
    } catch (error) {
      console.error('Error fetching deleted sessions:', error);
      setDeletedSessions([]);
    }
  }, [clientId]);

  // Fetch latest completed profile
  const fetchLatestProfile = useCallback(async () => {
    if (!clientId) return;

    try {
      const profileData = await getLatestProfileForClient(clientId);
      setLatestProfile(profileData);
    } catch (error) {
      console.error('Error fetching latest profile:', error);
      setLatestProfile(null);
    }
  }, [clientId]);

  // Check for any in-progress session (any non-completed status)
  const checkInProgressSession = useCallback(async () => {
    if (!clientId) return;

    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('id')
        .eq('client_id', clientId)
        .neq('status', 'completed')
        .is('deleted_at', null)
        .limit(1);

      if (error) {
        console.error('Error checking in-progress session:', error);
        setHasInProgressSession(false);
        return;
      }

      setHasInProgressSession(data && data.length > 0);
    } catch (error) {
      console.error('Error checking in-progress session:', error);
      setHasInProgressSession(false);
    }
  }, [clientId]);

  // Check for any completed session
  const checkCompletedSession = useCallback(async () => {
    if (!clientId) return;

    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .select('id')
        .eq('client_id', clientId)
        .eq('status', 'completed')
        .is('deleted_at', null)
        .limit(1);

      if (error) {
        console.error('Error checking completed session:', error);
        setHasCompletedSession(false);
        return;
      }

      setHasCompletedSession(data && data.length > 0);
    } catch (error) {
      console.error('Error checking completed session:', error);
      setHasCompletedSession(false);
    }
  }, [clientId]);

  // Delete session (soft delete)
  const deleteSession = useCallback(async (sessionId: string) => {
    try {
      await softDeleteSession(sessionId);
      // Refresh sessions
      await fetchSessions();
      await fetchDeletedSessions();
      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      return false;
    }
  }, [fetchSessions, fetchDeletedSessions]);

  // Restore session from Recently Deleted
  const restoreDeletedSession = useCallback(async (sessionId: string) => {
    try {
      await restoreSession(sessionId);
      // Refresh sessions
      await fetchSessions();
      await fetchDeletedSessions();
      return true;
    } catch (error) {
      console.error('Error restoring session:', error);
      return false;
    }
  }, [fetchSessions, fetchDeletedSessions]);

  // Set up real-time subscription to sessions table
  useEffect(() => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    // Initial fetch - wait for all critical data before setting loading to false
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Run all fetches in parallel, but wait for all to complete
        await Promise.all([
          fetchSessions(),
          fetchDeletedSessions(),
          fetchLatestProfile(),
          checkInProgressSession(),
          checkCompletedSession(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();

    // Set up real-time subscription
    const channel = supabase
      .channel('dashboard-sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'interview_sessions',
          filter: `client_id=eq.${clientId}`,
        },
        () => {
          // Refresh sessions when any change occurs
          fetchSessions();
          fetchDeletedSessions();
          checkInProgressSession();
          checkCompletedSession();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'category_of_one_profiles',
          filter: `client_id=eq.${clientId}`,
        },
        () => {
          // Refresh profile when any change occurs
          fetchLatestProfile();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [clientId, fetchSessions, fetchDeletedSessions, fetchLatestProfile, checkInProgressSession, checkCompletedSession]);


  return {
    sessions,
    deletedSessions,
    latestProfile,
    loading,
    hasInProgressSession,
    hasCompletedSession,
    deleteSession,
    restoreSession: restoreDeletedSession,
    refreshSessions: fetchSessions,
    refreshProfile: fetchLatestProfile,
  };
}

