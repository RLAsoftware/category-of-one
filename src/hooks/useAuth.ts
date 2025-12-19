import {
  useState,
  useEffect,
  useCallback,
  useRef,
  createContext,
  useContext,
  createElement,
  type ReactNode,
} from 'react';
import type { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, getUserRole, isEmailInvited } from '../lib/supabase';
import type { UserRole } from '../lib/types';

interface AuthState {
  user: User | null;
  session: Session | null;
  role: UserRole | null;
  loading: boolean;
  error: string | null;
  sessionTimedOut: boolean;
  sessionExpired: boolean;
}

const SESSION_INIT_TIMEOUT_MS = 20 * 60 * 1000; // 20 minutes

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Session check timed out'));
    }, ms);

    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

function useProvideAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    role: null,
    loading: true,
    error: null,
    sessionTimedOut: false,
    sessionExpired: false,
  });
  
  const isLoggingIn = useRef(false);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization in React Strict Mode
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await withTimeout(supabase.auth.getSession(), SESSION_INIT_TIMEOUT_MS);

        if (error) {
          const message = (error as AuthError).message ?? error.message ?? String(error);
          const isInvalidRefresh =
            message.toLowerCase().includes('invalid refresh token') ||
            message.toLowerCase().includes('refresh token not found');

          if (isInvalidRefresh) {
            console.warn('Auth initialization: invalid refresh token, signing out');
            await supabase.auth.signOut();
            setState({
              user: null,
              session: null,
              role: null,
              loading: false,
              error: 'Your session expired. Please sign in again.',
              sessionTimedOut: false,
              sessionExpired: true,
            });
          } else {
            setState((prev) => ({
              ...prev,
              loading: false,
              error: message,
              sessionTimedOut: false,
              sessionExpired: false,
            }));
          }
          return;
        }

        if (session?.user) {
          const role = await getUserRole(session.user.id);
          setState({
            user: session.user,
            session,
            role,
            loading: false,
            error: null,
            sessionTimedOut: false,
            sessionExpired: false,
          });
        } else {
          setState((prev) => ({
            ...prev,
            loading: false,
            sessionTimedOut: false,
            sessionExpired: false,
          }));
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        const message = err instanceof Error ? err.message : String(err);
        const isTimeout = message === 'Session check timed out';
        const isInvalidRefresh =
          message.toLowerCase().includes('invalid refresh token') ||
          message.toLowerCase().includes('refresh token not found');

        if (isInvalidRefresh) {
          console.warn('Auth initialization catch: invalid refresh token, signing out');
          await supabase.auth.signOut();
          setState({
            user: null,
            session: null,
            role: null,
            loading: false,
            error: 'Your session expired. Please sign in again.',
            sessionTimedOut: false,
            sessionExpired: true,
          });
        } else {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: isTimeout
              ? 'Session check timed out. Please sign in again.'
              : 'Failed to check session, please sign in again.',
            sessionTimedOut: isTimeout,
            sessionExpired: false,
          }));
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, _session) => {
        // Skip if we're handling a manual login
        if (isLoggingIn.current) return;

        if (event === 'SIGNED_OUT') {
          setState({
            user: null,
            session: null,
            role: null,
            loading: false,
            error: null,
            sessionTimedOut: false,
            sessionExpired: false,
          });
        } else if (event === 'SIGNED_IN' && _session?.user) {
          // Handle sign in events
          const role = await getUserRole(_session.user.id);
          setState({
            user: _session.user,
            session: _session,
            role,
            loading: false,
            error: null,
            sessionTimedOut: false,
            sessionExpired: false,
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signInWithMagicLink = useCallback(async (email: string) => {
    setState(prev => ({ ...prev, error: null }));
    
    // Pre-validate email before sending magic link
    const isInvited = await isEmailInvited(email);
    if (!isInvited) {
      const error = { message: 'No user account found. Please contact an administrator to request access.' };
      setState(prev => ({ ...prev, error: error.message }));
      return { error };
    }
    
    // Use environment variable for production URL, fallback to window.location.origin
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
      },
    });

    if (error) {
      setState(prev => ({ ...prev, error: error.message }));
      return { error };
    }

    return { error: null };
  }, []);

  const signInWithPassword = useCallback(async (email: string, password: string) => {
    isLoggingIn.current = true;
    setState(prev => ({ ...prev, error: null, loading: true }));

    try {
      // Pre-validate email before attempting login
      const isInvited = await isEmailInvited(email);
      if (!isInvited) {
        isLoggingIn.current = false;
        const errorMessage = 'No user account found. Please contact an administrator to request access.';
        setState(prev => ({ ...prev, error: errorMessage, loading: false }));
        return { error: { message: errorMessage } };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        isLoggingIn.current = false;
        setState(prev => ({ ...prev, error: (error as AuthError).message, loading: false }));
        return { error: { message: (error as AuthError).message } };
      }

      if (!data.session?.user) {
        isLoggingIn.current = false;
        setState(prev => ({ ...prev, error: 'No session created', loading: false }));
        return { error: { message: 'No session created' } };
      }

      const role = await getUserRole(data.session.user.id);

      setState({
        user: data.session.user,
        session: data.session,
        role,
        loading: false,
        error: null,
        sessionTimedOut: false,
        sessionExpired: false,
      });

      // Clear flag after state is set
      setTimeout(() => {
        isLoggingIn.current = false;
      }, 500);

      return { error: null };
    } catch (err) {
      console.error('Login error:', err);
      isLoggingIn.current = false;
      setState(prev => ({ ...prev, error: 'Login failed', loading: false }));
      return { error: { message: 'Login failed' } };
    }
  }, []);

  const signOut = useCallback(async () => {
    // Clear state immediately to prevent redirect loops
    setState({
      user: null,
      session: null,
      role: null,
      loading: false,
      error: null,
      sessionTimedOut: false,
      sessionExpired: false,
    });
    
    try {
      // Use local scope to ensure the client-side session is fully cleared
      // without depending on a successful global sign-out (which can 403).
      const { error } = await supabase.auth.signOut({ scope: 'local' });
      if (error) {
        console.warn('Supabase signOut error (ignored):', error.message);
      }
    } catch (err) {
      console.warn('Supabase signOut threw (ignored):', err);
    }
  }, []);

  const sendPasswordReset = useCallback(async (email: string) => {
    setState(prev => ({ ...prev, error: null }));
    
    // Pre-validate email before sending reset link
    const isInvited = await isEmailInvited(email);
    if (!isInvited) {
      const errorMessage = 'No user account found. Please contact an administrator to request access.';
      setState(prev => ({ ...prev, error: errorMessage }));
      return { error: { message: errorMessage } };
    }
    
    // Use environment variable for production URL, fallback to window.location.origin
    const siteUrl = import.meta.env.VITE_SITE_URL || window.location.origin;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
    });
    if (error) {
      setState(prev => ({ ...prev, error: error.message }));
      return { error: { message: error.message } };
    }
    return { error: null };
  }, []);

  return {
    ...state,
    signInWithMagicLink,
    signInWithPassword,
    signOut,
    sendPasswordReset,
    isAdmin: state.role === 'admin',
    isClient: state.role === 'client',
  };
}

type AuthContextValue = ReturnType<typeof useProvideAuth>;

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useProvideAuth();
  return createElement(AuthContext.Provider, { value }, children);
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
