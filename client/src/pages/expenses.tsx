import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AddExpenseDialog } from "@/components/add-expense-dialog";
import { ExpensesTable } from "@/components/expenses-table";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Expense } from "@shared/schema";

export default function Expenses() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: expenses = [] } = useQuery<Expense[]>({
    queryKey: ["/api/expenses"],
  });

  const formattedExpenses = expenses.map(expense => ({
    ...expense,
    date: new Date(expense.date).toLocaleDateString(),
    amount: parseFloat(expense.amount.toString()),
  }));

  const filteredExpenses = formattedExpenses.filter(expense =>
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
