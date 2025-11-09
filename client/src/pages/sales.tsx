import { useState } from "react";
import { AddSaleDialog } from "@/components/add-sale-dialog";
import { SalesTable } from "@/components/sales-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Sales() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockSales = [
    { id: "1", date: "2024-11-08", customer: "John Doe", productName: "Widget A", quantity: 5, unitPrice: 1200, total: 6000 },
    { id: "2", date: "2024-11-07", customer: "Jane Smith", productName: "Widget B", quantity: 3, unitPrice: 2500, total: 7500 },
    { id: "3", date: "2024-11-07", customer: "", productName: "Widget C", quantity: 10, unitPrice: 500, total: 5000 },
    { id: "4", date: "2024-11-06", customer: "Mike Johnson", productName: "Widget A", quantity: 2, unitPrice: 1200, total: 2400 },
    { id: "5", date: "2024-11-05", customer: "Sarah Williams", productName: "Widget D", quantity: 8, unitPrice: 750, total: 6000 },
  ];

  const filteredSales = mockSales.filter(sale =>
    sale.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.customer.toLowerCase().includes(searchQuery.toLowerCase())
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
