import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const AuthProtection = ({ children, requireAuth = true }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only access localStorage on client-side
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const authenticated = !!(token && user);

      setIsAuthenticated(authenticated);

      // If authentication is required but user is not logged in
      if (requireAuth && !authenticated) {
        router.push('/admin/login');
        return;
      }

      // If user is logged in but trying to access login/register pages
      if (!requireAuth && authenticated) {
        router.push('/admin/dashboard');
        return;
      }
    }
    setIsLoading(false);
  }, [router, requireAuth]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If requireAuth is false, render children (for login/register pages)
  if (!requireAuth) {
    return <>{children}</>;
  }

  // If requireAuth is true and user is not authenticated, don't render (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, render children
  return <>{children}</>;
};

export default AuthProtection;
