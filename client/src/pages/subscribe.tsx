import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useLocation } from "wouter";
import { Check, Sparkles, Crown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { logEvent } from '@/lib/firebase';

export default function Subscribe() {
  const { user, refreshUser } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activatingPlan, setActivatingPlan] = useState<string | null>(null);

  const handleSubscribe = async (plan: "basic" | "premium") => {
    if (!user) {
      navigate("/login");
      return;
    }

    setActivatingPlan(plan);

    try {
      // Mock payment - simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Call secure backend endpoint to update subscription
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/mock-subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Subscription failed');
      }

      // Refresh user data from server (server-trusted refresh)
      await refreshUser();

      logEvent('subscription_purchase', {
        plan_type: plan,
        price: plan === 'basic' ? 2500 : 5000,
        user_id: user.id,
      });

      toast({
        title: "Subscription Activated!",
        description: `You are now subscribed to the ${plan === "basic" ? "Basic" : "Premium"} plan. Welcome aboard!`,
        className: "bg-emerald-50 border-emerald-200 text-emerald-900",
      });

      // Navigate to dashboard after successful subscription
      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (error) {
      console.error("Subscription error:", error);
      toast({
        title: "Subscription Failed",
        description: "There was an error activating your subscription. Please try again.",
        variant: "destructive",
      });
    } finally {
      setActivatingPlan(null);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Choose Your Plan</h1>
        <p className="text-muted-foreground">
          Select the perfect plan for your business needs
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Plan */}
        <Card className="relative hover-elevate" data-testid="card-basic-plan">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-2xl">Basic</CardTitle>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-emerald-600">₦2,500</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <CardDescription>Perfect for small businesses getting started</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Sales tracking and management</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Expenses tracking and categorization</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Inventory management</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Monthly business summary reports</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Dashboard analytics</span>
              </li>
            </ul>
            <Button 
              onClick={() => handleSubscribe("basic")}
              disabled={activatingPlan !== null || user?.planType === "basic"}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              size="lg"
              data-testid="button-subscribe-basic"
            >
              {activatingPlan === "basic" ? (
                "Activating..."
              ) : user?.planType === "basic" ? (
                "Current Plan"
              ) : (
                "Subscribe to Basic"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card className="relative border-2 border-[#F4C542] hover-elevate" data-testid="card-premium-plan">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div className="bg-[#F4C542] text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Crown className="h-4 w-4" />
              Most Popular
            </div>
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Crown className="h-5 w-5 text-[#F4C542]" />
              <CardTitle className="text-2xl">Premium</CardTitle>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold text-[#F4C542]">₦5,000</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <CardDescription>Everything you need to grow your business</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-[#F4C542] flex-shrink-0 mt-0.5" />
                <span className="font-medium">Everything in Basic, plus:</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-[#F4C542] flex-shrink-0 mt-0.5" />
                <span>AI-powered business insights and recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-[#F4C542] flex-shrink-0 mt-0.5" />
                <span>Nigerian tax calculator and compliance tools</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-[#F4C542] flex-shrink-0 mt-0.5" />
                <span>Quarterly and annual detailed reports</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-[#F4C542] flex-shrink-0 mt-0.5" />
                <span>Vendor recommendations and resources</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-[#F4C542] flex-shrink-0 mt-0.5" />
                <span>Priority customer support</span>
              </li>
            </ul>
            <Button 
              onClick={() => handleSubscribe("premium")}
              disabled={activatingPlan !== null || user?.planType === "premium"}
              className="w-full bg-[#F4C542] hover:bg-[#d4a832] text-white"
              size="lg"
              data-testid="button-subscribe-premium"
            >
              {activatingPlan === "premium" ? (
                "Activating..."
              ) : user?.planType === "premium" ? (
                "Current Plan"
              ) : (
                "Subscribe to Premium"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>All plans are billed monthly. Cancel anytime.</p>
        <p className="mt-2">
          Need help choosing? <a href="/learn" className="text-emerald-600 hover:underline">Learn more about our features</a>
        </p>
      </div>
    </div>
  );
}
