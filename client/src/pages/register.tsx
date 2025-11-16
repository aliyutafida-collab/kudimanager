import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import logoPath from "@assets/ChatGPT Image Nov 10, 2025, 03_16_37 AM_1762741083316.png";

const BUSINESS_TYPES = [
  'Retail & Products',
  'Restaurants & Food Services',
  'Hospitality',
  'Services',
  'Agriculture & Farming',
];

function validatePasswordStrength(password: string): { isValid: boolean; message: string } {
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.' };
  }
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.' };
  }
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.' };
  }
  if (!/[0-9]/.test(password)) {
    return { isValid: false, message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.' };
  }
  if (!/[@$!%*?&]/.test(password)) {
    return { isValid: false, message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.' };
  }
  
  if (strongRegex.test(password)) {
    return { isValid: true, message: 'Strong password.' };
  }
  
  return { isValid: false, message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.' };
}

export default function Register() {
  const [, setLocation] = useLocation();
  const { register, user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [justRegistered, setJustRegistered] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  const passwordValidation = validatePasswordStrength(password);
  const passwordsMatch = password === confirmPassword;

  useEffect(() => {
    if (user && !justRegistered) {
      setLocation('/');
    } else if (justRegistered && user) {
      setLocation('/setup-wizard');
    }
  }, [user, justRegistered, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordValidation.isValid) {
      toast({
        title: 'Invalid password',
        description: passwordValidation.message,
        variant: 'destructive',
      });
      return;
    }

    if (!passwordsMatch) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure both passwords are the same',
        variant: 'destructive',
      });
      return;
    }

    if (!businessType) {
      toast({
        title: 'Validation error',
        description: 'Please select a business type',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      await register(name, email, password, businessType);
      toast({
        title: 'Registration successful',
        description: 'Welcome to KudiManager! Let\'s set up your business.',
      });
      setJustRegistered(true);
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
      setIsLoading(false);
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
            data-testid="register-logo"
          />
        </div>
        <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Create an Account</CardTitle>
          <CardDescription>Start managing your business with KudiManager</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                data-testid="input-name"
              />
            </div>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setPasswordTouched(true)}
                required
                data-testid="input-password"
              />
              {passwordTouched && password && (
                <div className={`flex items-start gap-2 mt-1 ${passwordValidation.isValid ? 'password-success' : 'password-error'}`}>
                  {passwordValidation.isValid ? (
                    <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                  )}
                  <span>{passwordValidation.message}</span>
                </div>
              )}
              {!passwordTouched && (
                <p className="text-xs text-muted-foreground mt-1">
                  Must be at least 8 characters with uppercase, lowercase, number, and special character
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setConfirmPasswordTouched(true)}
                required
                data-testid="input-confirm-password"
              />
              {confirmPasswordTouched && confirmPassword && (
                <div className={`flex items-start gap-2 mt-1 ${passwordsMatch ? 'password-success' : 'password-error'}`}>
                  {passwordsMatch ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      <span>Passwords match</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      <span>Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessType">Business Type</Label>
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger id="businessType" data-testid="select-business-type">
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent>
                  {BUSINESS_TYPES.map((type) => (
                    <SelectItem key={type} value={type} data-testid={`option-${type.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              data-testid="button-register"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setLocation('/login')}
                className="text-primary hover:underline"
                data-testid="link-login"
              >
                Sign in here
              </button>
            </p>
          </CardFooter>
        </form>
      </Card>
      </div>
    </div>
  );
}
