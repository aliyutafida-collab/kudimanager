import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { LanguageSwitcher } from '@/components/language-switcher';
import { useTranslation } from 'react-i18next';
import logoPath from '@assets/kudimanager-logo.png';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const businessTypes = [
  { value: 'retail', label: 'Retail' },
  { value: 'restaurant', label: 'Restaurant/Food Service' },
  { value: 'fashion', label: 'Fashion/Clothing' },
  { value: 'beauty', label: 'Beauty/Salon' },
  { value: 'technology', label: 'Technology/IT' },
  { value: 'services', label: 'Professional Services' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'other', label: 'Other' },
];

function validatePassword(password: string): { isValid: boolean; message: string } {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long.' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter.' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter.' };
  }
  
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number.' };
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character (@$!%*?&).' };
  }
  
  return { isValid: true, message: 'Strong password' };
}

export default function Register() {
  const { t } = useTranslation();
  const [, setLocation] = useLocation();
  const { setUserData, user } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState<{ isValid: boolean; message: string }>({ isValid: false, message: '' });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [justRegistered, setJustRegistered] = useState(false);

  useEffect(() => {
    if (password) {
      const validation = validatePassword(password);
      setPasswordValidation(validation);
    } else {
      setPasswordValidation({ isValid: false, message: '' });
    }
  }, [password]);

  useEffect(() => {
    if (confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (user && !justRegistered) {
      setLocation('/');
    }
  }, [user, justRegistered, setLocation]);

  useEffect(() => {
    if (justRegistered && user) {
      setLocation('/');
    }
  }, [justRegistered, user, setLocation]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordValidation.isValid) {
      toast({
        title: 'Invalid password',
        description: passwordValidation.message,
        variant: 'destructive',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      if (!auth || !db) {
        console.error('Firebase auth or db not initialized:', { auth: !!auth, db: !!db });
        throw new Error('Firebase services not initialized');
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const trialEndsAt = new Date();
      trialEndsAt.setDate(trialEndsAt.getDate() + 90);

      const userProfile = {
        id: user.uid,
        name,
        email,
        businessType,
        planType: 'trial',
        trialEndsAt: trialEndsAt.toISOString(),
        subscriptionStartedAt: null,
        subscriptionEndsAt: null,
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', user.uid), userProfile);

      const token = await user.getIdToken();
      
      localStorage.setItem('kudiUser', JSON.stringify(userProfile));
      localStorage.setItem('auth_token', token);
      
      setUserData(userProfile, token);

      toast({
        title: 'Registration successful',
        description: 'Welcome to KudiManager! Let\'s set up your business.',
      });
      setJustRegistered(true);
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = t('common.error');
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = t('auth.errors.emailInUse');
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = t('auth.errors.invalidEmail');
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Email/password accounts are not enabled. Please contact support.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = t('auth.errors.weakPassword');
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = t('auth.errors.networkError');
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast({
        title: t('auth.register') + ' ' + t('common.error').toLowerCase(),
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md animate-fade-in">
        <CardHeader className="space-y-1 text-center">
          <img 
            src={logoPath} 
            alt="KudiManager Logo" 
            className="w-28 sm:w-32 mx-auto mb-4 animate-fade-in"
            data-testid="img-logo"
          />
          <CardTitle className="text-2xl font-bold">{t('auth.registerTitle')}</CardTitle>
          <CardDescription>
            {t('auth.registerDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('auth.name')}</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                data-testid="input-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('auth.email')}</Label>
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
              <Label htmlFor="business-type">{t('auth.businessType')}</Label>
              <Select value={businessType} onValueChange={setBusinessType} required disabled={isLoading}>
                <SelectTrigger id="business-type" data-testid="select-business-type">
                  <SelectValue placeholder="Select your business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('auth.password')}</Label>
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
              {password && (
                <div className="flex items-center gap-2 text-sm mt-1">
                  {passwordValidation.isValid ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-[#007F5F]" />
                      <span className="text-[#007F5F] font-medium">{passwordValidation.message}</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-[#d93a3a]" />
                      <span className="text-[#d93a3a]">{passwordValidation.message}</span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{t('auth.confirmPassword')}</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  data-testid="input-confirm-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                  data-testid="button-toggle-confirm-password"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </Button>
              </div>
              {confirmPassword && !passwordsMatch && (
                <div className="flex items-center gap-2 text-sm mt-1">
                  <AlertCircle className="h-4 w-4 text-[#d93a3a]" />
                  <span className="text-[#d93a3a]">{t('auth.passwordsDontMatch')}</span>
                </div>
              )}
              {confirmPassword && passwordsMatch && (
                <div className="flex items-center gap-2 text-sm mt-1">
                  <CheckCircle2 className="h-4 w-4 text-[#007F5F]" />
                  <span className="text-[#007F5F] font-medium">{t('auth.passwordsMatch')}</span>
                </div>
              )}
            </div>
            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading || !passwordValidation.isValid || !passwordsMatch}
              data-testid="button-register"
            >
              {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-muted-foreground">{t('auth.hasAccount')} </span>
            <button
              type="button"
              className="text-emerald-600 hover:text-emerald-700 hover:underline"
              onClick={() => setLocation('/login')}
              disabled={isLoading}
              data-testid="link-login"
            >
              {t('auth.signInHere')}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
