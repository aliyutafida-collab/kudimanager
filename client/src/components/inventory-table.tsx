import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CurrencyDisplay } from "@/components/currency-display";

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  quantity: number;
  lowStockThreshold: number;
}

interface InventoryTableProps {
  products: Product[];
}

export function InventoryTable({ products }: InventoryTableProps) {
  const handleEdit = (id: string) => {
    console.log("Edit product:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete product:", id);
  };

  const getStockStatus = (quantity: number, threshold: number) => {
    if (quantity === 0) return { label: "Out of Stock", variant: "destructive" as const };
    if (quantity <= threshold) return { label: "Low Stock", variant: "outline" as const };
    return null;
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>SKU</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No products in inventory yet. Add your first product to get started!
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => {
              const stockStatus = getStockStatus(product.quantity, product.lowStockThreshold);
              return (
                <TableRow key={product.id} data-testid={`row-product-${product.id}`}>
                  <TableCell className="font-medium" data-testid={`text-name-${product.id}`}>{product.name}</TableCell>
                  <TableCell data-testid={`text-sku-${product.id}`}>{product.sku || "-"}</TableCell>
                  <TableCell data-testid={`text-category-${product.id}`}>{product.category || "-"}</TableCell>
                  <TableCell className="text-right" data-testid={`text-price-${product.id}`}>
                    <CurrencyDisplay amount={product.price} showDecimals />
                  </TableCell>
                  <TableCell className="text-right font-mono" data-testid={`text-quantity-${product.id}`}>{product.quantity}</TableCell>
                  <TableCell>
                    {stockStatus && (
                      <Badge variant={stockStatus.variant} className="gap-1" data-testid={`badge-status-${product.id}`}>
                        {stockStatus.label === "Out of Stock" && <AlertTriangle className="h-3 w-3" />}
                        {stockStatus.label}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(product.id)} data-testid={`button-edit-${product.id}`}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)} data-testid={`button-delete-${product.id}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
