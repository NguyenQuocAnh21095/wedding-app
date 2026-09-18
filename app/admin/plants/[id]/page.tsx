import { notFound } from "next/navigation";
import PlantForm from "@/components/admin/PlantForm";
import { updatePlantAction } from "@/lib/actions/plants";
import { prisma } from "@/lib/prisma";

export default async function EditPlantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const plant = await prisma.plant.findUnique({ where: { id } });
  if (!plant) notFound();

  const updateWithId = updatePlantAction.bind(null, plant.id);

  return (
    <div>
      <h1 className="text-xl font-semibold text-green-900">Sửa cây trồng</h1>
      <div className="mt-6">
        <PlantForm
          action={updateWithId}
          initial={{
            name: plant.name,
            scientificName: plant.scientificName ?? "",
            groupName: plant.groupName ?? "",
            growthStages: plant.growthStages.join(", "),
            imageUrl: plant.imageUrl ?? "",
          }}
        />
      </div>
    </div>
  );
}
