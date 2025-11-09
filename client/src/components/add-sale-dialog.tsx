import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AddSaleDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    productName: "",
    customer: "",
    quantity: "",
    unitPrice: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Sale submitted:", formData);
    toast({
      title: "Sale added",
      description: `${formData.productName} sale recorded successfully.`,
    });
    setFormData({ productName: "", customer: "", quantity: "", unitPrice: "" });
    setOpen(false);
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
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                required
                data-testid="input-product-name"
              />
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
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  required
                  data-testid="input-unit-price"
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
            <Button type="submit" data-testid="button-submit-sale">Add Sale</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
