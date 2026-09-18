import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toggleMedicineActiveAction } from "@/lib/actions/medicines";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import { MEDICINE_GROUP_LABELS } from "@/lib/labels";

export default async function AdminMedicinesPage() {
  const medicines = await prisma.medicine.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-green-900">Thuốc</h1>
          <p className="text-sm text-neutral-500">Danh mục thuốc dùng để lắp ráp thành các bài thuốc.</p>
        </div>
        <Link href="/admin/medicines/new" className="rounded bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800">
          + Thêm thuốc
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded border border-black/10 bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-black/10 bg-neutral-50 text-neutral-500">
            <tr>
              <th className="px-4 py-2 font-medium">Tên thuốc</th>
              <th className="px-4 py-2 font-medium">Nhóm</th>
              <th className="px-4 py-2 font-medium">Cách ly (ngày)</th>
              <th className="px-4 py-2 font-medium">Trạng thái</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((medicine) => (
              <tr key={medicine.id} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-2">
                  <div className="font-medium text-neutral-800">{medicine.name}</div>
                  {medicine.activeIngredient ? (
                    <div className="text-xs text-neutral-400">{medicine.activeIngredient}</div>
                  ) : null}
                </td>
                <td className="px-4 py-2 text-neutral-600">{MEDICINE_GROUP_LABELS[medicine.groupType]}</td>
                <td className="px-4 py-2 text-neutral-600">{medicine.phiDays ?? "—"}</td>
                <td className="px-4 py-2">
                  <div className="flex flex-wrap gap-1">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${medicine.isActive ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-500"}`}>
                      {medicine.isActive ? "Đang dùng" : "Đã ẩn"}
                    </span>
                    {medicine.isDiscontinued ? (
                      <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">Ngừng KD</span>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/medicines/${medicine.id}`} className="text-green-700 hover:underline">
                      Sửa
                    </Link>
                    <form action={toggleMedicineActiveAction}>
                      <input type="hidden" name="id" value={medicine.id} />
                      <ConfirmSubmitButton
                        confirmMessage={medicine.isActive ? "Ẩn thuốc này?" : "Kích hoạt lại thuốc này?"}
                        className="text-neutral-500 hover:underline"
                      >
                        {medicine.isActive ? "Ẩn" : "Kích hoạt"}
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {medicines.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-neutral-400">
                  Chưa có thuốc nào.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
