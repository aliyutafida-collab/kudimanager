import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, TrendingDown, TrendingUp, Lightbulb, AlertTriangle, Package, BarChart3, Bell, Sparkles, X } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SalesTable } from "@/components/sales-table";
import { ExpensesTable } from "@/components/expenses-table";
import { TrialBanner } from "@/components/trial-banner";
import { CurrencyDisplay } from "@/components/currency-display";
import type { Sale, Expense, Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/currency";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AIAdviceResponse {
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

interface SubscriptionInfo {
  planType: "trial" | "basic" | "premium";
  trialStatus: "active" | "warning" | "expired";
  trialDaysRemaining: number;
  canAccess: boolean;
  subscriptionActive: boolean;
  subscriptionEndsAt: string | null;
}

const MOTIVATIONAL_QUOTES = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "The way to get started is to quit talking and begin doing. - Walt Disney",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "The future depends on what you do today. - Mahatma Gandhi",
  "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
  "Opportunities don't happen. You create them. - Chris Grosser",
  "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt"
];

export default function Dashboard() {
  const [showReminder, setShowReminder] = useState(true);
  const [dailyQuote, setDailyQuote] = useState("");

  useEffect(() => {
    // Get daily quote based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setDailyQuote(MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length]);
  }, []);

  const { data: sales = [], isLoading: salesLoading } = useQuery<Sale[]>({
    queryKey: ["/api/sales"],
  });

  const { data: expenses = [], isLoading: expensesLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: subscriptionInfo } = useQuery<SubscriptionInfo>({
    queryKey: ["/api/user/subscription"],
  });

  const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.total.toString()), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount.toString()), 0);
  const netProfit = totalSales - totalExpenses;

  const { data: aiAdvice, isLoading: aiLoading } = useQuery<AIAdviceResponse>({
    queryKey: ["/api/ai/advice", totalSales, totalExpenses, netProfit],
    queryFn: async () => {
      const response = await apiRequest("POST", "/api/ai/advice", {
        totalSales,
        totalExpenses,
        netProfit,
        salesCount: sales.length,
      });
      return response.json();
    },
    enabled: !salesLoading && !expensesLoading,
  });

  const lowStockProducts = products.filter(
    (product) => product.quantity <= (product.lowStockThreshold || 10)
  );

  // Process monthly data for charts
  const getMonthlyData = () => {
    const monthlyMap = new Map<string, { sales: number; expenses: number }>();
    
    sales.forEach(sale => {
      const month = new Date(sale.date).toLocaleDateString('en-NG', { year: 'numeric', month: 'short' });
      const current = monthlyMap.get(month) || { sales: 0, expenses: 0 };
      monthlyMap.set(month, { ...current, sales: current.sales + parseFloat(sale.total.toString()) });
    });
    
    expenses.forEach(expense => {
      const month = new Date(expense.date).toLocaleDateString('en-NG', { year: 'numeric', month: 'short' });
      const current = monthlyMap.get(month) || { sales: 0, expenses: 0 };
      monthlyMap.set(month, { ...current, expenses: current.expenses + parseFloat(expense.amount.toString()) });
    });
    
    return Array.from(monthlyMap.entries())
      .map(([month, data]) => ({
        month,
        Sales: Math.round(data.sales),
        Expenses: Math.round(data.expenses),
        Profit: Math.round(data.sales - data.expenses)
      }))
      .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())
      .slice(-6); // Last 6 months
  };

  const monthlyData = getMonthlyData();

  // Smart reminders based on business data
  const getReminderMessage = (): string | null => {
    const today = new Date();
    const todaySales = sales.filter(s => 
      new Date(s.date).toDateString() === today.toDateString()
    );
    
    if (todaySales.length === 0 && today.getHours() >= 12) {
      return "Remember to record today's sales! Keep your records up to date.";
    }
    
    const thisWeekExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return expenseDate >= weekAgo;
    });
    
    const thisWeekExpensesTotal = thisWeekExpenses.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);
    const avgWeeklyExpenses = totalExpenses / Math.max(1, expenses.length / 4);
    
    if (thisWeekExpensesTotal > avgWeeklyExpenses * 1.2) {
      return "Expenses look higher than usual this week. Review your spending to stay on track.";
    }
    
    if (lowStockProducts.length > 0) {
      return `${lowStockProducts.length} product${lowStockProducts.length > 1 ? 's are' : ' is'} running low. Consider restocking soon.`;
    }
    
    return null;
  };

  const reminderMessage = getReminderMessage();

  const recentSales = sales
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(sale => ({
      ...sale,
      date: new Date(sale.date).toLocaleDateString(),
      customer: sale.customer || "-",
      unitPrice: parseFloat(sale.unitPrice.toString()),
      total: parseFloat(sale.total.toString()),
    }));

  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(expense => ({
      ...expense,
      date: new Date(expense.date).toLocaleDateString(),
      amount: parseFloat(expense.amount.toString()),
    }));

  const isLoading = salesLoading || expensesLoading || productsLoading;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business performance</p>
      </div>

      {subscriptionInfo && (
        <TrialBanner subscriptionInfo={subscriptionInfo} />
      )}

      {dailyQuote && (
        <Card className="border-accent/50 bg-gradient-to-r from-accent/5 to-transparent" data-testid="card-daily-quote">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm italic text-foreground/90">{dailyQuote}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {reminderMessage && showReminder && (
        <Card className="border-yellow-500/50 bg-yellow-500/5" data-testid="card-reminder">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm flex-1">{reminderMessage}</p>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 -mt-1"
                onClick={() => setShowReminder(false)}
                data-testid="button-close-reminder"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            <StatCard
              title="Total Sales"
              value={<CurrencyDisplay amount={totalSales} showDecimals />}
              icon={DollarSign}
              testId="text-total-sales"
              valueClassName="text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              title="Total Expenses"
              value={<CurrencyDisplay amount={totalExpenses} showDecimals />}
              icon={TrendingDown}
              testId="text-total-expenses"
              valueClassName="text-destructive"
            />
            <StatCard
              title="Net Profit"
              value={<CurrencyDisplay amount={netProfit} showDecimals />}
              icon={netProfit >= 0 ? TrendingUp : TrendingDown}
              testId="text-net-profit"
              valueClassName={netProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}
            />
          </>
        )}
      </div>

      <Card data-testid="section-analytics">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>Business Analytics</CardTitle>
          </div>
          <CardDescription>Monthly Sales, Expenses, and Profit Trends</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : monthlyData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <p>No data available. Start recording sales and expenses to see trends.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--foreground))' }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--foreground))' }}
                  tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--foreground))'
                  }}
                  formatter={(value: number) => formatCurrency(value)}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="Sales" 
                  stroke="#007F5F" 
                  strokeWidth={2}
                  dot={{ fill: '#007F5F' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Profit" 
                  stroke="#F4C542" 
                  strokeWidth={2}
                  dot={{ fill: '#F4C542' }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card data-testid="section-ai-tips">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-yellow-600 dark:text-yellow-400">Smart Business Tips</CardTitle>
            </div>
            <CardDescription>AI-powered insights for your business</CardDescription>
          </CardHeader>
          <CardContent>
            {aiLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ) : (
              <ul className="space-y-3">
                {aiAdvice?.insights.map((insight, index) => (
                  <li
                    key={index}
                    data-testid={`text-tip-${index + 1}`}
                    className="flex items-start gap-2"
                  >
                    <span className="text-yellow-500 font-semibold mt-0.5">•</span>
                    <span className="text-sm">{insight}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card data-testid="section-low-stock">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <CardTitle>Inventory Alerts</CardTitle>
            </div>
            <CardDescription>Products running low on stock</CardDescription>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            ) : lowStockProducts.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>All inventory levels are healthy</span>
              </div>
            ) : (
              <div className="space-y-3">
                {lowStockProducts.map((product) => (
                  <div
                    key={product.id}
                    data-testid={`alert-product-${product.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border hover-elevate"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Current: {product.quantity} | Threshold: {product.lowStockThreshold || 10}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
                      Low Stock
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {salesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <SalesTable sales={recentSales} />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Latest expenses recorded</CardDescription>
          </CardHeader>
          <CardContent>
            {expensesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            ) : (
              <ExpensesTable expenses={recentExpenses} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
