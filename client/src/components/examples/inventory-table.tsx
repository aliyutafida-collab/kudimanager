import { InventoryTable } from '../inventory-table';

const mockProducts = [
  { id: "1", name: "Widget A", sku: "WGT-001", category: "Electronics", price: 1200, quantity: 45, lowStockThreshold: 10 },
  { id: "2", name: "Widget B", sku: "WGT-002", category: "Electronics", price: 2500, quantity: 8, lowStockThreshold: 10 },
  { id: "3", name: "Widget C", sku: "WGT-003", category: "Accessories", price: 500, quantity: 0, lowStockThreshold: 5 },
  { id: "4", name: "Widget D", sku: "WGT-004", category: "Tools", price: 3000, quantity: 25, lowStockThreshold: 10 },
];

export default function InventoryTableExample() {
  return (
    <div className="p-4">
      <InventoryTable products={mockProducts} />
    </div>
  );
}
