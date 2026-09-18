"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { MedicineFormState } from "@/lib/actions/medicines";
import { MEDICINE_GROUP_LABELS, TOXICITY_LABELS } from "@/lib/labels";

export default function MedicineForm({
  action,
  initial,
}: {
  action: (prevState: MedicineFormState, formData: FormData) => Promise<MedicineFormState>;
  initial?: {
    name: string;
    activeIngredient: string;
    groupType: string;
    concentration: string;
    unit: string;
    phiDays: string;
    toxicityClass: string;
    manufacturer: string;
    referencePrice: string;
    isDiscontinued: boolean;
  };
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700">Tên thương mại *</label>
        <input
          name="name"
          required
          defaultValue={initial?.name}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          placeholder="Tilt Super 300EC"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">Hoạt chất</label>
        <input
          name="activeIngredient"
          defaultValue={initial?.activeIngredient}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700">Nhóm thuốc *</label>
          <select
            name="groupType"
            defaultValue={initial?.groupType ?? "CHEMICAL"}
            className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          >
            {Object.entries(MEDICINE_GROUP_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">Nhóm độc</label>
          <select
            name="toxicityClass"
            defaultValue={initial?.toxicityClass ?? ""}
            className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          >
            <option value="">Không rõ</option>
            {Object.entries(TOXICITY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700">Nồng độ</label>
          <input
            name="concentration"
            defaultValue={initial?.concentration}
            className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
            placeholder="300EC"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">Đơn vị pha</label>
          <input
            name="unit"
            defaultValue={initial?.unit}
            className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
            placeholder="ml/bình 16L"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700">Thời gian cách ly (ngày)</label>
          <input
            name="phiDays"
            type="number"
            min={0}
            defaultValue={initial?.phiDays}
            className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">Giá tham khảo</label>
          <input
            name="referencePrice"
            defaultValue={initial?.referencePrice}
            className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
            placeholder="120.000đ/chai"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">Nhà sản xuất</label>
        <input
          name="manufacturer"
          defaultValue={initial?.manufacturer}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-neutral-600">
        <input type="checkbox" name="isDiscontinued" defaultChecked={initial?.isDiscontinued} />
        Đã ngừng kinh doanh
      </label>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60"
        >
          {pending ? "Đang lưu..." : "Lưu"}
        </button>
        <Link href="/admin/medicines" className="text-sm text-neutral-500 hover:text-neutral-700">
          Hủy
        </Link>
      </div>
    </form>
  );
}
