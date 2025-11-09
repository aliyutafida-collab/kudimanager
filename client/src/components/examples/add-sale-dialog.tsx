import { AddSaleDialog } from '../add-sale-dialog';
import { Toaster } from "@/components/ui/toaster";

export default function AddSaleDialogExample() {
  return (
    <>
      <div className="p-4">
        <AddSaleDialog />
      </div>
      <Toaster />
    </>
  );
}
