import { notFound } from "next/navigation";
import MedicineForm from "@/components/admin/MedicineForm";
import { updateMedicineAction } from "@/lib/actions/medicines";
import { prisma } from "@/lib/prisma";

export default async function EditMedicinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const medicine = await prisma.medicine.findUnique({ where: { id } });
  if (!medicine) notFound();

  const updateWithId = updateMedicineAction.bind(null, medicine.id);

  return (
    <div>
      <h1 className="text-xl font-semibold text-green-900">Sửa thuốc</h1>
      <div className="mt-6">
        <MedicineForm
          action={updateWithId}
          initial={{
            name: medicine.name,
            activeIngredient: medicine.activeIngredient ?? "",
            groupType: medicine.groupType,
            concentration: medicine.concentration ?? "",
            unit: medicine.unit ?? "",
            phiDays: medicine.phiDays?.toString() ?? "",
            toxicityClass: medicine.toxicityClass ?? "",
            manufacturer: medicine.manufacturer ?? "",
            referencePrice: medicine.referencePrice ?? "",
            isDiscontinued: medicine.isDiscontinued,
          }}
        />
      </div>
    </div>
  );
}
