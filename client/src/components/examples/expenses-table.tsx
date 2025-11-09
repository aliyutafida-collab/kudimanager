import { ExpensesTable } from '../expenses-table';

const mockExpenses = [
  { id: "1", date: "2024-11-08", description: "Office Rent", category: "Rent", amount: 50000 },
  { id: "2", date: "2024-11-05", description: "Electricity Bill", category: "Utilities", amount: 15000 },
  { id: "3", date: "2024-11-03", description: "Marketing Campaign", category: "Marketing", amount: 25000 },
];

export default function ExpensesTableExample() {
  return (
    <div className="p-4">
      <ExpensesTable expenses={mockExpenses} />
    </div>
  );
}
