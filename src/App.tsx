import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Login } from './pages/Login';
import { Interview } from './pages/Interview';
import { Admin } from './pages/Admin';
import { AuthCallback } from './components/Auth/AuthCallback';
import { ResetPassword } from './pages/ResetPassword';

// Component to handle hash-based auth redirects (e.g., password reset)
function HashAuthHandler() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for hash fragments with auth tokens
    if (location.hash) {
      const hashParams = new URLSearchParams(location.hash.substring(1));
      const type = hashParams.get('type');
      
      // If it's a recovery (password reset) token, redirect to reset-password
      if (type === 'recovery' && hashParams.has('access_token')) {
        // Supabase will handle the session automatically
        // Just redirect to the reset password page
        navigate('/reset-password', { replace: true });
      }
    }
  }, [location.hash, navigate]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <HashAuthHandler />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/interview" element={<Interview />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
