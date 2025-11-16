import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import logoPath from "@assets/ChatGPT Image Nov 10, 2025, 03_16_37 AM_1762741083316.png";
import { logEvent, auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

export default function Login() {
  const [, setLocation] = useLocation();
  const { setUserData, user } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    if (user && !justLoggedIn) {
      setLocation('/');
    } else if (justLoggedIn && user) {
      setLocation('/');
    }
  }, [user, justLoggedIn, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!auth || !db) {
      toast({
        title: 'Firebase not initialized',
        description: 'Please try again later',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error('User profile not found. Please contact support.');
      }

      const userData = userDoc.data();
      const userProfile = {
        id: user.uid,
        email: user.email || email,
        name: userData.name,
        businessType: userData.businessType,
        planType: userData.planType,
        trialEndsAt: userData.trialEndsAt,
        subscriptionStartedAt: userData.subscriptionStartedAt,
        subscriptionEndsAt: userData.subscriptionEndsAt,
      };

      const token = await user.getIdToken();
      
      localStorage.setItem('kudiUser', JSON.stringify(userProfile));
      localStorage.setItem('auth_token', token);
      
      setUserData(userProfile, token);
      
      logEvent('login_success', {
        user_id: userProfile.id,
        business_type: userProfile.businessType,
        plan: userProfile.planType,
      });
      
      toast({
        title: 'Login successful',
        description: `Welcome back, ${userProfile.name}!`,
      });
      setJustLoggedIn(true);
    } catch (error: any) {
      let errorMessage = 'Invalid email or password';
      
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address format';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled. Please contact support.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      logEvent('login_failed', {
        error_message: errorMessage,
      });
      
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resetEmail || !/\S+@\S+\.\S+/.test(resetEmail)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setIsResetting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Password reset request for:', resetEmail);
      
      toast({
        title: 'Reset link sent',
        description: 'If this email exists, a password reset link has been sent.',
      });
      
      setShowForgotPassword(false);
      setResetEmail('');
    } catch (error) {
      toast({
        title: 'Reset failed',
        description: error instanceof Error ? error.message : 'Unable to send reset email. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8 animate-in fade-in duration-700">
          <img
            src={logoPath}
            alt="KudiManager Logo"
            className="w-28 h-28 sm:w-32 sm:h-32"
            data-testid="login-logo"
          />
        </div>
        <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">
            {showForgotPassword ? 'Reset Password' : 'Welcome to KudiManager'}
          </CardTitle>
          <CardDescription>
            {showForgotPassword 
              ? 'Enter your email to receive a password reset link' 
              : 'Sign in to manage your business'}
          </CardDescription>
        </CardHeader>
        
        {showForgotPassword ? (
          <form onSubmit={handlePasswordReset}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email Address</Label>
                <Input
                  id="reset-email"
                  type="email"
                  placeholder="you@example.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  data-testid="input-reset-email"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isResetting}
                data-testid="button-reset-password"
              >
                {isResetting ? 'Sending reset link...' : 'Send Reset Link'}
              </Button>
              <button
                type="button"
                onClick={() => {
                  setShowForgotPassword(false);
                  setResetEmail('');
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
                data-testid="button-back-to-login"
              >
                ← Back to login
              </button>
            </CardFooter>
          </form>
        ) : (
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-email"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs text-primary hover:underline"
                    data-testid="link-forgot-password"
                  >
                    Forgot password?
                  </button>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-password"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              <p className="text-sm text-muted-foreground text-center">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setLocation('/register')}
                  className="text-primary hover:underline"
                  data-testid="link-register"
                >
                  Register here
                </button>
              </p>
            </CardFooter>
          </form>
        )}
      </Card>
      </div>
    </div>
  );
}
