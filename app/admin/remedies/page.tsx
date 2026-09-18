import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { REMEDY_STATUS_LABELS, REMEDY_STATUS_COLORS } from "@/lib/labels";

export default async function AdminRemediesPage() {
  const remedies = await prisma.remedy.findMany({
    orderBy: { updatedAt: "desc" },
    include: { plant: true, disease: true, items: true, specialCases: { include: { specialCase: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-green-900">Bài thuốc</h1>
          <p className="text-sm text-neutral-500">Tổ hợp Cây + Bệnh + Trường hợp đặc biệt → danh sách thuốc.</p>
        </div>
        <Link href="/admin/remedies/new" className="rounded bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800">
          + Tạo bài thuốc
        </Link>
      </div>

      <div className="mt-6 space-y-3">
        {remedies.map((remedy) => (
          <Link
            key={remedy.id}
            href={`/admin/remedies/${remedy.id}`}
            className="block rounded border border-black/10 bg-white p-4 hover:border-green-300"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-medium text-neutral-800">{remedy.name || `${remedy.plant.name} - ${remedy.disease.name}`}</span>
                <span className="ml-2 text-xs text-neutral-400">
                  {remedy.plant.name} · {remedy.disease.name}
                </span>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-xs ${REMEDY_STATUS_COLORS[remedy.status]}`}>
                {REMEDY_STATUS_LABELS[remedy.status]}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-500">
              {remedy.specialCases.length > 0
                ? remedy.specialCases.map((sc) => (
                    <span key={sc.id} className="rounded bg-neutral-100 px-2 py-0.5">
                      {sc.specialCase.name}
                    </span>
                  ))
                : <span className="rounded bg-neutral-100 px-2 py-0.5">Áp dụng chung</span>}
            </div>
            <div className="mt-2 text-xs text-neutral-400">{remedy.items.length} loại thuốc</div>
          </Link>
        ))}
        {remedies.length === 0 ? (
          <p className="rounded border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-400">
            Chưa có bài thuốc nào.
          </p>
        ) : null}
      </div>
    </div>
  );
}
