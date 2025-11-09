import { DollarSign, ShoppingCart, TrendingDown, Package } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SalesTable } from "@/components/sales-table";
import { ExpensesTable } from "@/components/expenses-table";

export default function Dashboard() {
  const mockSales = [
    { id: "1", date: "2024-11-08", customer: "John Doe", productName: "Widget A", quantity: 5, unitPrice: 1200, total: 6000 },
    { id: "2", date: "2024-11-07", customer: "Jane Smith", productName: "Widget B", quantity: 3, unitPrice: 2500, total: 7500 },
  ];

  const mockExpenses = [
    { id: "1", date: "2024-11-08", description: "Office Rent", category: "Rent", amount: 50000 },
    { id: "2", date: "2024-11-05", description: "Electricity Bill", category: "Utilities", amount: 15000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your business performance</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Sales"
          value="₦250,450"
          icon={DollarSign}
          trend={{ value: 12.5, isPositive: true }}
          testId="card-total-sales"
        />
        <StatCard
          title="Total Expenses"
          value="₦89,230"
          icon={TrendingDown}
          trend={{ value: 5.2, isPositive: false }}
          testId="card-total-expenses"
        />
        <StatCard
          title="Net Profit"
          value="₦161,220"
          icon={ShoppingCart}
          trend={{ value: 18.3, isPositive: true }}
          testId="card-net-profit"
        />
        <StatCard
          title="Products"
          value="48"
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
            <SalesTable sales={mockSales} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
            <CardDescription>Latest expenses recorded</CardDescription>
          </CardHeader>
          <CardContent>
            <ExpensesTable expenses={mockExpenses} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
