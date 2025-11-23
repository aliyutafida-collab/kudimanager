import { AlertTriangle, CheckCircle, XCircle, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface SubscriptionInfo {
  planType: "trial" | "basic" | "premium";
  trialStatus: "active" | "warning" | "expired";
  trialDaysRemaining: number;
  canAccess: boolean;
  subscriptionActive: boolean;
  subscriptionEndsAt: string | null;
}

interface TrialBannerProps {
  subscriptionInfo: SubscriptionInfo;
}

export function TrialBanner({ subscriptionInfo }: TrialBannerProps) {
  const { trialStatus, trialDaysRemaining, planType, subscriptionActive } = subscriptionInfo;

  // Handle paid subscription users
  if (planType !== "trial") {
    // Active paid subscription - no banner needed
    if (subscriptionActive) {
      return null;
    }
    
    // Expired paid subscription - show subscription expired banner
    return (
      <Card className="border-red-500/50 bg-red-50 dark:bg-red-950/20" data-testid="banner-subscription-expired">
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-medium text-red-900 dark:text-red-100">
                Subscription Expired
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Your subscription has ended. Renew now to continue using MaiCa
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600" data-testid="button-subscribe">
            <Link href="/subscribe">
              Renew Subscription
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Handle trial users below
  // Trial active - show days remaining in emerald
  if (trialStatus === "active" && trialDaysRemaining > 7) {
    return (
      <Card className="border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/20" data-testid="banner-trial-active">
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <div>
              <p className="font-medium text-emerald-900 dark:text-emerald-100">
                Trial Active
              </p>
              <p className="text-sm text-emerald-700 dark:text-emerald-300">
                You have {trialDaysRemaining} days remaining in your free trial
              </p>
            </div>
          </div>
          <Button asChild variant="outline" size="sm" className="border-emerald-600 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-900/30" data-testid="button-subscribe">
            <Link href="/subscribe">
              <Sparkles className="mr-2 h-4 w-4" />
              Upgrade Now
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Trial warning - 7 days or less remaining (gold/yellow)
  if (trialStatus === "warning") {
    return (
      <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20" data-testid="banner-trial-warning">
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            <div>
              <p className="font-medium text-yellow-900 dark:text-yellow-100">
                Trial Ending Soon
              </p>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Only {trialDaysRemaining} days left! Subscribe now to keep using MaiCa
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="bg-yellow-600 text-white hover:bg-yellow-700 dark:bg-yellow-500 dark:hover:bg-yellow-600" data-testid="button-subscribe">
            <Link href="/subscribe">
              Subscribe Now
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Trial expired - red alert
  if (trialStatus === "expired") {
    return (
      <Card className="border-red-500/50 bg-red-50 dark:bg-red-950/20" data-testid="banner-trial-expired">
        <CardContent className="flex items-center justify-between gap-4 p-4">
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="font-medium text-red-900 dark:text-red-100">
                Trial Expired
              </p>
              <p className="text-sm text-red-700 dark:text-red-300">
                Your free trial has ended. Subscribe to continue managing your business with MaiCa
              </p>
            </div>
          </div>
          <Button asChild size="sm" className="bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600" data-testid="button-subscribe">
            <Link href="/subscribe">
              Subscribe Now
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return null;
}
