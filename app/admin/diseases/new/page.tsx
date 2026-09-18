import DiseaseForm from "@/components/admin/DiseaseForm";
import { createDiseaseAction } from "@/lib/actions/diseases";
import { prisma } from "@/lib/prisma";

export default async function NewDiseasePage() {
  const plants = await prisma.plant.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });

  return (
    <div>
      <h1 className="text-xl font-semibold text-green-900">Thêm bệnh / sâu hại</h1>
      <div className="mt-6">
        <DiseaseForm action={createDiseaseAction} allPlants={plants} />
      </div>
    </div>
  );
}
