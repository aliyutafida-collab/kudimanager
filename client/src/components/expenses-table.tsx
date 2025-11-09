import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Expense {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
}

interface ExpensesTableProps {
  expenses: Expense[];
}

export function ExpensesTable({ expenses }: ExpensesTableProps) {
  const handleEdit = (id: string) => {
    console.log("Edit expense:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete expense:", id);
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No expenses recorded yet. Add your first expense to get started!
              </TableCell>
            </TableRow>
          ) : (
            expenses.map((expense) => (
              <TableRow key={expense.id} data-testid={`row-expense-${expense.id}`}>
                <TableCell data-testid={`text-date-${expense.id}`}>{expense.date}</TableCell>
                <TableCell data-testid={`text-description-${expense.id}`}>{expense.description}</TableCell>
                <TableCell>
                  <Badge variant="outline" data-testid={`badge-category-${expense.id}`}>{expense.category}</Badge>
                </TableCell>
                <TableCell className="text-right font-mono font-semibold" data-testid={`text-amount-${expense.id}`}>₦{expense.amount.toFixed(2)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(expense.id)} data-testid={`button-edit-${expense.id}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(expense.id)} data-testid={`button-delete-${expense.id}`}>
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
