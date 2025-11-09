import { useQuery } from "@tanstack/react-query";
import { DollarSign, ShoppingCart, TrendingDown, Package } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesTable } from "@/components/sales-table";
import { ExpensesTable } from "@/components/expenses-table";
import type { Sale, Expense, Product } from "@shared/schema";

export default function Dashboard() {
  const { data: sales = [] } = useQuery<Sale[]>({
    queryKey: ["/api/sales"],
  });

  const { data: expenses = [] } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const totalSales = sales.reduce((sum, sale) => sum + parseFloat(sale.total.toString()), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount.toString()), 0);
  const netProfit = totalSales - totalExpenses;

  const recentSales = sales
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(sale => ({
      ...sale,
      date: new Date(sale.date).toLocaleDateString(),
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sales"
          value={`₦${totalSales.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          testId="card-total-sales"
        />
        <StatCard
          title="Total Expenses"
          value={`₦${totalExpenses.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={TrendingDown}
          testId="card-total-expenses"
        />
        <StatCard
          title="Net Profit"
          value={`₦${netProfit.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={ShoppingCart}
          testId="card-net-profit"
        />
        <StatCard
          title="Products"
          value={products.length.toString()}
          icon={Package}
          testId="card-products"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
            <CardDescription>Latest transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesTable sales={recentSales} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Latest expenses recorded</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpensesTable expenses={recentExpenses} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
