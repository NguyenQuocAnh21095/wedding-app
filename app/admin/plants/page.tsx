import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { togglePlantActiveAction } from "@/lib/actions/plants";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";

export default async function AdminPlantsPage() {
  const plants = await prisma.plant.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { remedies: true, diseases: true } } },
  });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-green-900">Cây trồng</h1>
          <p className="text-sm text-neutral-500">Danh mục các loại cây trồng làm gốc cho tra cứu bài thuốc.</p>
        </div>
        <Link href="/admin/plants/new" className="rounded bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800">
          + Thêm cây trồng
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded border border-black/10 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-black/10 bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-2 font-medium">Tên cây</th>
              <th className="px-4 py-2 font-medium">Nhóm</th>
              <th className="px-4 py-2 font-medium">Bệnh liên kết</th>
              <th className="px-4 py-2 font-medium">Bài thuốc</th>
              <th className="px-4 py-2 font-medium">Trạng thái</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {plants.map((plant) => (
              <tr key={plant.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-2">
                  <div className="font-medium text-neutral-800">{plant.name}</div>
                  {plant.scientificName ? <div className="text-xs italic text-neutral-400">{plant.scientificName}</div> : null}
                </td>
                <td className="px-4 py-2 text-neutral-600">{plant.groupName ?? "—"}</td>
                <td className="px-4 py-2 text-neutral-600">{plant._count.diseases}</td>
                <td className="px-4 py-2 text-neutral-600">{plant._count.remedies}</td>
                <td className="px-4 py-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${plant.isActive ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-500"}`}>
                    {plant.isActive ? "Đang dùng" : "Đã ẩn"}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/plants/${plant.id}`} className="text-green-700 hover:underline">
                      Sửa
                    </Link>
                    <form action={togglePlantActiveAction}>
                      <input type="hidden" name="id" value={plant.id} />
                      <ConfirmSubmitButton
                        confirmMessage={plant.isActive ? "Ẩn loại cây này?" : "Kích hoạt lại loại cây này?"}
                        className="text-neutral-500 hover:underline"
                      >
                        {plant.isActive ? "Ẩn" : "Kích hoạt"}
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {plants.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-400">
                  Chưa có loại cây nào.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
