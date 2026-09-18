import { notFound } from "next/navigation";
import DiseaseForm from "@/components/admin/DiseaseForm";
import { updateDiseaseAction } from "@/lib/actions/diseases";
import { prisma } from "@/lib/prisma";

export default async function EditDiseasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [disease, plants] = await Promise.all([
    prisma.disease.findUnique({ where: { id }, include: { plants: true } }),
    prisma.plant.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);
  if (!disease) notFound();

  const updateWithId = updateDiseaseAction.bind(null, disease.id);

  return (
    <div>
      <h1 className="text-xl font-semibold text-green-900">Sửa bệnh / sâu hại</h1>
      <div className="mt-6">
        <DiseaseForm
          action={updateWithId}
          allPlants={plants}
          initial={{
            name: disease.name,
            agentType: disease.agentType,
            description: disease.description ?? "",
            plantIds: disease.plants.map((p) => p.plantId),
          }}
        />
      </div>
    </div>
  );
}
