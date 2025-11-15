import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SubscriptionInfo {
  planType: "trial" | "basic" | "premium";
  trialStatus: "active" | "warning" | "expired";
  trialDaysRemaining: number;
  canAccess: boolean;
  subscriptionActive: boolean;
  subscriptionEndsAt: string | null;
}

interface User {
  id: string;
  name: string;
  email: string;
  businessType: string;
  planType: string;
  trialEndsAt?: string | null;
  subscriptionStartedAt?: string | null;
  subscriptionEndsAt?: string | null;
  subscriptionInfo?: SubscriptionInfo;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, businessType: string) => Promise<void>;
  logout: () => void;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('auth_token');
      const storedUser = localStorage.getItem('kudiUser');
      
      if (storedToken && storedUser) {
        const savedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser({
          id: savedUser.id || '',
          email: savedUser.email,
          name: savedUser.name,
          businessType: savedUser.business_type || savedUser.businessType,
          planType: savedUser.plan || savedUser.planType || 'trial',
          trialEndsAt: savedUser.trialEndsAt || savedUser.trial_ends_at,
          subscriptionStartedAt: savedUser.subscriptionStartedAt || savedUser.subscription_started_at,
          subscriptionEndsAt: savedUser.subscriptionEndsAt || savedUser.subscription_ends_at,
          subscriptionInfo: savedUser.subscriptionInfo
        });
      }
    } catch (error) {
      console.error('Failed to load user from localStorage:', error);
      localStorage.removeItem('kudiUser');
      localStorage.removeItem('auth_token');
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    const data = await response.json();
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem('auth_token', data.token);
    localStorage.setItem('kudiUser', JSON.stringify({
      id: data.user.id,
      email: data.user.email,
      name: data.user.name,
      business_type: data.user.businessType,
      plan: data.user.planType,
      trialEndsAt: data.user.trialEndsAt,
      subscriptionStartedAt: data.user.subscriptionStartedAt,
      subscriptionEndsAt: data.user.subscriptionEndsAt,
      subscriptionInfo: data.user.subscriptionInfo
    }));
    return data.user;
  };

  const register = async (name: string, email: string, password: string, businessType: string) => {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, businessType }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }

    await login(email, password);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('kudiUser');
  };

  const refreshSubscription = async () => {
    if (!token) return;
    
    try {
      const response = await fetch('/api/user/subscription', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const subscriptionInfo = await response.json();
        setUser(prevUser => prevUser ? { ...prevUser, subscriptionInfo } : null);
        if (user) {
          localStorage.setItem('kudiUser', JSON.stringify({
            id: user.id,
            email: user.email,
            name: user.name,
            business_type: user.businessType,
            plan: user.planType
          }));
        }
      }
    } catch (error) {
      console.error('Failed to refresh subscription info:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshSubscription }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
