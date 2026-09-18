"use client";

import { useActionState } from "react";
import {
  createSpecialCaseGroupAction,
  createSpecialCaseAction,
  type SpecialCaseFormState,
} from "@/lib/actions/special-cases";

export function AddGroupForm() {
  const [state, formAction, pending] = useActionState<SpecialCaseFormState, FormData>(
    createSpecialCaseGroupAction,
    {}
  );

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-3 rounded border border-black/10 bg-white p-4">
      <div>
        <label className="block text-xs font-medium text-neutral-600">Tên nhóm mới</label>
        <input
          name="name"
          required
          className="mt-1 w-56 rounded border border-neutral-300 px-3 py-1.5 text-sm focus:border-green-600 focus:outline-none"
          placeholder="Mức độ bệnh"
        />
      </div>
      <label className="flex items-center gap-2 pb-1.5 text-xs text-neutral-600">
        <input type="checkbox" name="exclusive" />
        Chỉ chọn 1 trường hợp trong nhóm
      </label>
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-green-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60"
      >
        {pending ? "Đang lưu..." : "+ Thêm nhóm"}
      </button>
      {state.error ? <p className="w-full text-sm text-red-600">{state.error}</p> : null}
    </form>
  );
}

export function AddCaseForm({ groupId }: { groupId: string }) {
  const boundAction = createSpecialCaseAction;
  const [state, formAction, pending] = useActionState<SpecialCaseFormState, FormData>(boundAction, {});

  return (
    <form action={formAction} className="flex flex-wrap items-end gap-2">
      <input type="hidden" name="groupId" value={groupId} />
      <input
        name="name"
        required
        placeholder="Tên trường hợp"
        className="rounded border border-neutral-300 px-2 py-1 text-xs focus:border-green-600 focus:outline-none"
      />
      <input
        name="description"
        placeholder="Mô tả (tùy chọn)"
        className="rounded border border-neutral-300 px-2 py-1 text-xs focus:border-green-600 focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded border border-green-700 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-50 disabled:opacity-60"
      >
        + Thêm
      </button>
      {state.error ? <p className="w-full text-xs text-red-600">{state.error}</p> : null}
    </form>
  );
}
