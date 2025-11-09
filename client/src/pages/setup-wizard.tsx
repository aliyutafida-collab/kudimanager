import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { insertProductSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { CheckCircle2, Package, Loader2 } from "lucide-react";

type ProductFormValues = z.infer<typeof insertProductSchema>;

export default function SetupWizard() {
  const [step, setStep] = useState(1);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [addedProducts, setAddedProducts] = useState<string[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: {
      name: "",
      sku: "",
      category: "",
      price: "0",
      quantity: 0,
      lowStockThreshold: 10,
    },
  });

  const productMutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const response = await apiRequest("POST", "/api/products", values);
      return response.json();
    },
    onSuccess: (data) => {
      setAddedProducts(prev => [...prev, data.name]);
      toast({
        title: "Product Added",
        description: `${data.name} has been added to your inventory.`,
      });
      form.reset({
        name: "",
        sku: "",
        category: "",
        price: "0",
        quantity: 0,
        lowStockThreshold: 10,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add product",
        variant: "destructive",
      });
    },
  });

  const onSubmitProduct = (values: ProductFormValues) => {
    productMutation.mutate(values);
  };

  const handleSkipToFashboard = () => {
    setLocation("/");
  };

  const handleFinish = () => {
    toast({
      title: "Setup Complete!",
      description: "Your business is ready to track sales and manage inventory.",
    });
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to KudiManager! 🎉</CardTitle>
          <CardDescription>
            {step === 1 ? "Let's set up your inventory to get started" : "Add your first products"}
          </CardDescription>
        </CardHeader>

        {step === 1 ? (
          <>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20">
                <Package className="h-8 w-8 text-primary" />
                <div>
                  <h3 className="font-semibold">Quick Setup</h3>
                  <p className="text-sm text-muted-foreground">
                    Add a few products to start tracking your inventory, sales, and expenses.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">What you can do with KudiManager:</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span>Track sales and expenses in real-time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span>Manage inventory with low-stock alerts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span>Calculate Nigerian business taxes automatically</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span>Get AI-powered business insights and recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5" />
                    <span>Find trusted vendors and suppliers across Nigeria</span>
                  </li>
                </ul>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleSkipToFashboard}
                data-testid="button-skip-setup"
              >
                Skip for Now
              </Button>
              <Button
                onClick={() => setStep(2)}
                data-testid="button-start-setup"
              >
                Let's Get Started
              </Button>
            </CardFooter>
          </>
        ) : (
          <>
            <CardContent className="space-y-4">
              {addedProducts.length > 0 && (
                <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                  <p className="text-sm font-medium mb-2">Products Added ({addedProducts.length}):</p>
                  <div className="flex flex-wrap gap-2">
                    {addedProducts.map((name, index) => (
                      <span key={index} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-sm">
                        <CheckCircle2 className="h-3 w-3" />
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmitProduct)} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Samsung Galaxy Phone" {...field} data-testid="input-product-name" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU / Product Code</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., SGP-001" 
                              {...field} 
                              value={field.value || ""}
                              data-testid="input-product-sku" 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="e.g., Electronics" 
                            {...field} 
                            value={field.value || ""}
                            data-testid="input-product-category" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price (₦) *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                              data-testid="input-product-price"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                              data-testid="input-product-quantity"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lowStockThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Low Stock Alert</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="10"
                              value={field.value || 10}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 10)}
                              data-testid="input-product-threshold"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={productMutation.isPending}
                    data-testid="button-add-product"
                  >
                    {productMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Product"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handleFinish}
                data-testid="button-finish-later"
              >
                {addedProducts.length > 0 ? "Finish Setup" : "Skip for Now"}
              </Button>
              {addedProducts.length > 0 && (
                <Button
                  onClick={handleFinish}
                  data-testid="button-go-to-dashboard"
                >
                  Go to Dashboard
                </Button>
              )}
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
