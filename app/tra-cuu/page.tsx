import LookupWizard from "@/components/staff/LookupWizard";
import { getRemedyFormData } from "@/lib/remedy-form-data";

export default async function TraCuuPage() {
  const { plants, specialCaseGroups } = await getRemedyFormData();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-xl font-semibold text-green-900">Tra cứu bài thuốc</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Chọn lần lượt cây trồng, bệnh và trường hợp đặc biệt để tìm bài thuốc phù hợp.
      </p>
      <div className="mt-6">
        <LookupWizard plants={plants} specialCaseGroups={specialCaseGroups} />
      </div>
    </div>
  );
}
