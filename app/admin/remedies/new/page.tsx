import RemedyForm from "@/components/admin/RemedyForm";
import { createRemedyAction } from "@/lib/actions/remedies";
import { getRemedyFormData } from "@/lib/remedy-form-data";

export default async function NewRemedyPage() {
  const { plants, specialCaseGroups, medicines } = await getRemedyFormData();

  return (
    <div>
      <h1 className="text-xl font-semibold text-green-900">Tạo bài thuốc</h1>
      <div className="mt-6">
        <RemedyForm action={createRemedyAction} plants={plants} specialCaseGroups={specialCaseGroups} medicines={medicines} />
      </div>
    </div>
  );
}
