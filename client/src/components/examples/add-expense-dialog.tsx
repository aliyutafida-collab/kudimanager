import { AddExpenseDialog } from '../add-expense-dialog';
import { Toaster } from "@/components/ui/toaster";

export default function AddExpenseDialogExample() {
  return (
    <>
      <div className="p-4">
        <AddExpenseDialog />
      </div>
      <Toaster />
    </>
  );
}
