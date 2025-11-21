import { z } from "zod";

/**
 * PRODUCT SCHEMAS
 */
export const insertProductSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  quantity: z.number().min(0),
  costPrice: z.number().min(0),
  sellingPrice: z.number().min(0),
  dateAdded: z.string().optional(),
});
export type InsertProduct = z.infer<typeof insertProductSchema>;

/**
 * SALES SCHEMAS
 */
export const insertSaleSchema = z.object({
  productId: z.string(),
  quantitySold: z.number().min(1),
  amount: z.number().min(0),
  date: z.string(),
});
export type InsertSale = z.infer<typeof insertSaleSchema>;

/**
 * EXPENSE SCHEMAS
 */
export const insertExpenseSchema = z.object({
  title: z.string().min(1),
  amount: z.number().min(0),
  category: z.string().min(1),
  date: z.string(),
});
export type InsertExpense = z.infer<typeof insertExpenseSchema>;

/**
 * PRODUCT INTERFACE (for API responses)
 */
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

/**
 * SALE INTERFACE (for API responses)
 */
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

/**
 * EXPENSE INTERFACE (for API responses)
 */
export interface Expense {
  id: string;
  userId: string;
  description: string;
  category: string;
  amount: string;
  date: string | Date;
}

/**
 * USER INTERFACE
 */
export interface User {
  id: string;
  email: string;
  name: string;
  business_type?: string;
  plan?: string;
  trialEndsAt?: number;
}

/**
 * INVENTORY INTERFACE
 */
export interface Inventory {
  id: string;
  userId: string;
  name: string;
  quantity: number;
  price: string;
}

/**
 * TRANSACTION INTERFACE
 */
export interface Transaction {
  id: string;
  type: 'sale' | 'expense';
  amount: string;
  date: string | Date;
}
