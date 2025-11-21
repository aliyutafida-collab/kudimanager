import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { TrendingDown, TrendingUp, Lightbulb, AlertTriangle, Package, BarChart3, Bell, Sparkles, X } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { SalesTable } from "@/components/sales-table";
import { ExpensesTable } from "@/components/expenses-table";
import { TrialBanner } from "@/components/trial-banner";
import { CurrencyDisplay } from "@/components/currency-display";
import type { Sale, Expense, Product } from "@/types/schemas";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/currency";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { logEvent } from '@/lib/firebase';

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

const QUOTE_KEYS = [
  'dashboard.quotes.quote1',
  'dashboard.quotes.quote2',
  'dashboard.quotes.quote3',
  'dashboard.quotes.quote4',
  'dashboard.quotes.quote5',
  'dashboard.quotes.quote6',
  'dashboard.quotes.quote7',
];

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const [showReminder, setShowReminder] = useState(true);
  const [dailyQuoteKey, setDailyQuoteKey] = useState("");

  useEffect(() => {
    // Get daily quote based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    setDailyQuoteKey(QUOTE_KEYS[dayOfYear % QUOTE_KEYS.length]);
    
    // Log dashboard loaded event
    logEvent('dashboard_loaded', {
      language: i18n.language,
    });
  }, [i18n.language]);

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
      const date = new Date(sale.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const current = monthlyMap.get(monthKey) || { sales: 0, expenses: 0 };
      monthlyMap.set(monthKey, { ...current, sales: current.sales + parseFloat(sale.total.toString()) });
    });
    
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const current = monthlyMap.get(monthKey) || { sales: 0, expenses: 0 };
      monthlyMap.set(monthKey, { ...current, expenses: current.expenses + parseFloat(expense.amount.toString()) });
    });
    
    // Use current language for month display
    const locale = i18n.language === 'ha' ? 'ha-NG' : 
                   i18n.language === 'yo' ? 'yo-NG' : 
                   i18n.language === 'ig' ? 'ig-NG' : 'en-NG';
    
    return Array.from(monthlyMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6) // Last 6 months
      .map(([monthKey, data]) => {
        const [year, month] = monthKey.split('-');
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        return {
          month: date.toLocaleDateString(locale, { year: 'numeric', month: 'short' }),
          sales: Math.round(data.sales),
          expenses: Math.round(data.expenses),
          profit: Math.round(data.sales - data.expenses)
        };
      });
  };

  const monthlyData = getMonthlyData();

  // Smart reminders based on business data
  const getReminderMessage = (): { key: string; options?: any } | null => {
    const today = new Date();
    const todaySales = sales.filter(s => 
      new Date(s.date).toDateString() === today.toDateString()
    );
    
    if (todaySales.length === 0 && today.getHours() >= 12) {
      return { key: 'dashboard.reminders.recordSales' };
    }
    
    const thisWeekExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date);
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return expenseDate >= weekAgo;
    });
    
    const thisWeekExpensesTotal = thisWeekExpenses.reduce((sum, e) => sum + parseFloat(e.amount.toString()), 0);
    const avgWeeklyExpenses = totalExpenses / Math.max(1, expenses.length / 4);
    
    if (thisWeekExpensesTotal > avgWeeklyExpenses * 1.2) {
      return { key: 'dashboard.reminders.highExpenses' };
    }
    
    if (lowStockProducts.length > 0) {
      return { key: 'dashboard.reminders.lowStock', options: { count: lowStockProducts.length } };
    }
    
    return null;
  };

  const reminder = getReminderMessage();

  // Use current language for date formatting
  const locale = i18n.language === 'ha' ? 'ha-NG' : 
                 i18n.language === 'yo' ? 'yo-NG' : 
                 i18n.language === 'ig' ? 'ig-NG' : 'en-NG';

  const recentSales = sales
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(sale => ({
      ...sale,
      date: new Date(sale.date).toLocaleDateString(locale),
      customer: sale.customer || "-",
      unitPrice: parseFloat(sale.unitPrice.toString()),
      total: parseFloat(sale.total.toString()),
    }));

  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(expense => ({
      ...expense,
      date: new Date(expense.date).toLocaleDateString(locale),
      amount: parseFloat(expense.amount.toString()),
    }));

  const isLoading = salesLoading || expensesLoading || productsLoading;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="dashboard-header">{t('dashboard.pageTitle')}</h1>
        <p className="text-muted-foreground">{t('dashboard.pageSubtitle')}</p>
      </div>

      {subscriptionInfo && (
        <TrialBanner subscriptionInfo={subscriptionInfo} />
      )}

      {dailyQuoteKey && (
        <Card className="border-accent/50 bg-gradient-to-r from-accent/5 to-transparent" data-testid="card-daily-quote">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <p className="text-sm italic text-foreground/90">{t(dailyQuoteKey)}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {showReminder && (
        <Card 
          className={reminder ? "border-yellow-500/50 bg-yellow-500/5" : "border-emerald-500/50 bg-emerald-500/5"} 
          data-testid="card-reminder"
        >
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              {reminder ? (
                <Bell className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
              ) : (
                <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm flex-1">
                {reminder ? (
                  <>
                    {reminder.options 
                      ? t(reminder.key, reminder.options)
                      : t(reminder.key)
                    }
                  </>
                ) : (
                  t('dashboard.reminders.allHealthy')
                )}
              </p>
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

      <div className="dashboard-grid">
        {isLoading ? (
          <>
            <div className="dashboard-card">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="dashboard-card">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="dashboard-card">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div className="dashboard-card">
              <Skeleton className="h-4 w-24 mb-3" />
              <Skeleton className="h-8 w-32" />
            </div>
          </>
        ) : (
          <>
            <StatCard
              title={t('dashboard.totalSales')}
              value={<CurrencyDisplay amount={totalSales} />}
              icon={TrendingUp}
              testId="text-total-sales"
            />
            <StatCard
              title={t('dashboard.totalExpenses')}
              value={<CurrencyDisplay amount={totalExpenses} />}
              icon={TrendingDown}
              testId="text-total-expenses"
              valueClassName="text-destructive"
            />
            <StatCard
              title={t('dashboard.netProfit')}
              value={<CurrencyDisplay amount={netProfit} />}
              icon={netProfit >= 0 ? TrendingUp : TrendingDown}
              testId="text-net-profit"
              valueClassName={netProfit >= 0 ? undefined : "text-destructive"}
            />
            <StatCard
              title={t('dashboard.inventoryItems')}
              value={products.length.toString()}
              icon={Package}
              testId="text-inventory-count"
            />
          </>
        )}
      </div>

      <Card data-testid="section-analytics">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle>{t('dashboard.title')}</CardTitle>
          </div>
          <CardDescription>{t('dashboard.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-[300px] w-full" />
          ) : monthlyData.length === 0 ? (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              <p>{t('dashboard.chart.noData')}</p>
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
                  formatter={(value: number) => `₦${value.toLocaleString()}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="sales"
                  name={t('dashboard.chart.sales')}
                  stroke="#007F5F" 
                  strokeWidth={2}
                  dot={{ fill: '#007F5F' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses"
                  name={t('dashboard.chart.expenses')}
                  stroke="#ef4444" 
                  strokeWidth={2}
                  dot={{ fill: '#ef4444' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit"
                  name={t('dashboard.chart.profit')}
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
              <CardTitle className="text-yellow-600 dark:text-yellow-400">{t('dashboard.smartTips')}</CardTitle>
            </div>
            <CardDescription>{t('dashboard.smartTipsNote')}</CardDescription>
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
              <CardTitle>{t('dashboard.inventoryAlerts')}</CardTitle>
            </div>
            <CardDescription>{t('inventory.lowStock')}</CardDescription>
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
                <span>{t('dashboard.reminders.allHealthy')}</span>
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
                        {t('inventory.quantity')}: {product.quantity} | {t('inventory.lowStockThreshold')}: {product.lowStockThreshold || 10}
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20">
                      {t('inventory.lowStock')}
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
            <CardTitle>{t('sales.title')}</CardTitle>
            <CardDescription>{t('dashboard.recentSalesSubtitle')}</CardDescription>
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
            <CardTitle>{t('expenses.title')}</CardTitle>
            <CardDescription>{t('dashboard.recentExpensesSubtitle')}</CardDescription>
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
