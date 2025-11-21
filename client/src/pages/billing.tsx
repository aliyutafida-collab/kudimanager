import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
  description: string;
}

const PLANS: Plan[] = [
  {
    id: "trial",
    name: "Free Trial",
    price: 0,
    currency: "NGN",
    description: "90 days free",
    features: [
      "Up to 50 products",
      "Basic sales tracking",
      "Expense management",
      "Simple reports",
    ],
  },
  {
    id: "basic",
    name: "Basic",
    price: 2500,
    currency: "NGN",
    description: "Perfect for small businesses",
    popular: true,
    features: [
      "Up to 100 products",
      "Sales & expense tracking",
      "Inventory alerts",
      "Advanced reports",
      "Tax calculator",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    price: 5000,
    currency: "NGN",
    description: "For growing businesses",
    features: [
      "Unlimited products",
      "Full analytics dashboard",
      "AI business advisor",
      "Vendor recommendations",
      "Priority support",
      "Custom integrations",
    ],
  },
];

export default function Billing() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectPlan = async (planId: string) => {
    if (planId === "trial") {
      toast({
        title: "Free Trial",
        description: "You are already on the free trial (90 days)",
      });
      return;
    }

    setSelectedPlan(planId);
    setIsProcessing(true);

    try {
      const amount = PLANS.find(p => p.id === planId)?.price || 0;
      
      // Simulate payment initialization
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify({
          email: user?.email,
          amount,
          plan: planId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to initialize payment");
      }

      const data = await response.json();

      toast({
        title: "Payment Ready",
        description: "Redirecting to payment gateway...",
      });

      // In production: redirect to Paystack or Flutterwave
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      } else if (data.link) {
        window.location.href = data.link;
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
      console.error("Payment error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">{t('subscription.title')}</h1>
        <p className="text-muted-foreground mt-2">
          Choose a plan that works for your business
        </p>
      </div>

      {/* Current Plan Info */}
      {user && (
        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Plan</p>
                <p className="text-lg font-semibold capitalize">{user.planType}</p>
              </div>
              {user.trialEndsAt && (
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Trial expires</p>
                  <p className="text-lg font-semibold">
                    {new Date(user.trialEndsAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.popular
                ? "ring-2 ring-emerald-500 dark:ring-emerald-400"
                : ""
            }`}
          >
            {plan.popular && (
              <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-emerald-500">
                Most Popular
              </Badge>
            )}

            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">
                  {plan.price === 0 ? "Free" : `₦${plan.price.toLocaleString()}`}
                </span>
                {plan.price > 0 && (
                  <span className="text-muted-foreground ml-2">/month</span>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Features */}
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              {plan.id === "trial" || user?.planType === plan.id ? (
                <Button disabled className="w-full" variant="outline">
                  {user?.planType === plan.id ? "Current Plan" : "Active"}
                </Button>
              ) : (
                <Button
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={isProcessing && selectedPlan === plan.id}
                  data-testid={`button-upgrade-${plan.id}`}
                >
                  {isProcessing && selectedPlan === plan.id
                    ? "Processing..."
                    : "Subscribe Now"}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "Can I cancel my subscription anytime?",
              a: "Yes, you can cancel anytime without penalty.",
            },
            {
              q: "Is there a free trial?",
              a: "Yes! All new users get 90 days free trial to explore KudiManager.",
            },
            {
              q: "What payment methods are accepted?",
              a: "We accept all major payment methods via Paystack and Flutterwave.",
            },
            {
              q: "Will my data be safe?",
              a: "Yes, we use enterprise-grade encryption to protect your data.",
            },
          ].map((item, idx) => (
            <div key={idx} className="border rounded-lg p-4">
              <p className="font-semibold mb-2">{item.q}</p>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
