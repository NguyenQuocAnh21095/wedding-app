import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toggleDiseaseActiveAction } from "@/lib/actions/diseases";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import { AGENT_TYPE_LABELS } from "@/lib/labels";

export default async function AdminDiseasesPage() {
  const diseases = await prisma.disease.findMany({
    orderBy: { name: "asc" },
    include: { plants: { include: { plant: true } }, _count: { select: { remedies: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-green-900">Bệnh / Sâu hại</h1>
          <p className="text-sm text-neutral-500">Danh mục bệnh, gắn với các loại cây bị ảnh hưởng.</p>
        </div>
        <Link href="/admin/diseases/new" className="rounded bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800">
          + Thêm bệnh
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded border border-black/10 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-black/10 bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-2 font-medium">Tên bệnh</th>
              <th className="px-4 py-2 font-medium">Nhóm tác nhân</th>
              <th className="px-4 py-2 font-medium">Cây liên quan</th>
              <th className="px-4 py-2 font-medium">Bài thuốc</th>
              <th className="px-4 py-2 font-medium">Trạng thái</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {diseases.map((disease) => (
              <tr key={disease.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-2 font-medium text-neutral-800">{disease.name}</td>
                <td className="px-4 py-2 text-neutral-600">{AGENT_TYPE_LABELS[disease.agentType]}</td>
                <td className="px-4 py-2 text-neutral-600">
                  {disease.plants.map((p) => p.plant.name).join(", ") || "—"}
                </td>
                <td className="px-4 py-2 text-neutral-600">{disease._count.remedies}</td>
                <td className="px-4 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${disease.isActive ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-500"}`}>
                    {disease.isActive ? "Đang dùng" : "Đã ẩn"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/diseases/${disease.id}`} className="text-green-700 hover:underline">
                      Sửa
                    </Link>
                    <form action={toggleDiseaseActiveAction}>
                      <input type="hidden" name="id" value={disease.id} />
                      <ConfirmSubmitButton
                        confirmMessage={disease.isActive ? "Ẩn bệnh này?" : "Kích hoạt lại bệnh này?"}
                        className="text-neutral-500 hover:underline"
                      >
                        {disease.isActive ? "Ẩn" : "Kích hoạt"}
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {diseases.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-400">
                  Chưa có bệnh nào.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
