import { StatCard } from '../stat-card';
import { DollarSign, ShoppingCart, TrendingDown, Package } from 'lucide-react';

export default function StatCardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 p-4">
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
  );
}
