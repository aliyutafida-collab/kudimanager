import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { DollarSign, TrendingDown, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Reports() {
  const topProducts = [
    { name: "Widget A", sales: 45, revenue: 54000 },
    { name: "Widget B", sales: 32, revenue: 80000 },
    { name: "Widget D", sales: 28, revenue: 84000 },
  ];

  const expensesByCategory = [
    { category: "Salaries", amount: 120000, percentage: 41 },
    { category: "Rent", amount: 50000, percentage: 17 },
    { category: "Marketing", amount: 25000, percentage: 9 },
    { category: "Utilities", amount: 15000, percentage: 5 },
    { category: "Supplies", amount: 8500, percentage: 3 },
    { category: "Other", amount: 74500, percentage: 25 },
  ];

  const handleExport = (format: string) => {
    console.log(`Exporting report as ${format}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Reports</h1>
          <p className="text-muted-foreground">Monthly business performance reports</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-select-month">
            <Calendar className="h-4 w-4 mr-2" />
            November 2024
          </Button>
          <Button variant="outline" onClick={() => handleExport("pdf")} data-testid="button-export-pdf">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport("csv")} data-testid="button-export-csv">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Sales"
          value="₦250,450"
          icon={DollarSign}
          testId="card-report-sales"
        />
        <StatCard
          title="Total Expenses"
          value="₦293,000"
          icon={TrendingDown}
          testId="card-report-expenses"
        />
        <StatCard
          title="Net Profit"
          value="-₦42,550"
          icon={TrendingUp}
          testId="card-report-profit"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling products this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between" data-testid={`product-${index}`}>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium" data-testid={`product-name-${index}`}>{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.sales} units sold</p>
                    </div>
                  </div>
                  <p className="font-mono font-semibold" data-testid={`product-revenue-${index}`}>₦{product.revenue.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Breakdown of monthly expenses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expensesByCategory.map((item, index) => (
                <div key={item.category} className="space-y-2" data-testid={`expense-category-${index}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" data-testid={`category-name-${index}`}>{item.category}</Badge>
                      <span className="text-sm text-muted-foreground">{item.percentage}%</span>
                    </div>
                    <p className="font-mono font-semibold" data-testid={`category-amount-${index}`}>₦{item.amount.toLocaleString()}</p>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
