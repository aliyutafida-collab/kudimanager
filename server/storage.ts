import { type Product, type InsertProduct, type Sale, type InsertSale, type Expense, type InsertExpense, type User } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;

  // Sales
  getSales(): Promise<Sale[]>;
  getSale(id: string): Promise<Sale | undefined>;
  createSale(sale: InsertSale): Promise<Sale>;
  updateSale(id: string, sale: Partial<InsertSale>): Promise<Sale | undefined>;
  deleteSale(id: string): Promise<boolean>;

  // Expenses
  getExpenses(): Promise<Expense[]>;
  getExpense(id: string): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense): Promise<Expense>;
  updateExpense(id: string, expense: Partial<InsertExpense>): Promise<Expense | undefined>;
  deleteExpense(id: string): Promise<boolean>;

  // Users/Subscriptions
  getUser(email: string): Promise<User | undefined>;
  createUser(email: string, planType: string, expiryDate: Date, reference: string): Promise<User>;
  updateUserSubscription(email: string, planType: string, expiryDate: Date, reference: string): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private sales: Map<string, Sale>;
  private expenses: Map<string, Expense>;
  private users: Map<string, User>;

  constructor() {
    this.products = new Map();
    this.sales = new Map();
    this.expenses = new Map();
    this.users = new Map();
  }

  // Products
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      id,
      name: insertProduct.name,
      sku: insertProduct.sku ?? null,
      category: insertProduct.category ?? null,
      price: insertProduct.price,
      quantity: insertProduct.quantity ?? 0,
      lowStockThreshold: insertProduct.lowStockThreshold ?? null,
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updated = { ...product, ...updates };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  // Sales
  async getSales(): Promise<Sale[]> {
    return Array.from(this.sales.values());
  }

  async getSale(id: string): Promise<Sale | undefined> {
    return this.sales.get(id);
  }

  async createSale(insertSale: InsertSale): Promise<Sale> {
    const id = randomUUID();
    const sale: Sale = {
      id,
      productId: insertSale.productId ?? null,
      productName: insertSale.productName,
      customer: insertSale.customer ?? null,
      quantity: insertSale.quantity,
      unitPrice: insertSale.unitPrice,
      total: insertSale.total,
      date: insertSale.date,
    };
    this.sales.set(id, sale);
    return sale;
  }

  async updateSale(id: string, updates: Partial<InsertSale>): Promise<Sale | undefined> {
    const sale = this.sales.get(id);
    if (!sale) return undefined;
    
    const updated = { ...sale, ...updates };
    this.sales.set(id, updated);
    return updated;
  }

  async deleteSale(id: string): Promise<boolean> {
    return this.sales.delete(id);
  }

  // Expenses
  async getExpenses(): Promise<Expense[]> {
    return Array.from(this.expenses.values());
  }

  async getExpense(id: string): Promise<Expense | undefined> {
    return this.expenses.get(id);
  }

  async createExpense(insertExpense: InsertExpense): Promise<Expense> {
    const id = randomUUID();
    const expense: Expense = {
      id,
      description: insertExpense.description,
      category: insertExpense.category,
      amount: insertExpense.amount,
      date: insertExpense.date,
    };
    this.expenses.set(id, expense);
    return expense;
  }

  async updateExpense(id: string, updates: Partial<InsertExpense>): Promise<Expense | undefined> {
    const expense = this.expenses.get(id);
    if (!expense) return undefined;
    
    const updated = { ...expense, ...updates };
    this.expenses.set(id, updated);
    return updated;
  }

  async deleteExpense(id: string): Promise<boolean> {
    return this.expenses.delete(id);
  }

  // Users/Subscriptions
  async getUser(email: string): Promise<User | undefined> {
    return this.users.get(email.toLowerCase());
  }

  async createUser(email: string, planType: string, expiryDate: Date, reference: string): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      email: email.toLowerCase(),
      planType,
      expiryDate,
      paystackReference: reference,
    };
    this.users.set(email.toLowerCase(), user);
    return user;
  }

  async updateUserSubscription(email: string, planType: string, expiryDate: Date, reference: string): Promise<User | undefined> {
    const user = this.users.get(email.toLowerCase());
    if (!user) return undefined;

    const updated: User = {
      ...user,
      planType,
      expiryDate,
      paystackReference: reference,
    };
    this.users.set(email.toLowerCase(), updated);
    return updated;
  }
}

export const storage = new MemStorage();
