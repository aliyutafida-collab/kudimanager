import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertProductSchema, 
  insertSaleSchema, 
  insertExpenseSchema,
  subscribeSchema,
  paystackWebhookSchema,
  taxCalculationSchema,
  aiAdviceSchema,
  vendorSuggestionSchema,
  registerSchema,
  loginSchema
} from "@shared/schema";
import { GoogleGenAI } from "@google/genai";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { canAccessDashboard, getSubscriptionInfo } from "./subscription-utils";

const JWT_SECRET = process.env.JWT_SECRET || "kudiman ager-secret-key-change-in-production";
const SALT_ROUNDS = 10;

interface AuthRequest extends Request {
  userId?: string;
}

async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("[AUTH] Token verification failed:", error);
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
}

async function subscriptionMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized - No user ID" });
    }

    const user = await storage.getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!canAccessDashboard(user)) {
      const subscriptionInfo = getSubscriptionInfo(user);
      return res.status(403).json({ 
        error: "Subscription required",
        message: "Your trial has ended. Please subscribe to continue using KudiManager.",
        subscriptionInfo: {
          planType: subscriptionInfo.planType,
          trialStatus: subscriptionInfo.trialStatus,
          trialDaysRemaining: subscriptionInfo.trialDaysRemaining,
          canAccess: subscriptionInfo.canAccess
        }
      });
    }

    next();
  } catch (error) {
    console.error("[SUBSCRIPTION] Subscription check failed:", error);
    return res.status(500).json({ error: "Subscription check failed" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication endpoints
  app.post("/api/register", async (req, res) => {
    try {
      console.log("[REGISTER] Registration request received:", { email: req.body.email, name: req.body.name, businessType: req.body.businessType });
      const validatedData = registerSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        console.log("[REGISTER] Registration failed - email already exists:", validatedData.email);
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(validatedData.password, SALT_ROUNDS);
      const user = await storage.createUser(
        validatedData.name,
        validatedData.email,
        hashedPassword,
        validatedData.businessType
      );

      console.log("[REGISTER] User registered successfully:", { userId: user.id, email: user.email, businessType: user.businessType });

      res.status(201).json({
        success: true,
        message: "Registration successful",
        user_id: user.id,
        name: user.name,
        email: user.email,
        businessType: user.businessType
      });
    } catch (error) {
      console.error("[REGISTER] Registration error:", error);
      if (error instanceof Error && 'errors' in error) {
        return res.status(400).json({ error: "Validation failed", details: error.message });
      }
      res.status(500).json({ error: "Registration failed" });
    }
  });

  app.post("/api/login", async (req, res) => {
    try {
      console.log("[LOGIN] Login attempt:", { email: req.body.email });
      const validatedData = loginSchema.parse(req.body);

      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        console.log("[LOGIN] Login failed - user not found:", validatedData.email);
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const passwordMatch = await bcrypt.compare(validatedData.password, user.password);
      if (!passwordMatch) {
        console.log("[LOGIN] Login failed - invalid password for:", validatedData.email);
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });
      const subscriptionInfo = getSubscriptionInfo(user);
      
      console.log("[LOGIN] Login successful:", { userId: user.id, email: user.email });

      res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          businessType: user.businessType,
          planType: user.planType,
          subscriptionInfo
        }
      });
    } catch (error) {
      console.error("[LOGIN] Login error:", error);
      if (error instanceof Error && 'errors' in error) {
        return res.status(400).json({ error: "Validation failed", details: error.message });
      }
      res.status(500).json({ error: "Login failed" });
    }
  });

  // Get subscription status (protected)
  app.get("/api/user/subscription", authMiddleware, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUserById(req.userId!);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      const subscriptionInfo = getSubscriptionInfo(user);
      res.json(subscriptionInfo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription info" });
    }
  });

  // Products endpoints (protected)
  app.get("/api/products", authMiddleware, subscriptionMiddleware, async (req: AuthRequest, res) => {
    try {
      const products = await storage.getProducts(req.userId!);
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", authMiddleware, subscriptionMiddleware, async (req: AuthRequest, res) => {
    try {
      const product = await storage.getProduct(req.params.id, req.userId!);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch product" });
    }
  });

  app.post("/api/products", authMiddleware, subscriptionMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validatedData, req.userId!);
      res.status(201).json(product);
    } catch (error) {
      res.status(400).json({ error: "Invalid product data" });
    }
  });

  app.patch("/api/products/:id", authMiddleware, subscriptionMiddleware, async (req: AuthRequest, res) => {
    try {
      const product = await storage.updateProduct(req.params.id, req.userId!, req.body);
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", authMiddleware, subscriptionMiddleware, async (req: AuthRequest, res) => {
    try {
      const deleted = await storage.deleteProduct(req.params.id, req.userId!);
      if (!deleted) {
        return res.status(404).json({ error: "Product not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  });

  // Sales endpoints
  app.get("/api/sales", authMiddleware, subscriptionMiddleware, async (req: AuthRequest, res) => {
    try {
      const sales = await storage.getSales(req.userId!);
      res.json(sales);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sales" });
    }
  });

  app.get("/api/sales/:id", authMiddleware, subscriptionMiddleware, async (req: AuthRequest, res) => {
    try {
      const sale = await storage.getSale(req.params.id, req.userId!);
      if (!sale) {
        return res.status(404).json({ error: "Sale not found" });
      }
      res.json(sale);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch sale" });
    }
  });

  app.post("/api/sales", authMiddleware, subscriptionMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertSaleSchema.parse(req.body);
      
      // Atomically reserve and decrement stock BEFORE creating sale
      if (validatedData.productId) {
        const result = await storage.reserveAndDecrementStock(
          validatedData.productId, 
          req.userId!, 
          validatedData.quantity
        );
        
        if (!result.success) {
          return res.status(400).json({ 
            error: result.error === "Product not found" ? "Product not found" : "Insufficient stock",
            details: result.error
          });
        }
        
        // Create sale only after stock reservation succeeds
        const sale = await storage.createSale(validatedData, req.userId!);
        return res.status(201).json(sale);
      }
      
      // If no productId, just create the sale (manual entry)
      const sale = await storage.createSale(validatedData, req.userId!);
      res.status(201).json(sale);
    } catch (error) {
      console.error("Sale validation error:", error);
      res.status(400).json({ error: "Invalid sale data", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.patch("/api/sales/:id", authMiddleware, subscriptionMiddleware, async (req: AuthRequest, res) => {
    try {
      const sale = await storage.updateSale(req.params.id, req.userId!, req.body);
      if (!sale) {
        return res.status(404).json({ error: "Sale not found" });
      }
      res.json(sale);
    } catch (error) {
      res.status(400).json({ error: "Failed to update sale" });
    }
  });

  app.delete("/api/sales/:id", authMiddleware, subscriptionMiddleware, async (req: AuthRequest, res) => {
    try {
      const deleted = await storage.deleteSale(req.params.id, req.userId!);
      if (!deleted) {
        return res.status(404).json({ error: "Sale not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete sale" });
    }
  });

  // Expenses endpoints
  app.get("/api/expenses", authMiddleware, subscriptionMiddleware, async (req: AuthRequest, res) => {
    try {
      const expenses = await storage.getExpenses(req.userId!);
      res.json(expenses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expenses" });
    }
  });

  app.get("/api/expenses/:id", authMiddleware, subscriptionMiddleware, async (req: AuthRequest, res) => {
    try {
      const expense = await storage.getExpense(req.params.id, req.userId!);
      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }
      res.json(expense);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch expense" });
    }
  });

  app.post("/api/expenses", authMiddleware, subscriptionMiddleware, async (req: AuthRequest, res) => {
    try {
      const validatedData = insertExpenseSchema.parse(req.body);
      const expense = await storage.createExpense(validatedData, req.userId!);
      res.status(201).json(expense);
    } catch (error) {
      res.status(400).json({ error: "Invalid expense data" });
    }
  });

  app.patch("/api/expenses/:id", authMiddleware, subscriptionMiddleware, async (req: AuthRequest, res) => {
    try {
      const expense = await storage.updateExpense(req.params.id, req.userId!, req.body);
      if (!expense) {
        return res.status(404).json({ error: "Expense not found" });
      }
      res.json(expense);
    } catch (error) {
      res.status(400).json({ error: "Failed to update expense" });
    }
  });

  app.delete("/api/expenses/:id", authMiddleware, subscriptionMiddleware, async (req: AuthRequest, res) => {
    try {
      const deleted = await storage.deleteExpense(req.params.id, req.userId!);
      if (!deleted) {
        return res.status(404).json({ error: "Expense not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete expense" });
    }
  });

  // Monthly reports endpoint
  app.get("/api/reports/monthly", authMiddleware, subscriptionMiddleware, async (req: AuthRequest, res) => {
    try {
      const sales = await storage.getSales(req.userId!);
      const expenses = await storage.getExpenses(req.userId!);
      
      const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.total.toString()), 0);
      const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount.toString()), 0);
      const netProfit = totalSales - totalExpenses;

      // Group sales by product
      const productSales = sales.reduce((acc, sale) => {
        if (!acc[sale.productName]) {
          acc[sale.productName] = { name: sale.productName, quantity: 0, revenue: 0 };
        }
        acc[sale.productName].quantity += sale.quantity;
        acc[sale.productName].revenue += parseFloat(sale.total.toString());
        return acc;
      }, {} as Record<string, { name: string; quantity: number; revenue: number }>);

      // Group expenses by category
      const expensesByCategory = expenses.reduce((acc, expense) => {
        if (!acc[expense.category]) {
          acc[expense.category] = { category: expense.category, amount: 0 };
        }
        acc[expense.category].amount += parseFloat(expense.amount.toString());
        return acc;
      }, {} as Record<string, { category: string; amount: number }>);

      const topProducts = Object.values(productSales)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);

      const categoryBreakdown = Object.values(expensesByCategory).map(item => ({
        ...item,
        percentage: totalExpenses > 0 ? Math.round((item.amount / totalExpenses) * 100) : 0
      }));

      res.json({
        summary: {
          totalSales,
          totalExpenses,
          netProfit,
          salesCount: sales.length,
          expensesCount: expenses.length
        },
        topProducts,
        expensesByCategory: categoryBreakdown
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate report" });
    }
  });

  // Subscription endpoints
  app.post("/api/subscribe", async (req, res) => {
    try {
      console.log("[SUBSCRIBE] Request received:", req.body);
      const validatedData = subscribeSchema.parse(req.body);
      
      const planPrices = {
        basic: 2500,
        premium: 5000
      };

      const amount = planPrices[validatedData.plan];
      const reference = `KM-${validatedData.plan}-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      console.log(`[SUBSCRIBE] Initiating ${validatedData.plan} plan for ${validatedData.email} - Amount: ₦${amount}`);

      res.status(200).json({
        success: true,
        reference,
        amount,
        plan: validatedData.plan,
        email: validatedData.email,
        paystackUrl: `https://paystack.com/pay/${reference}`,
        message: "Payment initiated. In production, redirect user to Paystack payment page and verify Paystack webhook signature."
      });
    } catch (error) {
      console.error("[SUBSCRIBE] Error:", error);
      res.status(400).json({ 
        error: "Invalid subscription data",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  app.post("/api/paystack/webhook", async (req, res) => {
    try {
      console.log("[WEBHOOK] Paystack webhook received");
      
      console.warn("[WEBHOOK SECURITY] WARNING: Signature verification not implemented.");
      console.warn("[WEBHOOK SECURITY] PRODUCTION TODO: Verify Paystack signature before processing.");
      console.warn("[WEBHOOK SECURITY] Implementation: const crypto = require('crypto'); const hash = crypto.createHmac('sha512', PAYSTACK_SECRET_KEY).update(JSON.stringify(req.body)).digest('hex'); if (hash !== req.headers['x-paystack-signature']) return res.status(401).json({error: 'Invalid signature'});");
      
      const validatedData = paystackWebhookSchema.parse(req.body);

      if (validatedData.event === "charge.success" && validatedData.data.status === "success") {
        const email = validatedData.data.customer.email;
        const reference = validatedData.data.reference;

        const planDurations = {
          basic: 30,
          premium: 30
        };

        const planMatch = reference.match(/KM-(basic|premium)-/);
        if (!planMatch) {
          console.error("[WEBHOOK] Invalid reference format, cannot determine plan");
          return res.status(400).json({ error: "Invalid payment reference format" });
        }

        const planType = planMatch[1] as "basic" | "premium";
        const subscriptionEndsAt = new Date();
        subscriptionEndsAt.setDate(subscriptionEndsAt.getDate() + planDurations[planType]);

        const existingUser = await storage.getUserByEmail(email);
        
        if (existingUser) {
          await storage.updateUserSubscription(email, planType, subscriptionEndsAt, reference);
          console.log(`[WEBHOOK] Updated subscription for ${email} - Plan: ${planType}, Expires: ${subscriptionEndsAt}`);
        } else {
          console.error(`[WEBHOOK] User not found for email: ${email}`);
          return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ success: true, message: "Subscription updated" });
      } else {
        console.log("[WEBHOOK] Payment not successful, ignoring");
        res.status(200).json({ success: true, message: "Event received but not processed" });
      }
    } catch (error) {
      console.error("[WEBHOOK] Error:", error);
      res.status(400).json({ 
        error: "Invalid webhook data",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Learning & Tutorial API
  app.get("/api/guide", async (req, res) => {
    try {
      console.log("[GUIDE] Financial management guide requested");
      const guide = {
        title: "KudiManager Financial Management Guide",
        description: "Essential tips for small business success in Nigeria",
        topics: [
          {
            id: "sales",
            title: "Sales Tracking",
            content: "Record every sale, no matter how small. Track customer names, product details, and payment dates. This helps you identify your best-selling products and most valuable customers.",
            tips: [
              "Record sales immediately after each transaction",
              "Keep customer contact information for follow-ups",
              "Review weekly sales trends to identify patterns",
              "Offer discounts strategically during slow periods"
            ]
          },
          {
            id: "expenses",
            title: "Expense Management",
            content: "Track all business expenses including rent, utilities, supplies, and transportation. Categorize expenses to understand where your money goes.",
            tips: [
              "Keep receipts for all business purchases",
              "Separate personal and business expenses",
              "Review monthly expense categories to find savings",
              "Negotiate with suppliers for better rates"
            ]
          },
          {
            id: "inventory",
            title: "Inventory Control",
            content: "Monitor stock levels to avoid overstocking or running out of popular items. Set low stock alerts to reorder on time.",
            tips: [
              "Count inventory weekly or monthly",
              "Use FIFO (First In, First Out) for perishables",
              "Track which products sell fastest",
              "Maintain good supplier relationships"
            ]
          },
          {
            id: "profit",
            title: "Understanding Profit",
            content: "Profit = Total Sales - Total Expenses. Aim for at least 20-30% profit margin. Track monthly to see if your business is growing.",
            tips: [
              "Calculate profit margin: (Profit ÷ Sales) × 100",
              "Reinvest profits back into the business",
              "Save 10-20% of profits for emergencies",
              "Review profit trends monthly"
            ]
          },
          {
            id: "taxes",
            title: "Nigerian Tax Basics",
            content: "Small companies with annual turnover up to ₦25M are exempt from company income tax (0%). Companies with ₦25M-₦100M turnover pay 20%, and above ₦100M pay 30%. VAT is 7.5% on applicable sales. Keep accurate records for tax filing.",
            tips: [
              "Register your business with CAC",
              "Get a Tax Identification Number (TIN)",
              "Small companies (≤₦25M turnover) pay 0% company tax",
              "File tax returns annually by June 30th",
              "VAT-registered businesses must remit 7.5% VAT monthly",
              "Consult with an accountant for accurate compliance"
            ]
          },
          {
            id: "consistency",
            title: "Consistency is Key",
            content: "Update your records daily. Weekly reviews help you spot problems early. Monthly reports show business trends.",
            tips: [
              "Set aside time each day for record-keeping",
              "Use KudiManager regularly for best results",
              "Compare month-to-month performance",
              "Celebrate small wins to stay motivated"
            ]
          }
        ],
        additionalResources: [
          "Nigerian SME toolkit: https://smedan.gov.ng",
          "CAC business registration: https://cac.gov.ng",
          "FIRS tax information: https://firs.gov.ng"
        ]
      };

      res.json(guide);
    } catch (error) {
      console.error("[GUIDE] Error:", error);
      res.status(500).json({ error: "Failed to fetch guide" });
    }
  });

  // Nigerian Tax Calculator
  app.post("/api/tax", async (req, res) => {
    try {
      console.log("[TAX] Tax calculation requested:", req.body);
      const validatedData = taxCalculationSchema.parse(req.body);

      const { monthlyProfit, monthlySales, businessType } = validatedData;
      const annualProfit = monthlyProfit * 12;
      const annualSales = monthlySales * 12;

      let companyTax = 0;
      let vat = 0;
      let advice = "";

      if (businessType === "small_business" || businessType === "company") {
        if (annualSales <= 25000000) {
          companyTax = 0;
          advice = "As a small company with annual turnover up to ₦25M, you are exempt from company income tax (0% rate).";
        } else if (annualSales <= 100000000) {
          companyTax = annualProfit * 0.20;
          advice = "Your annual turnover is between ₦25M and ₦100M. You pay 20% company income tax on profits.";
        } else {
          companyTax = annualProfit * 0.30;
          advice = "Your annual turnover exceeds ₦100M. Standard company tax rate of 30% applies.";
        }
      } else {
        companyTax = annualProfit * 0.07;
        advice = "Personal income tax varies by state (typically 7-24% depending on income). This is an estimate. Consult a tax professional.";
      }

      vat = monthlySales > 0 ? annualSales * 0.075 : 0;

      const monthlyTax = companyTax / 12;
      const monthlyVAT = vat / 12;

      console.log(`[TAX] Calculated - Monthly Tax: ₦${monthlyTax.toFixed(2)}, Monthly VAT: ₦${monthlyVAT.toFixed(2)}`);

      res.json({
        success: true,
        calculation: {
          monthlyProfit,
          monthlySales,
          annualProfit,
          annualSales,
          businessType
        },
        tax: {
          estimatedAnnualTax: Math.round(companyTax),
          estimatedMonthlyTax: Math.round(monthlyTax),
          estimatedAnnualVAT: Math.round(vat),
          estimatedMonthlyVAT: Math.round(monthlyVAT),
          totalAnnualObligation: Math.round(companyTax + vat),
          totalMonthlyObligation: Math.round(monthlyTax + monthlyVAT)
        },
        advice,
        guidance: [
          "Register with FIRS for Tax Identification Number (TIN)",
          "File annual tax returns by June 30th",
          "Keep accurate financial records for at least 6 years",
          "VAT-registered businesses must remit VAT monthly",
          "Consider consulting a tax professional for compliance",
          "FCT and state taxes may apply separately"
        ]
      });
    } catch (error) {
      console.error("[TAX] Error:", error);
      res.status(400).json({ 
        error: "Invalid tax calculation data",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // AI Business Advisory (Gemini)
  app.post("/api/ai/advice", async (req, res) => {
    let validatedData;
    
    try {
      console.log("[AI_ADVICE] Request received:", req.body);
      validatedData = aiAdviceSchema.parse(req.body);

      const ai = new GoogleGenAI({
        apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY || "",
        vertexai: false,
        httpOptions: {
          baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL
        }
      });

      const { totalSales, totalExpenses, netProfit, salesCount, context } = validatedData;
      const profitMargin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : "0";

      const prompt = `You are a financial advisor for small businesses in Nigeria. Analyze this business data and provide exactly 3 short, actionable insights (each 1-2 sentences):

Business Metrics:
- Total Sales: ₦${totalSales.toLocaleString()}
- Total Expenses: ₦${totalExpenses.toLocaleString()}
- Net Profit: ₦${netProfit.toLocaleString()}
- Profit Margin: ${profitMargin}%
${salesCount ? `- Number of Sales: ${salesCount}` : ""}
${context ? `- Additional Context: ${context}` : ""}

Provide 3 specific, actionable recommendations. Be concise and practical. Focus on Nigerian business context.`;

      console.log("[AI_ADVICE] Calling Gemini API...");
      const response = await ai.models.generateContent({
        model: "gemini-1.5-pro",
        contents: prompt
      });
      const advice = response.text || "";

      const insights = advice
        .split("\n")
        .filter((line: string) => line.trim().length > 0)
        .map((line: string) => line.replace(/^\d+\.\s*/, "").replace(/^[-*]\s*/, "").trim())
        .filter((line: string) => line.length > 10)
        .slice(0, 3);

      console.log("[AI_ADVICE] Generated insights:", insights);

      res.json({
        success: true,
        metrics: {
          totalSales,
          totalExpenses,
          netProfit,
          profitMargin: `${profitMargin}%`
        },
        insights: insights.length === 3 ? insights : [
          "Focus on increasing your profit margin by reducing unnecessary expenses",
          "Track your best-selling products and invest more in inventory for those items",
          "Set aside 15-20% of profits monthly for business growth and emergencies"
        ],
        generatedBy: insights.length === 3 ? "Gemini AI" : "Fallback Advice"
      });
    } catch (error) {
      console.error("[AI_ADVICE] Error:", error);
      
      if (!validatedData) {
        return res.status(400).json({ error: "Invalid request data" });
      }
      
      const { totalSales, totalExpenses, netProfit } = validatedData;
      const profitMargin = totalSales > 0 ? ((netProfit / totalSales) * 100).toFixed(1) : "0";
      
      res.status(200).json({ 
        success: true,
        metrics: {
          totalSales,
          totalExpenses,
          netProfit,
          profitMargin: `${profitMargin}%`
        },
        insights: [
          "Focus on increasing your profit margin by reducing unnecessary expenses",
          "Track your best-selling products and invest more in inventory for those items",
          "Set aside 15-20% of profits monthly for business growth and emergencies"
        ],
        generatedBy: "Fallback Advice",
        note: "AI service temporarily unavailable. Using fallback business advice."
      });
    }
  });

  // Vendor Suggestion System (Mock AI)
  app.post("/api/vendors/suggest", async (req, res) => {
    try {
      console.log("[VENDORS] Vendor suggestion requested:", req.body);
      const validatedData = vendorSuggestionSchema.parse(req.body);

      const { productName, category, location } = validatedData;

      const nigerianVendorDatabase = [
        { name: "Alaba International Market", location: "Lagos", specialties: ["Electronics", "Gadgets", "Accessories"], contact: "+234-XXX-XXX-XXXX" },
        { name: "Ariaria Market", location: "Aba", specialties: ["Shoes", "Bags", "Leather Goods"], contact: "+234-XXX-XXX-XXXX" },
        { name: "Balogun Market", location: "Lagos", specialties: ["Fabrics", "Textiles", "Fashion"], contact: "+234-XXX-XXX-XXXX" },
        { name: "Computer Village", location: "Lagos", specialties: ["Electronics", "Computer", "Tech"], contact: "+234-XXX-XXX-XXXX" },
        { name: "Dawanau Market", location: "Kano", specialties: ["Grains", "Agricultural Products", "Food"], contact: "+234-XXX-XXX-XXXX" },
        { name: "Onitsha Main Market", location: "Onitsha", specialties: ["General Goods", "Wholesale", "Retail"], contact: "+234-XXX-XXX-XXXX" },
        { name: "Wuse Market", location: "Abuja", specialties: ["Food", "Vegetables", "Fresh Produce"], contact: "+234-XXX-XXX-XXXX" },
        { name: "Oshodi Market", location: "Lagos", specialties: ["Spare Parts", "Auto Accessories", "Tools"], contact: "+234-XXX-XXX-XXXX" },
        { name: "Kurmi Market", location: "Kano", specialties: ["Textiles", "Leather", "Crafts"], contact: "+234-XXX-XXX-XXXX" },
      ];

      let suggestions = nigerianVendorDatabase
        .filter(vendor => {
          if (category) {
            return vendor.specialties.some(s => 
              s.toLowerCase().includes(category.toLowerCase()) ||
              category.toLowerCase().includes(s.toLowerCase())
            );
          }
          if (productName) {
            return vendor.specialties.some(s => 
              productName.toLowerCase().includes(s.toLowerCase()) ||
              s.toLowerCase().includes(productName.toLowerCase())
            );
          }
          return true;
        })
        .slice(0, 3);

      if (suggestions.length < 3) {
        suggestions = nigerianVendorDatabase.slice(0, 3);
      }

      const mockAIInsight = `Based on your search for ${productName || category || "products"}, these vendors in ${location} are recommended for quality and competitive pricing.`;

      console.log(`[VENDORS] Returning ${suggestions.length} vendor suggestions`);

      res.json({
        success: true,
        query: {
          productName: productName || null,
          category: category || null,
          location
        },
        suggestions: suggestions.map(vendor => ({
          ...vendor,
          whyRecommended: `Specializes in ${vendor.specialties.join(", ")}. Known for competitive prices and reliable supply.`,
          estimatedDelivery: "2-5 business days",
          paymentTerms: "Cash, Transfer, or Credit (for established customers)"
        })),
        aiInsight: mockAIInsight,
        note: "Contact vendors directly to negotiate pricing and confirm availability. In production, this would use AI to match your specific needs with vendor capabilities."
      });
    } catch (error) {
      console.error("[VENDORS] Error:", error);
      res.status(400).json({ 
        error: "Invalid vendor suggestion request",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
