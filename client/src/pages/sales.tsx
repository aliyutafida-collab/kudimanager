import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AddSaleDialog } from "@/components/add-sale-dialog";
import { SalesTable } from "@/components/sales-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Sale } from "@shared/schema";

export default function Sales() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: sales = [] } = useQuery<Sale[]>({
    queryKey: ["/api/sales"],
  });

  const formattedSales = sales.map(sale => ({
    ...sale,
    date: new Date(sale.date).toLocaleDateString(),
    unitPrice: parseFloat(sale.unitPrice.toString()),
    total: parseFloat(sale.total.toString()),
  }));

  const filteredSales = formattedSales.filter(sale =>
    sale.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (sale.customer?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Sales</h1>
          <p className="text-muted-foreground">Manage and track all your sales</p>
        </div>
        <AddSaleDialog />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by product or customer..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          data-testid="input-search-sales"
        />
      </div>

      <SalesTable sales={filteredSales} />
    </div>
  );
}
