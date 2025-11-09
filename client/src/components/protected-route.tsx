import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  allowExpired?: boolean; // Allow access even if subscription expired (for /subscribe page)
}

export function ProtectedRoute({ children, allowExpired = false }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/login');
      return;
    }

    // Check subscription status (only if not on /subscribe page)
    if (!isLoading && user && !allowExpired && location !== '/subscribe') {
      const subscriptionInfo = user.subscriptionInfo;
      
      // If subscription info is available and user cannot access, redirect to /subscribe
      if (subscriptionInfo && !subscriptionInfo.canAccess) {
        setLocation('/subscribe');
      }
    }
  }, [user, isLoading, allowExpired, location, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" data-testid="loading-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
