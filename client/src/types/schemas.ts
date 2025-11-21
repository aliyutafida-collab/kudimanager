import { z } from "zod";

// Type definitions for client use only (no drizzle-orm imports)
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

// Zod schemas for validation
export const insertProductSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  sku: z.string().nullish(),
  category: z.string().nullish(),
  price: z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? val : val.toString()),
  quantity: z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? parseInt(val, 10) : val),
  lowStockThreshold: z.union([z.string(), z.number()]).nullish().transform(val => val ? (typeof val === 'string' ? parseInt(val, 10) : val) : null),
});

export const insertSaleSchema = z.object({
  productId: z.string().nullish(),
  productName: z.string().min(1, "Product name is required"),
  customer: z.string().nullish(),
  quantity: z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? parseInt(val, 10) : val),
  unitPrice: z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? val : val.toString()),
  total: z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? val : val.toString()),
  date: z.union([z.string(), z.date()]).optional().transform(val => val ? (typeof val === 'string' ? new Date(val) : val) : new Date()),
});

export const insertExpenseSchema = z.object({
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.union([z.string(), z.number()]).transform(val => typeof val === 'string' ? val : val.toString()),
  date: z.union([z.string(), z.date()]).optional().transform(val => val ? (typeof val === 'string' ? new Date(val) : val) : new Date()),
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertSale = z.infer<typeof insertSaleSchema>;
export type InsertExpense = z.infer<typeof insertExpenseSchema>;
