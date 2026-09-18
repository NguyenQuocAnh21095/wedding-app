"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { PlantFormState } from "@/lib/actions/plants";

export default function PlantForm({
  action,
  initial,
}: {
  action: (prevState: PlantFormState, formData: FormData) => Promise<PlantFormState>;
  initial?: {
    name: string;
    scientificName: string;
    groupName: string;
    growthStages: string;
    imageUrl: string;
  };
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="max-w-xl space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700">Tên cây trồng *</label>
        <input
          name="name"
          required
          defaultValue={initial?.name}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          placeholder="Lúa"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">Tên khoa học</label>
        <input
          name="scientificName"
          defaultValue={initial?.scientificName}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          placeholder="Oryza sativa"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">Nhóm cây</label>
        <input
          name="groupName"
          defaultValue={initial?.groupName}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          placeholder="Cây lương thực"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">Giai đoạn sinh trưởng</label>
        <input
          name="growthStages"
          defaultValue={initial?.growthStages}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          placeholder="Cây con, Sinh trưởng, Ra hoa, Đậu quả, Thu hoạch"
        />
        <p className="mt-1 text-xs text-neutral-400">Phân cách các giai đoạn bằng dấu phẩy.</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-neutral-700">Ảnh minh họa (URL)</label>
        <input
          name="imageUrl"
          defaultValue={initial?.imageUrl}
          className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
          placeholder="https://..."
        />
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
        <Link href="/admin/plants" className="text-sm text-neutral-500 hover:text-neutral-700">
          Hủy
        </Link>
      </div>
    </form>
  );
}
