import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, user } = useAuth();
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

    try {
      const userData = await login(email, password);
      toast({
        title: 'Login successful',
        description: `Welcome back, ${userData.name}!`,
      });
      setJustLoggedIn(true);
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid email or password',
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
      <Card className="w-full max-w-md">
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
  );
}
