import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Check, Loader2, Crown, AlertTriangle, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";

interface SubscriptionInfo {
  planType: "trial" | "basic" | "premium";
  trialStatus: "active" | "warning" | "expired";
  trialDaysRemaining: number;
  canAccess: boolean;
  subscriptionActive: boolean;
  subscriptionEndsAt: string | null;
}

interface PaymentInitializeResponse {
  success: boolean;
  authorization_url: string;
  access_code: string;
  reference: string;
}

interface PaymentVerifyResponse {
  success: boolean;
  status: string;
  message: string;
  amount: number;
  user: {
    id: string;
    name: string;
    email: string;
    planType: string;
    subscriptionInfo: SubscriptionInfo;
  };
}

const plans = [
  {
    name: "Basic",
    price: 2500,
    plan: "basic",
    description: "Perfect for small businesses just getting started",
    features: [
      "Track up to 100 sales/month",
      "Record unlimited expenses",
      "Basic inventory management",
      "Monthly reports",
      "Tax calculator",
      "Email support",
    ],
    testId: "card-basic-plan",
    buttonTestId: "button-subscribe-basic",
  },
  {
    name: "Premium",
    price: 5000,
    plan: "premium",
    description: "For growing businesses that need advanced features",
    popular: true,
    features: [
      "Unlimited sales tracking",
      "Advanced expense categorization",
      "Full inventory control with alerts",
      "AI business advisor",
      "Vendor directory access",
      "Priority support",
      "Custom reports & analytics",
      "Learning resources",
    ],
    testId: "card-premium-plan",
    buttonTestId: "button-subscribe-premium",
  },
];

export default function Subscription() {
  const { user, refreshSubscription } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [, setLocation] = useLocation();

  const { data: subscriptionInfo } = useQuery<SubscriptionInfo>({
    queryKey: ["/api/user/subscription"],
  });

  // Check URL parameters for payment redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const reference = urlParams.get('reference');
    
    if (reference) {
      // Remove the query params from URL
      window.history.replaceState({}, '', '/subscription');
      
      // Verify the payment
      verifyPaymentMutation.mutate(reference);
    }
  }, []);

  const initializePaymentMutation = useMutation({
    mutationFn: async (plan: string) => {
      const planPrices = { basic: 2500, premium: 5000 };
      const amount = planPrices[plan as keyof typeof planPrices];
      
      const response = await apiRequest("POST", "/payments/initialize", {
        email: user?.email || "",
        amount,
        plan,
      });
      return response.json();
    },
    onSuccess: (data: PaymentInitializeResponse) => {
      // Redirect to Paystack payment page
      window.location.href = data.authorization_url;
    },
    onError: (error) => {
      toast({
        title: "Payment Initialization Failed",
        description: error instanceof Error ? error.message : "Failed to initialize payment",
        variant: "destructive",
      });
      setSelectedPlan(null);
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: async (reference: string) => {
      const response = await apiRequest("POST", "/payments/verify", {
        reference,
      });
      return response.json();
    },
    onSuccess: async (data: PaymentVerifyResponse) => {
      if (data.success) {
        // Refresh user data and subscription info
        await refreshSubscription();
        await queryClient.invalidateQueries({ queryKey: ["/api/user/subscription"] });
        
        toast({
          title: "Payment Successful!",
          description: `You've successfully subscribed to the ${data.user.planType} plan. Welcome!`,
        });
        
        // Redirect to dashboard after successful payment
        setTimeout(() => setLocation('/'), 2000);
      } else {
        toast({
          title: "Payment Not Successful",
          description: data.message || "Your payment could not be verified. Please contact support if you were charged.",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Payment Verification Failed",
        description: error instanceof Error ? error.message : "Failed to verify payment",
        variant: "destructive",
      });
    },
  });

  const handleSubscribe = (plan: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe",
        variant: "destructive",
      });
      return;
    }
    setSelectedPlan(plan);
    initializePaymentMutation.mutate(plan);
  };

  const getTrialStatusBanner = () => {
    if (!subscriptionInfo || subscriptionInfo.planType !== "trial") return null;

    if (subscriptionInfo.trialStatus === "expired") {
      return (
        <Card className="border-red-500/50 bg-red-50 dark:bg-red-950/20" data-testid="banner-trial-expired">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900 dark:text-red-100 mb-1">
                  Your Trial Has Ended
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Subscribe to one of our plans below to continue managing your business with MaiCa
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (subscriptionInfo.trialStatus === "warning") {
      return (
        <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20" data-testid="banner-trial-warning">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                  Trial Ending Soon
                </p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  You have {subscriptionInfo.trialDaysRemaining} days left in your free trial. Subscribe now to avoid interruption
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (subscriptionInfo.trialStatus === "active") {
      return (
        <Card className="border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/20" data-testid="banner-trial-active">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-emerald-900 dark:text-emerald-100 mb-1">
                  Free Trial Active
                </p>
                <p className="text-sm text-emerald-700 dark:text-emerald-300">
                  You have {subscriptionInfo.trialDaysRemaining} days remaining. Upgrade anytime to unlock premium features
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground">
          {subscriptionInfo?.planType === "trial" 
            ? "Upgrade to unlock powerful features for your business"
            : "Manage your subscription and explore plan options"
          }
        </p>
      </div>

      {getTrialStatusBanner()}

      <div className="grid gap-6 md:grid-cols-2 lg:gap-8 max-w-4xl mx-auto">
        {plans.map((planInfo) => (
          <Card
            key={planInfo.plan}
            className={planInfo.popular ? "border-accent shadow-lg" : ""}
            data-testid={planInfo.testId}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl">{planInfo.name}</CardTitle>
                  <CardDescription className="mt-2">{planInfo.description}</CardDescription>
                </div>
                {planInfo.popular && (
                  <Badge className="bg-accent text-accent-foreground">
                    <Crown className="w-3 h-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
              </div>
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold font-mono">
                    ₦{planInfo.price.toLocaleString()}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {planInfo.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={planInfo.popular ? "default" : "outline"}
                onClick={() => handleSubscribe(planInfo.plan)}
                disabled={
                  (initializePaymentMutation.isPending && selectedPlan === planInfo.plan) || 
                  verifyPaymentMutation.isPending ||
                  initializePaymentMutation.isPending
                }
                data-testid={planInfo.buttonTestId}
              >
                {initializePaymentMutation.isPending && selectedPlan === planInfo.plan ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Initializing Payment...
                  </>
                ) : verifyPaymentMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Verifying Payment...
                  </>
                ) : (
                  "Subscribe with Paystack"
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• All payments are processed securely through Paystack</p>
            <p>• Subscriptions are billed monthly and auto-renew</p>
            <p>• You can cancel or change your plan anytime</p>
            <p>• All prices are in Nigerian Naira (₦)</p>
            <p>• 14-day money-back guarantee for new subscribers</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
