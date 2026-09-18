import MedicineForm from "@/components/admin/MedicineForm";
import { createMedicineAction } from "@/lib/actions/medicines";

export default function NewMedicinePage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-green-900">Thêm thuốc</h1>
      <div className="mt-6">
        <MedicineForm action={createMedicineAction} />
      </div>
    </div>
  );
}
