import { useState } from "react";
import { AddExpenseDialog } from "@/components/add-expense-dialog";
import { ExpensesTable } from "@/components/expenses-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Expenses() {
  const [searchQuery, setSearchQuery] = useState("");

  const mockExpenses = [
    { id: "1", date: "2024-11-08", description: "Office Rent", category: "Rent", amount: 50000 },
    { id: "2", date: "2024-11-05", description: "Electricity Bill", category: "Utilities", amount: 15000 },
    { id: "3", date: "2024-11-03", description: "Marketing Campaign", category: "Marketing", amount: 25000 },
    { id: "4", date: "2024-11-02", description: "Office Supplies", category: "Supplies", amount: 8500 },
    { id: "5", date: "2024-11-01", description: "Staff Salaries", category: "Salaries", amount: 120000 },
  ];

  const filteredExpenses = mockExpenses.filter(expense =>
    expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Expenses</h1>
          <p className="text-muted-foreground">Track and manage your business expenses</p>
        </div>
        <AddExpenseDialog />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by description or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
          data-testid="input-search-expenses"
        />
      </div>

      <ExpensesTable expenses={filteredExpenses} />
    </div>
  );
}
