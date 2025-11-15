import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | ReactNode;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  testId?: string;
  valueClassName?: string;
}

export function StatCard({ title, value, icon: Icon, trend, testId, valueClassName }: StatCardProps) {
  return (
    <div className="dashboard-card" data-testid={testId}>
      <div className="flex items-center justify-between mb-3">
        <p className="card-title">{title}</p>
        <Icon className="h-4 w-4 text-muted-foreground/60" />
      </div>
      <div 
        className={valueClassName ? cn("card-value-base", valueClassName) : "card-value"} 
        data-testid={`${testId}-value`}
      >
        {value}
      </div>
      {trend && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
          {trend.isPositive ? (
            <TrendingUp className="h-3 w-3 text-emerald-600" />
          ) : (
            <TrendingDown className="h-3 w-3 text-destructive" />
          )}
          <span className={trend.isPositive ? "text-emerald-600" : "text-destructive"}>
            {trend.value}%
          </span>
          <span>vs last month</span>
        </div>
      )}
    </div>
  );
}
