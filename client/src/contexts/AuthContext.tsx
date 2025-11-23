import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth, db } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

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
  logout: () => Promise<void>;
  setUserData: (userData: User, authToken: string) => void;
  refreshSubscription: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!auth || !db) {
      setIsLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser && db) {
        try {
          const idToken = await firebaseUser.getIdToken();
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userProfile: User = {
              id: firebaseUser.uid,
              email: userData.email,
              name: userData.name,
              businessType: userData.businessType,
              planType: userData.planType,
              trialEndsAt: userData.trialEndsAt,
              subscriptionStartedAt: userData.subscriptionStartedAt,
              subscriptionEndsAt: userData.subscriptionEndsAt,
            };
            
            setUser(userProfile);
            setToken(idToken);
            
            localStorage.setItem('maicaUser', JSON.stringify(userProfile));
            localStorage.setItem('auth_token', idToken);
          }
        } catch (error) {
          console.error('Error loading user from Firestore:', error);
          setUser(null);
          setToken(null);
          localStorage.removeItem('maicaUser');
          localStorage.removeItem('auth_token');
        }
      } else {
        setUser(null);
        setToken(null);
        localStorage.removeItem('maicaUser');
        localStorage.removeItem('auth_token');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);


  const logout = async () => {
    if (!auth) return;
    
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase sign out error:', error);
    }
  };

  const setUserData = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
  };

  const refreshSubscription = async () => {
    if (!user || !auth || !auth.currentUser || !db) return;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const updatedUser: User = {
          ...user,
          planType: userData.planType,
          trialEndsAt: userData.trialEndsAt,
          subscriptionStartedAt: userData.subscriptionStartedAt,
          subscriptionEndsAt: userData.subscriptionEndsAt,
        };
        
        setUser(updatedUser);
        localStorage.setItem('maicaUser', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('Error refreshing subscription:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, logout, setUserData, refreshSubscription }}>
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
