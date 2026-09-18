"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import type { RemedyFormState } from "@/lib/actions/remedies";

type Plant = { id: string; name: string; diseases: { id: string; name: string }[] };
type SpecialCaseGroup = { id: string; name: string; exclusive: boolean; cases: { id: string; name: string }[] };
type Medicine = { id: string; name: string; unit: string | null };

type Item = { medicineId: string; dosageAmount: string; dosageUnit: string; usageNote: string };

const emptyItem: Item = { medicineId: "", dosageAmount: "", dosageUnit: "", usageNote: "" };

export default function RemedyForm({
  action,
  plants,
  specialCaseGroups,
  medicines,
  initial,
}: {
  action: (prevState: RemedyFormState, formData: FormData) => Promise<RemedyFormState>;
  plants: Plant[];
  specialCaseGroups: SpecialCaseGroup[];
  medicines: Medicine[];
  initial?: {
    name: string;
    plantId: string;
    diseaseId: string;
    usageInstructions: string;
    notes: string;
    specialCaseIds: string[];
    items: Item[];
  };
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [plantId, setPlantId] = useState(initial?.plantId ?? "");
  const [items, setItems] = useState<Item[]>(initial?.items?.length ? initial.items : [emptyItem]);

  const diseasesForPlant = useMemo(
    () => plants.find((p) => p.id === plantId)?.diseases ?? [],
    [plants, plantId]
  );

  function updateItem(index: number, patch: Partial<Item>) {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem]);
  }

  function removeItem(index: number) {
    setItems((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));
  }

  return (
    <form action={formAction} className="max-w-3xl space-y-6">
      <input type="hidden" name="itemsJson" value={JSON.stringify(items)} />

      <div>
        <label className="block text-sm font-medium text-neutral-700">Tên bài thuốc (tùy chọn)</label>
        <input
          name="name"
          defaultValue={initial?.name}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          placeholder="Đạo ôn lúa - mới chớm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700">Cây trồng *</label>
          <select
            name="plantId"
            required
            value={plantId}
            onChange={(e) => setPlantId(e.target.value)}
            className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          >
            <option value="">— Chọn cây trồng —</option>
            {plants.map((plant) => (
              <option key={plant.id} value={plant.id}>
                {plant.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">Bệnh *</label>
          <select
            name="diseaseId"
            required
            defaultValue={initial?.diseaseId}
            disabled={!plantId}
            className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-400"
          >
            <option value="">{!plantId ? "— Chọn cây trồng trước —" : "— Chọn bệnh —"}</option>
            {diseasesForPlant.map((disease) => (
              <option key={disease.id} value={disease.id}>
                {disease.name}
              </option>
            ))}
          </select>
          {plantId && diseasesForPlant.length === 0 ? (
            <p className="mt-1 text-xs text-amber-600">Cây này chưa gắn bệnh nào — hãy thêm liên kết ở mục Bệnh / Sâu hại.</p>
          ) : null}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">Trường hợp đặc biệt áp dụng</label>
        <div className="mt-2 space-y-3 rounded border border-neutral-200 p-3">
          {specialCaseGroups.map((group) => (
            <div key={group.id}>
              <p className="text-xs font-medium text-neutral-500">
                {group.name} {group.exclusive ? "(chọn 1)" : ""}
              </p>
              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
                {group.cases.map((c) => (
                  <label key={c.id} className="flex items-center gap-1.5 text-sm text-neutral-600">
                    <input
                      type={group.exclusive ? "radio" : "checkbox"}
                      name="specialCaseIds"
                      value={c.id}
                      defaultChecked={initial?.specialCaseIds.includes(c.id)}
                    />
                    {c.name}
                  </label>
                ))}
              </div>
            </div>
          ))}
          {specialCaseGroups.length === 0 ? (
            <p className="text-xs text-neutral-400">Chưa có trường hợp đặc biệt nào. Để trống nếu bài thuốc áp dụng chung.</p>
          ) : null}
          <p className="text-xs text-neutral-400">Để trống nếu bài thuốc áp dụng cho mọi trường hợp.</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-neutral-700">Danh sách thuốc *</label>
          <button type="button" onClick={addItem} className="text-xs font-medium text-green-700 hover:underline">
            + Thêm thuốc
          </button>
        </div>
        <div className="mt-2 space-y-3">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 items-start gap-2 rounded border border-neutral-200 p-3">
              <div className="col-span-4">
                <select
                  value={item.medicineId}
                  onChange={(e) => {
                    const medicine = medicines.find((m) => m.id === e.target.value);
                    updateItem(index, {
                      medicineId: e.target.value,
                      dosageUnit: item.dosageUnit || medicine?.unit || "",
                    });
                  }}
                  className="w-full rounded border border-neutral-300 px-2 py-1.5 text-sm focus:border-green-600 focus:outline-none"
                >
                  <option value="">— Chọn thuốc —</option>
                  {medicines.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-span-2">
                <input
                  value={item.dosageAmount}
                  onChange={(e) => updateItem(index, { dosageAmount: e.target.value })}
                  placeholder="Liều lượng"
                  className="w-full rounded border border-neutral-300 px-2 py-1.5 text-sm focus:border-green-600 focus:outline-none"
                />
              </div>
              <div className="col-span-2">
                <input
                  value={item.dosageUnit}
                  onChange={(e) => updateItem(index, { dosageUnit: e.target.value })}
                  placeholder="Đơn vị"
                  className="w-full rounded border border-neutral-300 px-2 py-1.5 text-sm focus:border-green-600 focus:outline-none"
                />
              </div>
              <div className="col-span-3">
                <input
                  value={item.usageNote}
                  onChange={(e) => updateItem(index, { usageNote: e.target.value })}
                  placeholder="Ghi chú (tùy chọn)"
                  className="w-full rounded border border-neutral-300 px-2 py-1.5 text-sm focus:border-green-600 focus:outline-none"
                />
              </div>
              <div className="col-span-1 pt-1.5 text-right">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="text-xs text-red-500 hover:underline"
                  disabled={items.length <= 1}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">Hướng dẫn sử dụng</label>
        <textarea
          name="usageInstructions"
          defaultValue={initial?.usageInstructions}
          rows={3}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          placeholder="Thứ tự pha trộn, cách phun, tần suất..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">Ghi chú</label>
        <textarea
          name="notes"
          defaultValue={initial?.notes}
          rows={2}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60"
        >
          {pending ? "Đang lưu..." : "Lưu bài thuốc"}
        </button>
        <Link href="/admin/remedies" className="text-sm text-neutral-500 hover:text-neutral-700">
          Hủy
        </Link>
      </div>
    </form>
  );
}
