import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Check, Loader2, Crown } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";

interface SubscriptionResponse {
  success: boolean;
  reference: string;
  amount: number;
  plan: string;
  email: string;
  paystackUrl: string;
  message: string;
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
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const subscribeMutation = useMutation({
    mutationFn: async (plan: string) => {
      const response = await apiRequest("POST", "/api/subscribe", {
        email: user?.email || "",
        plan,
      });
      return response.json();
    },
    onSuccess: (data: SubscriptionResponse) => {
      toast({
        title: "Subscription Initiated",
        description: `Your ${data.plan} plan subscription has been initiated. Reference: ${data.reference}`,
      });
      console.log("Paystack URL:", data.paystackUrl);
      setSelectedPlan(null);
    },
    onError: (error) => {
      toast({
        title: "Subscription Failed",
        description: error instanceof Error ? error.message : "Failed to process subscription",
        variant: "destructive",
      });
      setSelectedPlan(null);
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
    subscribeMutation.mutate(plan);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-semibold mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground">
          Upgrade to unlock powerful features for your business
        </p>
      </div>

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
                disabled={subscribeMutation.isPending && selectedPlan === planInfo.plan}
                data-testid={planInfo.buttonTestId}
              >
                {subscribeMutation.isPending && selectedPlan === planInfo.plan ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Subscribe Now"
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
