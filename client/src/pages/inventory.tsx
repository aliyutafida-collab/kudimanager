import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AddProductDialog } from "@/components/add-product-dialog";
import { InventoryTable } from "@/components/inventory-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Product } from "@/types/schemas";

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: products = [] } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const formattedProducts = products.map(product => ({
    ...product,
    price: parseFloat(product.price.toString()),
    lowStockThreshold: product.lowStockThreshold ?? 10,
  }));

  const filteredProducts = formattedProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()))
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
