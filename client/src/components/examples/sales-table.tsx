import { SalesTable } from '../sales-table';

const mockSales = [
  { id: "1", date: "2024-11-08", customer: "John Doe", productName: "Widget A", quantity: 5, unitPrice: 1200, total: 6000 },
  { id: "2", date: "2024-11-07", customer: "Jane Smith", productName: "Widget B", quantity: 3, unitPrice: 2500, total: 7500 },
  { id: "3", date: "2024-11-07", customer: "", productName: "Widget C", quantity: 10, unitPrice: 500, total: 5000 },
];

export default function SalesTableExample() {
  return (
    <div className="p-4">
      <SalesTable sales={mockSales} />
    </div>
  );
}
