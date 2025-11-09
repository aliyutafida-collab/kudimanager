import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Sparkles, Loader2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AIAdvice {
  success: boolean;
  insights: string[];
  summary: string;
}

export default function AIAdvisor() {
  const [totalSales, setTotalSales] = useState("");
  const [totalExpenses, setTotalExpenses] = useState("");
  const [netProfit, setNetProfit] = useState("");
  const [insights, setInsights] = useState<string[]>([]);
  const { toast } = useToast();

  const advisorMutation = useMutation({
    mutationFn: async (data: { totalSales: number; totalExpenses: number; netProfit: number }) => {
      const response = await apiRequest("POST", "/api/ai/advice", data);
      return response.json();
    },
    onSuccess: (data) => {
      setInsights(data.insights || []);
      toast({
        title: "AI Insights Generated",
        description: "Your personalized business advice is ready.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to Get Insights",
        description: error instanceof Error ? error.message : "Failed to generate AI advice",
        variant: "destructive",
      });
    },
  });

  const handleGetInsights = (e: React.FormEvent) => {
    e.preventDefault();
    const sales = parseFloat(totalSales);
    const expenses = parseFloat(totalExpenses);
    const profit = parseFloat(netProfit);

    if (isNaN(sales) || isNaN(expenses) || isNaN(profit)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers for all fields",
        variant: "destructive",
      });
      return;
    }

    advisorMutation.mutate({ totalSales: sales, totalExpenses: expenses, netProfit: profit });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold mb-2">AI Business Advisor</h1>
        <p className="text-muted-foreground">
          Get personalized insights and recommendations for your business
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Business Metrics
            </CardTitle>
            <CardDescription>Enter your business performance data</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleGetInsights} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ai-sales">Total Sales (₦)</Label>
                <Input
                  id="ai-sales"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={totalSales}
                  onChange={(e) => setTotalSales(e.target.value)}
                  data-testid="input-ai-sales"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai-expenses">Total Expenses (₦)</Label>
                <Input
                  id="ai-expenses"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={totalExpenses}
                  onChange={(e) => setTotalExpenses(e.target.value)}
                  data-testid="input-ai-expenses"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ai-profit">Net Profit (₦)</Label>
                <Input
                  id="ai-profit"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={netProfit}
                  onChange={(e) => setNetProfit(e.target.value)}
                  data-testid="input-ai-profit"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={advisorMutation.isPending}
                data-testid="button-get-insights"
              >
                {advisorMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating Insights...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Get AI Insights
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {insights.length > 0 ? (
            <>
              <Card className="border-accent">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-accent" />
                    AI Insights
                  </CardTitle>
                  <CardDescription>Personalized recommendations for your business</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {insights.slice(0, 3).map((insight, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-md bg-accent/10 border border-accent/20"
                      data-testid={`text-insight-${index + 1}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                          {index + 1}
                        </div>
                        <p className="text-sm flex-1">{insight}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Insights Yet</h3>
                <p className="text-sm text-muted-foreground">
                  Enter your business metrics and click "Get AI Insights" to receive personalized
                  recommendations.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
