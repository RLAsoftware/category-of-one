import { useState, useEffect, useCallback } from 'react';
import { supabase, getClientSessions, getDeletedSessions, getLatestProfileForClient, softDeleteSession, restoreSession, searchSessions, filterSessionsByStatus } from '../lib/supabase';
import type { InterviewSession, CategoryOfOneProfile } from '../lib/types';

interface UseDashboardOptions {
  clientId: string;
}

export function useDashboard({ clientId }: UseDashboardOptions) {
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [deletedSessions, setDeletedSessions] = useState<InterviewSession[]>([]);
  const [latestProfile, setLatestProfile] = useState<CategoryOfOneProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'completed'>('all');

  // Fetch all sessions
  const fetchSessions = useCallback(async () => {
    if (!clientId) return;
    
    setLoading(true);
    try {
      let sessionData: InterviewSession[];
      
      // Apply search or filter
      if (searchQuery.trim()) {
        sessionData = await searchSessions(clientId, searchQuery);
      } else if (statusFilter !== 'all') {
        sessionData = await filterSessionsByStatus(clientId, statusFilter);
      } else {
        sessionData = await getClientSessions(clientId);
      }
      
      setSessions(sessionData);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, [clientId, searchQuery, statusFilter]);

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
    if (!clientId) return;

    // Initial fetch
    fetchSessions();
    fetchDeletedSessions();
    fetchLatestProfile();

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
  }, [clientId, fetchSessions, fetchDeletedSessions, fetchLatestProfile]);

  // Re-fetch when search or filter changes
  useEffect(() => {
    if (clientId) {
      fetchSessions();
    }
  }, [searchQuery, statusFilter, fetchSessions, clientId]);

  return {
    sessions,
    deletedSessions,
    latestProfile,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    deleteSession,
    restoreSession: restoreDeletedSession,
    refreshSessions: fetchSessions,
    refreshProfile: fetchLatestProfile,
  };
}

