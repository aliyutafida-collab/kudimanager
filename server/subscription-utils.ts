import { type User } from "@shared/schema";

/**
 * Calculate how many days remain in the user's trial period
 * Returns 0 if trial has ended or user is on paid plan
 */
export function calculateTrialDaysRemaining(user: User): number {
  if (user.planType !== "trial" || !user.trialEndsAt) {
    return 0;
  }
  
  const now = new Date();
  const trialEnd = new Date(user.trialEndsAt);
  const diffTime = trialEnd.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
}

/**
 * Check if user's trial is still active
 */
export function isTrialActive(user: User): boolean {
  if (user.planType !== "trial" || !user.trialEndsAt) {
    return false;
  }
  
  const now = new Date();
  const trialEnd = new Date(user.trialEndsAt);
  
  return now < trialEnd;
}

/**
 * Check if user has an active paid subscription
 */
export function isSubscriptionActive(user: User): boolean {
  if (user.planType === "trial" || !user.subscriptionEndsAt) {
    return false;
  }
  
  const now = new Date();
  const subscriptionEnd = new Date(user.subscriptionEndsAt);
  
  return now < subscriptionEnd && user.isActive;
}

/**
 * Check if user can access the dashboard and app features
 * Returns true if either trial is active OR subscription is active
 */
export function canAccessDashboard(user: User): boolean {
  if (!user.isActive) {
    return false;
  }
  
  return isTrialActive(user) || isSubscriptionActive(user);
}

/**
 * Get the trial status for display purposes
 * Returns: "active", "warning" (7 days or less), or "expired"
 */
export function getTrialStatus(user: User): "active" | "warning" | "expired" {
  if (user.planType !== "trial") {
    return "expired"; // Not on trial
  }
  
  const daysRemaining = calculateTrialDaysRemaining(user);
  
  if (daysRemaining === 0) {
    return "expired";
  }
  
  if (daysRemaining <= 7) {
    return "warning";
  }
  
  return "active";
}

/**
 * Get subscription info for a user
 */
export function getSubscriptionInfo(user: User) {
  return {
    planType: user.planType,
    isActive: user.isActive,
    trialDaysRemaining: calculateTrialDaysRemaining(user),
    trialStatus: getTrialStatus(user),
    isTrialActive: isTrialActive(user),
    isSubscriptionActive: isSubscriptionActive(user),
    canAccess: canAccessDashboard(user),
    trialEndsAt: user.trialEndsAt,
    subscriptionEndsAt: user.subscriptionEndsAt,
  };
}
