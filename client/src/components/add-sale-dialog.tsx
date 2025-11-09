import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Product } from "@shared/schema";

export function AddSaleDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    customer: "",
    quantity: "",
    unitPrice: "",
  });

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const createSale = useMutation({
    mutationFn: async (data: typeof formData) => {
      const quantity = parseInt(data.quantity);
      const unitPrice = parseFloat(data.unitPrice);
      const total = quantity * unitPrice;

      const response = await apiRequest("POST", "/api/sales", {
        productName: data.productName,
        customer: data.customer || null,
        quantity,
        unitPrice: unitPrice.toString(),
        total: total.toString(),
        date: new Date().toISOString(),
        productId: data.productId || null,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sales"] });
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Sale added",
        description: `${formData.productName} sale recorded successfully.`,
      });
      setFormData({ productId: "", productName: "", customer: "", quantity: "", unitPrice: "" });
      setOpen(false);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.error === "Insufficient stock" 
        ? error.response.details 
        : "Failed to add sale. Please try again.";
      
      toast({
        title: error?.response?.error || "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate product selection
    if (!formData.productId) {
      toast({
        title: "Validation Error",
        description: "Please select a product",
        variant: "destructive",
      });
      return;
    }
    
    // Validate quantity and price
    if (!formData.quantity || !formData.unitPrice) {
      toast({
        title: "Validation Error",
        description: "Please enter quantity",
        variant: "destructive",
      });
      return;
    }
    
    createSale.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-add-sale">
          <Plus className="h-4 w-4 mr-2" />
          Add Sale
        </Button>
      </DialogTrigger>
      <DialogContent data-testid="dialog-add-sale">
        <DialogHeader>
          <DialogTitle>Add New Sale</DialogTitle>
          <DialogDescription>Record a new sale transaction.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="product">Product *</Label>
              <Select
                value={formData.productId}
                onValueChange={(value) => {
                  const product = products.find(p => p.id === value);
                  if (product) {
                    setFormData({
                      ...formData,
                      productId: value,
                      productName: product.name,
                      unitPrice: product.price.toString(),
                    });
                  }
                }}
                required
              >
                <SelectTrigger data-testid="select-product">
                  <SelectValue placeholder="Select a product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name} - ₦{parseFloat(product.price.toString()).toLocaleString()} (Stock: {product.quantity})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer">Customer</Label>
              <Input
                id="customer"
                value={formData.customer}
                onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                data-testid="input-customer"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  required
                  data-testid="input-quantity"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price *</Label>
                <Input
                  id="unitPrice"
                  type="text"
                  value={formData.unitPrice ? `₦${parseFloat(formData.unitPrice).toLocaleString()}` : ""}
                  readOnly
                  disabled
                  data-testid="input-unit-price"
                  className="bg-muted"
                />
              </div>
            </div>
            {formData.quantity && formData.unitPrice && (
              <div className="bg-muted p-3 rounded-md">
                <p className="text-sm font-medium">Total: ₦{(parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toFixed(2)}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button type="submit" disabled={createSale.isPending} data-testid="button-submit-sale">
              {createSale.isPending ? "Adding..." : "Add Sale"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
