import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Sale {
  id: string;
  date: string;
  customer: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface SalesTableProps {
  sales: Sale[];
}

export function SalesTable({ sales }: SalesTableProps) {
  const handleEdit = (id: string) => {
    console.log("Edit sale:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete sale:", id);
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Unit Price</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No sales recorded yet. Add your first sale to get started!
              </TableCell>
            </TableRow>
          ) : (
            sales.map((sale) => (
              <TableRow key={sale.id} data-testid={`row-sale-${sale.id}`}>
                <TableCell data-testid={`text-date-${sale.id}`}>{sale.date}</TableCell>
                <TableCell data-testid={`text-customer-${sale.id}`}>{sale.customer || "-"}</TableCell>
                <TableCell data-testid={`text-product-${sale.id}`}>{sale.productName}</TableCell>
                <TableCell className="text-right font-mono" data-testid={`text-quantity-${sale.id}`}>{sale.quantity}</TableCell>
                <TableCell className="text-right font-mono" data-testid={`text-unit-price-${sale.id}`}>₦{sale.unitPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right font-mono font-semibold" data-testid={`text-total-${sale.id}`}>₦{sale.total.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(sale.id)} data-testid={`button-edit-${sale.id}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(sale.id)} data-testid={`button-delete-${sale.id}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
