"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { DiseaseFormState } from "@/lib/actions/diseases";
import { AGENT_TYPE_LABELS } from "@/lib/labels";

export default function DiseaseForm({
  action,
  allPlants,
  initial,
}: {
  action: (prevState: DiseaseFormState, formData: FormData) => Promise<DiseaseFormState>;
  allPlants: { id: string; name: string }[];
  initial?: {
    name: string;
    agentType: string;
    description: string;
    plantIds: string[];
  };
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700">Tên bệnh / sâu hại *</label>
        <input
          name="name"
          required
          defaultValue={initial?.name}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          placeholder="Đạo ôn"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">Nhóm tác nhân *</label>
        <select
          name="agentType"
          defaultValue={initial?.agentType ?? "OTHER"}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        >
          {Object.entries(AGENT_TYPE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">Mô tả triệu chứng</label>
        <textarea
          name="description"
          defaultValue={initial?.description}
          rows={4}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">Xuất hiện trên cây trồng</label>
        <div className="mt-2 grid grid-cols-2 gap-2 rounded border border-neutral-200 p-3 sm:grid-cols-3">
          {allPlants.map((plant) => (
            <label key={plant.id} className="flex items-center gap-2 text-sm text-neutral-600">
              <input
                type="checkbox"
                name="plantIds"
                value={plant.id}
                defaultChecked={initial?.plantIds.includes(plant.id)}
              />
              {plant.name}
            </label>
          ))}
          {allPlants.length === 0 ? <p className="text-xs text-neutral-400">Chưa có loại cây nào.</p> : null}
        </div>
      </div>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60"
        >
          {pending ? "Đang lưu..." : "Lưu"}
        </button>
        <Link href="/admin/diseases" className="text-sm text-neutral-500 hover:text-neutral-700">
          Hủy
        </Link>
      </div>
    </form>
  );
}
