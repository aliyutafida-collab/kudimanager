// Safe TypeScript types for client use only - NO drizzle-orm, NO server code
export interface User {
  id: string;
  email: string;
  name: string;
  business_type?: string;
  plan?: string;
  trialEndsAt?: number;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  sku?: string | undefined;
  category?: string | undefined;
  price: string;
  quantity: number;
  lowStockThreshold?: number | undefined;
}

export interface Sale {
  id: string;
  userId: string;
  productId?: string | undefined;
  productName: string;
  customer?: string | undefined;
  quantity: number;
  unitPrice: string;
  total: string;
  date: string | Date;
}

export interface Expense {
  id: string;
  userId: string;
  description: string;
  category: string;
  amount: string;
  date: string | Date;
}

export interface Inventory {
  id: string;
  userId: string;
  name: string;
  quantity: number;
  price: string;
}

export interface Transaction {
  id: string;
  type: 'sale' | 'expense';
  amount: string;
  date: string | Date;
}
