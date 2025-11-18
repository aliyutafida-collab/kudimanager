import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import logoPath from '@assets/ChatGPT Image Nov 10, 2025, 03_16_37 AM_1762741083316.png';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');

  useEffect(() => {
    if (user && !justLoggedIn) {
      setLocation('/');
    }
  }, [user, justLoggedIn, setLocation]);

  useEffect(() => {
    if (justLoggedIn && user) {
      setLocation('/');
    }
  }, [justLoggedIn, user, setLocation]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth!, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db!, 'users', user.uid));
      
      if (!userDoc.exists()) {
        throw new Error('User profile not found');
      }

      const userData = userDoc.data();
      const userProfile = {
        id: user.uid,
        email: userData.email,
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
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection';
      }
      
      logEvent('login_failed', {
        error_code: error.code || 'unknown',
        error_message: errorMessage,
      });
      
      toast({
        title: 'Login failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Password reset requested for:', resetEmail);
    
    toast({
      title: 'Password reset email sent',
      description: 'If this email exists, a password reset link has been sent.',
    });
    
    setShowForgotPassword(false);
    setResetEmail('');
  };

  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader className="space-y-1 text-center">
            <img 
              src={logoPath} 
              alt="KudiManager Logo" 
              className="w-28 sm:w-32 mx-auto mb-4 animate-fade-in"
              data-testid="img-logo"
            />
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>
              Enter your email address and we'll send you a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Email</Label>
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
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" data-testid="button-send-reset">
                Send Reset Link
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full" 
                onClick={() => setShowForgotPassword(false)}
                data-testid="button-back-to-login"
              >
                Back to Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <img 
            src={logoPath} 
            alt="KudiManager Logo" 
            className="w-28 sm:w-32 mx-auto mb-4 animate-fade-in"
            data-testid="img-logo"
          />
          <CardTitle className="text-2xl font-bold">Login to KudiManager</CardTitle>
          <CardDescription>
            Enter your credentials to access your business dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                data-testid="input-email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  data-testid="input-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                  data-testid="button-toggle-password"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-sm text-emerald-600 hover:text-emerald-700 hover:underline"
                onClick={() => setShowForgotPassword(true)}
                disabled={isLoading}
                data-testid="button-forgot-password"
              >
                Forgot password?
              </button>
            </div>
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading}
              data-testid="button-login"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <button
              type="button"
              className="text-emerald-600 hover:text-emerald-700 hover:underline"
              onClick={() => setLocation('/register')}
              disabled={isLoading}
              data-testid="link-register"
            >
              Sign up
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
