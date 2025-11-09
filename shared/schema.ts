import { sql } from "drizzle-orm";
import { pgTable, text, varchar, numeric, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  businessType: text("business_type").notNull(),
  planType: text("plan_type").notNull().default("trial"),
  trialEndsAt: timestamp("trial_ends_at"),
  subscriptionStartedAt: timestamp("subscription_started_at"),
  subscriptionEndsAt: timestamp("subscription_ends_at"),
  isActive: boolean("is_active").notNull().default(true),
  paystackReference: text("paystack_reference"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const products = pgTable("products", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  sku: text("sku"),
  category: text("category"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull().default(0),
  lowStockThreshold: integer("low_stock_threshold").default(10),
});

export const sales = pgTable("sales", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  productId: varchar("product_id").references(() => products.id),
  productName: text("product_name").notNull(),
  customer: text("customer"),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const expenses = pgTable("expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  description: text("description").notNull(),
  category: text("category").notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  userId: true,
}).extend({
  sku: z.string().nullish(),
  category: z.string().nullish(),
  lowStockThreshold: z.number().nullish(),
});

export const insertSaleSchema = createInsertSchema(sales).omit({
  id: true,
  userId: true,
}).extend({
  productId: z.string().nullish(),
  customer: z.string().nullish(),
  date: z.union([z.string(), z.date()]).optional().transform(val => val ? (typeof val === 'string' ? new Date(val) : val) : new Date()),
});

export const insertExpenseSchema = createInsertSchema(expenses).omit({
  id: true,
  userId: true,
}).extend({
  date: z.union([z.string(), z.date()]).optional().transform(val => val ? (typeof val === 'string' ? new Date(val) : val) : new Date()),
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

export type InsertSale = z.infer<typeof insertSaleSchema>;
export type Sale = typeof sales.$inferSelect;

export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expenses.$inferSelect;

export type User = typeof users.$inferSelect;

export const subscribeSchema = z.object({
  email: z.string().email(),
  plan: z.enum(["basic", "premium"]),
});

export type SubscribeRequest = z.infer<typeof subscribeSchema>;

export const paystackWebhookSchema = z.object({
  event: z.string(),
  data: z.object({
    reference: z.string(),
    status: z.string(),
    customer: z.object({
      email: z.string(),
    }),
  }),
});

export const taxCalculationSchema = z.object({
  monthlyProfit: z.number(),
  monthlySales: z.number(),
  businessType: z.enum(["personal", "small_business", "company"]).optional().default("small_business"),
});

export type TaxCalculationRequest = z.infer<typeof taxCalculationSchema>;

export const aiAdviceSchema = z.object({
  totalSales: z.number(),
  totalExpenses: z.number(),
  netProfit: z.number(),
  salesCount: z.number().optional(),
  context: z.string().optional(),
});

export type AIAdviceRequest = z.infer<typeof aiAdviceSchema>;

export const vendorSuggestionSchema = z.object({
  productName: z.string().optional(),
  category: z.string().optional(),
  location: z.string().optional().default("Nigeria"),
});

export type VendorSuggestionRequest = z.infer<typeof vendorSuggestionSchema>;

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  businessType: z.enum([
    "Retail & Products",
    "Restaurants & Food Services",
    "Hospitality (Hotels, Shortlets)",
    "Services (Salons, Repairs, Logistics, etc.)",
    "Agriculture & Farming"
  ], { errorMap: () => ({ message: "Invalid business type" }) }),
});

export type RegisterRequest = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type LoginRequest = z.infer<typeof loginSchema>;
