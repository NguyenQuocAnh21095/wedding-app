import PlantForm from "@/components/admin/PlantForm";
import { createPlantAction } from "@/lib/actions/plants";

export default function NewPlantPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-green-900">Thêm cây trồng</h1>
      <div className="mt-6">
        <PlantForm action={createPlantAction} />
      </div>
    </div>
  );
}
