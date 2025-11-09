import { useQuery } from "@tanstack/react-query";
import { DollarSign, TrendingDown, TrendingUp, Lightbulb, AlertTriangle, Package } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SalesTable } from "@/components/sales-table";
import { ExpensesTable } from "@/components/expenses-table";
import type { Sale, Expense, Product } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

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

export default function Dashboard() {
  const { data: sales = [], isLoading: salesLoading } = useQuery<Sale[]>({
    queryKey: ["/api/sales"],
  });

  const { data: expenses = [], isLoading: expensesLoading } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
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
              value={`₦${totalSales.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={DollarSign}
              testId="text-total-sales"
              valueClassName="text-emerald-600 dark:text-emerald-400"
            />
            <StatCard
              title="Total Expenses"
              value={`₦${totalExpenses.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={TrendingDown}
              testId="text-total-expenses"
              valueClassName="text-destructive"
            />
            <StatCard
              title="Net Profit"
              value={`₦${netProfit.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
              icon={netProfit >= 0 ? TrendingUp : TrendingDown}
              testId="text-net-profit"
              valueClassName={netProfit >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"}
            />
          </>
        )}
      </div>

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
