import { useState } from "react";
import { AddProductDialog } from "@/components/add-product-dialog";
import { InventoryTable } from "@/components/inventory-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockProducts = [
    { id: "1", name: "Widget A", sku: "WGT-001", category: "Electronics", price: 1200, quantity: 45, lowStockThreshold: 10 },
    { id: "2", name: "Widget B", sku: "WGT-002", category: "Electronics", price: 2500, quantity: 8, lowStockThreshold: 10 },
    { id: "3", name: "Widget C", sku: "WGT-003", category: "Accessories", price: 500, quantity: 0, lowStockThreshold: 5 },
    { id: "4", name: "Widget D", sku: "WGT-004", category: "Tools", price: 3000, quantity: 25, lowStockThreshold: 10 },
    { id: "5", name: "Widget E", sku: "WGT-005", category: "Electronics", price: 1800, quantity: 15, lowStockThreshold: 10 },
  ];

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Inventory</h1>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <AddProductDialog />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, SKU, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          data-testid="input-search-inventory"
        />
      </div>

      <InventoryTable products={filteredProducts} />
    </div>
  );
}
