import { type Product, type InsertProduct, type Sale, type InsertSale, type Expense, type InsertExpense, type User } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Products (scoped by userId)
  getProducts(userId: string): Promise<Product[]>;
  getProduct(id: string, userId: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct, userId: string): Promise<Product>;
  updateProduct(id: string, userId: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string, userId: string): Promise<boolean>;
  reserveAndDecrementStock(productId: string, userId: string, quantity: number): Promise<{ success: boolean; error?: string; product?: Product }>;

  // Sales (scoped by userId)
  getSales(userId: string): Promise<Sale[]>;
  getSale(id: string, userId: string): Promise<Sale | undefined>;
  createSale(sale: InsertSale, userId: string): Promise<Sale>;
  updateSale(id: string, userId: string, sale: Partial<InsertSale>): Promise<Sale | undefined>;
  deleteSale(id: string, userId: string): Promise<boolean>;

  // Expenses (scoped by userId)
  getExpenses(userId: string): Promise<Expense[]>;
  getExpense(id: string, userId: string): Promise<Expense | undefined>;
  createExpense(expense: InsertExpense, userId: string): Promise<Expense>;
  updateExpense(id: string, userId: string, expense: Partial<InsertExpense>): Promise<Expense | undefined>;
  deleteExpense(id: string, userId: string): Promise<boolean>;

  // Users & Authentication
  getUserById(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(name: string, email: string, hashedPassword: string, businessType: string): Promise<User>;
  updateUserSubscription(email: string, planType: string, expiryDate: Date, reference: string): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private products: Map<string, Product>;
  private sales: Map<string, Sale>;
  private expenses: Map<string, Expense>;
  private users: Map<string, User>;
  private productLocks: Map<string, Promise<void>>;

  constructor() {
    this.products = new Map();
    this.sales = new Map();
    this.expenses = new Map();
    this.users = new Map();
    this.productLocks = new Map();
  }

  // Products (scoped by userId)
  async getProducts(userId: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(p => p.userId === userId);
  }

  async getProduct(id: string, userId: string): Promise<Product | undefined> {
    const product = this.products.get(id);
    return product && product.userId === userId ? product : undefined;
  }

  async createProduct(insertProduct: InsertProduct, userId: string): Promise<Product> {
    const id = randomUUID();
    const product: Product = {
      id,
      userId,
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

  async updateProduct(id: string, userId: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product || product.userId !== userId) return undefined;
    
    const updated = { ...product, ...updates };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string, userId: string): Promise<boolean> {
    const product = this.products.get(id);
    if (!product || product.userId !== userId) return false;
    return this.products.delete(id);
  }

  async reserveAndDecrementStock(
    productId: string, 
    userId: string, 
    quantity: number
  ): Promise<{ success: boolean; error?: string; product?: Product }> {
    // Wait for any existing lock on this product
    while (this.productLocks.has(productId)) {
      await this.productLocks.get(productId);
    }

    // Create a new lock for this product
    let releaseLock: () => void;
    const lockPromise = new Promise<void>((resolve) => {
      releaseLock = resolve;
    });
    this.productLocks.set(productId, lockPromise);

    try {
      // Atomically check stock and decrement
      const product = this.products.get(productId);
      
      if (!product) {
        return { success: false, error: "Product not found" };
      }
      
      if (product.userId !== userId) {
        return { success: false, error: "Product not found" };
      }
      
      if (product.quantity < quantity) {
        return { 
          success: false, 
          error: `Only ${product.quantity} units available, but ${quantity} requested` 
        };
      }
      
      // Decrement stock
      const updated = { ...product, quantity: product.quantity - quantity };
      this.products.set(productId, updated);
      
      return { success: true, product: updated };
    } finally {
      // Release the lock
      this.productLocks.delete(productId);
      releaseLock!();
    }
  }

  // Sales (scoped by userId)
  async getSales(userId: string): Promise<Sale[]> {
    return Array.from(this.sales.values()).filter(s => s.userId === userId);
  }

  async getSale(id: string, userId: string): Promise<Sale | undefined> {
    const sale = this.sales.get(id);
    return sale && sale.userId === userId ? sale : undefined;
  }

  async createSale(insertSale: InsertSale, userId: string): Promise<Sale> {
    const id = randomUUID();
    const sale: Sale = {
      id,
      userId,
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

  async updateSale(id: string, userId: string, updates: Partial<InsertSale>): Promise<Sale | undefined> {
    const sale = this.sales.get(id);
    if (!sale || sale.userId !== userId) return undefined;
    
    const updated = { ...sale, ...updates };
    this.sales.set(id, updated);
    return updated;
  }

  async deleteSale(id: string, userId: string): Promise<boolean> {
    const sale = this.sales.get(id);
    if (!sale || sale.userId !== userId) return false;
    return this.sales.delete(id);
  }

  // Expenses (scoped by userId)
  async getExpenses(userId: string): Promise<Expense[]> {
    return Array.from(this.expenses.values()).filter(e => e.userId === userId);
  }

  async getExpense(id: string, userId: string): Promise<Expense | undefined> {
    const expense = this.expenses.get(id);
    return expense && expense.userId === userId ? expense : undefined;
  }

  async createExpense(insertExpense: InsertExpense, userId: string): Promise<Expense> {
    const id = randomUUID();
    const expense: Expense = {
      id,
      userId,
      description: insertExpense.description,
      category: insertExpense.category,
      amount: insertExpense.amount,
      date: insertExpense.date,
    };
    this.expenses.set(id, expense);
    return expense;
  }

  async updateExpense(id: string, userId: string, updates: Partial<InsertExpense>): Promise<Expense | undefined> {
    const expense = this.expenses.get(id);
    if (!expense || expense.userId !== userId) return undefined;
    
    const updated = { ...expense, ...updates };
    this.expenses.set(id, updated);
    return updated;
  }

  async deleteExpense(id: string, userId: string): Promise<boolean> {
    const expense = this.expenses.get(id);
    if (!expense || expense.userId !== userId) return false;
    return this.expenses.delete(id);
  }

  // Users & Authentication
  async getUserById(id: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.id === id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.get(email.toLowerCase());
  }

  async createUser(name: string, email: string, hashedPassword: string, businessType: string): Promise<User> {
    const id = randomUUID();
    const user: User = {
      id,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      businessType,
      planType: "free",
      expiryDate: null,
      paystackReference: null,
      createdAt: new Date(),
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
