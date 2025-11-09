import { AddProductDialog } from '../add-product-dialog';
import { Toaster } from "@/components/ui/toaster";

export default function AddProductDialogExample() {
  return (
    <>
      <div className="p-4">
        <AddProductDialog />
      </div>
      <Toaster />
    </>
  );
}
