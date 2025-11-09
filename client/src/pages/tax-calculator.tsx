import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Calculator, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface TaxCalculation {
  success: boolean;
  calculation: {
    monthlyProfit: number;
    monthlySales: number;
    annualProfit: number;
    annualSales: number;
    businessType: string;
  };
  tax: {
    estimatedAnnualTax: number;
    estimatedMonthlyTax: number;
    estimatedAnnualVAT: number;
    estimatedMonthlyVAT: number;
    totalAnnualObligation: number;
    totalMonthlyObligation: number;
  };
  advice: string;
  guidance: string[];
}

export default function TaxCalculator() {
  const [monthlySales, setMonthlySales] = useState("");
  const [monthlyExpenses, setMonthlyExpenses] = useState("");
  const [result, setResult] = useState<TaxCalculation | null>(null);
  const { toast } = useToast();

  const calculateMutation = useMutation({
    mutationFn: async (data: { monthlySales: number; monthlyExpenses: number }) => {
      const monthlyProfit = data.monthlySales - data.monthlyExpenses;
      const response = await apiRequest("POST", "/api/tax", {
        monthlyProfit,
        monthlySales: data.monthlySales,
        businessType: "small_business",
      });
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "Tax Calculated",
        description: "Your tax breakdown has been calculated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Calculation Failed",
        description: error instanceof Error ? error.message : "Failed to calculate tax",
        variant: "destructive",
      });
    },
  });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const sales = parseFloat(monthlySales);
    const expenses = parseFloat(monthlyExpenses);

    if (isNaN(sales) || isNaN(expenses)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers for sales and expenses",
        variant: "destructive",
      });
      return;
    }

    if (sales < 0 || expenses < 0) {
      toast({
        title: "Invalid Input",
        description: "Sales and expenses must be positive numbers",
        variant: "destructive",
      });
      return;
    }

    calculateMutation.mutate({ monthlySales: sales, monthlyExpenses: expenses });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">Nigerian Tax Calculator</h1>
        <p className="text-muted-foreground">
          Calculate your estimated tax obligations based on Nigerian tax laws
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Tax Calculation
            </CardTitle>
            <CardDescription>Enter your monthly financials</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCalculate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="sales">Monthly Sales (₦)</Label>
                <Input
                  id="sales"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={monthlySales}
                  onChange={(e) => setMonthlySales(e.target.value)}
                  data-testid="input-sales"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expenses">Monthly Expenses (₦)</Label>
                <Input
                  id="expenses"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={monthlyExpenses}
                  onChange={(e) => setMonthlyExpenses(e.target.value)}
                  data-testid="input-expenses"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={calculateMutation.isPending}
                data-testid="button-calculate"
              >
                {calculateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Calculating...
                  </>
                ) : (
                  "Calculate Tax"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Tax Breakdown</CardTitle>
              <CardDescription>{result.advice}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex justify-between items-center p-3 rounded-md bg-muted">
                  <span className="text-sm font-medium">Monthly Corporate Tax</span>
                  <span className="font-mono text-lg font-semibold" data-testid="text-corporate-tax">
                    ₦{result.tax.estimatedMonthlyTax.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-md bg-muted">
                  <span className="text-sm font-medium">Monthly VAT (7.5%)</span>
                  <span className="font-mono text-lg font-semibold" data-testid="text-vat">
                    ₦{result.tax.estimatedMonthlyVAT.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 rounded-md bg-primary text-primary-foreground">
                  <span className="text-sm font-semibold">Total Monthly Tax</span>
                  <span className="font-mono text-xl font-bold" data-testid="text-total-tax">
                    ₦{result.tax.totalMonthlyObligation.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-4 p-4 rounded-md border border-accent bg-accent/10">
                <h4 className="text-sm font-semibold mb-2 text-accent-foreground">Tax Guidance</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {result.guidance.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
