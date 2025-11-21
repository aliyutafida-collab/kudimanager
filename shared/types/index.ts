/**
 * Shared Type Definitions - Safe for Client & Server
 * 
 * This folder contains ONLY:
 * - TypeScript interfaces
 * - Types
 * - Enums
 * 
 * ❌ NO functions, utilities, or database references
 * ❌ NO drizzle-orm imports
 * ❌ NO server-only code
 */

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  businessType: string;
  planType: "trial" | "basic" | "premium";
  trialEndsAt?: Date;
  subscriptionStartedAt?: Date;
  subscriptionEndsAt?: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface AuthTokenResponse {
  token: string;
  user: User;
}

// Business Types
export interface Product {
  id: string;
  userId: string;
  name: string;
  sku?: string;
  category?: string;
  price: string;
  quantity: number;
  lowStockThreshold?: number;
}

export interface Sale {
  id: string;
  userId: string;
  productId?: string;
  productName: string;
  customer?: string;
  quantity: number;
  unitPrice: string;
  total: string;
  date: Date;
}

export interface Expense {
  id: string;
  userId: string;
  description: string;
  category: string;
  amount: string;
  date: Date;
}

// Subscription Types
export interface SubscriptionInfo {
  planType: "trial" | "basic" | "premium";
  trialStatus: "active" | "warning" | "expired";
  trialDaysRemaining: number;
  canAccess: boolean;
  subscriptionActive: boolean;
  subscriptionEndsAt: string | null;
}

// Payment Types
export interface PaymentInitializeRequest {
  email: string;
  amount: number;
  plan: "basic" | "premium";
  metadata?: {
    userId?: string;
    planType: string;
  };
}

export interface PaymentVerifyRequest {
  reference: string;
}

// Business Analytics Types
export interface BusinessMetrics {
  totalSales: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: string;
  productCount: number;
  transactionCount: number;
}

export interface MonthlyData {
  month: string;
  sales: number;
  expenses: number;
  profit: number;
}

// AI & Advisory Types
export interface AIAdviceResponse {
  success: boolean;
  metrics: {
    totalSales: number;
    totalExpenses: number;
    netProfit: number;
    profitMargin: string;
  };
  insights: string[];
  generatedBy: string;
}

export interface VendorSuggestion {
  name: string;
  category: string;
  location: string;
  rating?: number;
  description?: string;
}

// Tax Calculation Types
export interface TaxCalculationRequest {
  monthlyProfit: number;
  monthlySales: number;
  businessType?: "personal" | "small_business" | "company";
}

export interface TaxCalculationResponse {
  estimatedTax: number;
  taxRate: number;
  netIncome: number;
  breakdown: string;
}

// Learning Resource Types
export interface LearningResource {
  id: string;
  title: string;
  category: string;
  description: string;
  url: string;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
}
