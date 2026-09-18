import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guard";
import { AGENT_TYPE_LABELS, MEDICINE_GROUP_LABELS, TOXICITY_LABELS, REMEDY_STATUS_LABELS, REMEDY_STATUS_COLORS } from "@/lib/labels";
import { summarizeSafety } from "@/lib/remedy-summary";
import DosageCalculator from "@/components/DosageCalculator";
import PrintButton from "@/components/PrintButton";

export default async function RemedyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireUser();
  const { id } = await params;

  const remedy = await prisma.remedy.findUnique({
    where: { id },
    include: {
      plant: true,
      disease: true,
      specialCases: { include: { specialCase: { include: { group: true } } } },
      items: { include: { medicine: true }, orderBy: { mixOrder: "asc" } },
    },
  });

  if (!remedy) notFound();
  if (remedy.status !== "PUBLISHED" && session.role !== "ADMIN") notFound();

  const { maxPhiDays, mostSevereToxicity } = summarizeSafety(remedy.items);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-2 print:hidden">
        <Link href="/tra-cuu" className="text-sm text-neutral-500 hover:text-green-700">
          ← Quay lại tra cứu
        </Link>
        <PrintButton />
      </div>

      <div className="mt-4 rounded-xl border border-black/10 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h1 className="text-xl font-semibold text-green-900">
              {remedy.name || `${remedy.plant.name} - ${remedy.disease.name}`}
            </h1>
            <p className="mt-1 text-sm text-neutral-500">
              {remedy.plant.name} · {remedy.disease.name} ({AGENT_TYPE_LABELS[remedy.disease.agentType]})
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs ${REMEDY_STATUS_COLORS[remedy.status]}`}>
            {REMEDY_STATUS_LABELS[remedy.status]}
          </span>
        </div>

        {remedy.specialCases.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {remedy.specialCases.map((sc) => (
              <span key={sc.id} className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-600">
                {sc.specialCase.group.name}: {sc.specialCase.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-xs text-neutral-400">Áp dụng chung, không phân biệt trường hợp đặc biệt.</p>
        )}

        {maxPhiDays != null || mostSevereToxicity ? (
          <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            <p className="font-medium">Cảnh báo an toàn</p>
            <ul className="mt-1 list-inside list-disc space-y-0.5">
              {maxPhiDays != null ? <li>Thời gian cách ly trước thu hoạch: tối thiểu {maxPhiDays} ngày.</li> : null}
              {mostSevereToxicity ? <li>Có thuốc thuộc {TOXICITY_LABELS[mostSevereToxicity]}. Trang bị bảo hộ khi pha và phun.</li> : null}
            </ul>
          </div>
        ) : null}

        <div className="mt-6">
          <h2 className="text-sm font-medium text-neutral-700">Danh sách thuốc</h2>
          <div className="mt-2 overflow-x-auto rounded border border-black/10">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="border-b border-black/10 bg-neutral-50 text-neutral-500">
                <tr>
                  <th className="px-3 py-2 font-medium">Thuốc</th>
                  <th className="px-3 py-2 font-medium">Liều lượng</th>
                  <th className="px-3 py-2 font-medium">Nhóm</th>
                  <th className="px-3 py-2 font-medium">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {remedy.items.map((item) => (
                  <tr key={item.id} className="border-b border-black/5 last:border-0">
                    <td className="px-3 py-2">
                      <div className="font-medium text-neutral-800">{item.medicine.name}</div>
                      {item.medicine.activeIngredient ? (
                        <div className="text-xs text-neutral-400">{item.medicine.activeIngredient}</div>
                      ) : null}
                    </td>
                    <td className="px-3 py-2 text-neutral-600">
                      {item.dosageAmount} {item.dosageUnit}
                    </td>
                    <td className="px-3 py-2 text-neutral-600">{MEDICINE_GROUP_LABELS[item.medicine.groupType]}</td>
                    <td className="px-3 py-2 text-neutral-500">{item.usageNote || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {remedy.usageInstructions ? (
          <div className="mt-6">
            <h2 className="text-sm font-medium text-neutral-700">Hướng dẫn sử dụng</h2>
            <p className="mt-1 whitespace-pre-line text-sm text-neutral-600">{remedy.usageInstructions}</p>
          </div>
        ) : null}

        {remedy.notes ? (
          <div className="mt-4">
            <h2 className="text-sm font-medium text-neutral-700">Ghi chú</h2>
            <p className="mt-1 whitespace-pre-line text-sm text-neutral-600">{remedy.notes}</p>
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        <DosageCalculator
          items={remedy.items.map((item) => ({
            id: item.id,
            medicineName: item.medicine.name,
            dosageAmount: item.dosageAmount,
            dosageUnit: item.dosageUnit,
          }))}
        />
      </div>
    </div>
  );
}
