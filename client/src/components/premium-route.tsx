import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';

interface PremiumRouteProps {
  children: ReactNode;
}

export function PremiumRoute({ children }: PremiumRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation('/login');
      return;
    }

    // Check if user has premium plan
    if (!isLoading && user && user.planType !== "premium") {
      setLocation('/subscribe');
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen" data-testid="loading-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || user.planType !== "premium") {
    return null;
  }

  return <>{children}</>;
}
