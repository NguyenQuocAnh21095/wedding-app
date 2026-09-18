"use client";

import { useState } from "react";

type Item = { id: string; medicineName: string; dosageAmount: string; dosageUnit: string };

export default function DosageCalculator({ items }: { items: Item[] }) {
  const [tankCount, setTankCount] = useState("");
  const count = Number(tankCount);
  const hasValidCount = tankCount.trim() !== "" && Number.isFinite(count) && count > 0;

  return (
    <div className="rounded border border-black/10 bg-white p-4 print:hidden">
      <h2 className="text-sm font-medium text-neutral-700">Tính liều lượng theo số bình phun</h2>
      <p className="mt-1 text-xs text-neutral-400">
        Nhập số bình 16L cần phun (hoặc quy đổi tương ứng với đơn vị liều lượng bên dưới).
      </p>
      <input
        type="number"
        min={0}
        step="0.5"
        value={tankCount}
        onChange={(e) => setTankCount(e.target.value)}
        placeholder="Ví dụ: 3"
        className="mt-2 w-40 rounded border border-neutral-300 px-3 py-1.5 text-sm focus:border-green-600 focus:outline-none"
      />

      {hasValidCount ? (
        <ul className="mt-3 space-y-1 text-sm text-neutral-700">
          {items.map((item) => {
            const perTank = Number(item.dosageAmount);
            const canCompute = Number.isFinite(perTank);
            return (
              <li key={item.id} className="flex justify-between">
                <span>{item.medicineName}</span>
                <span className="font-medium">
                  {canCompute ? `${(perTank * count).toLocaleString("vi-VN")} ${item.dosageUnit.replace(/^[^/]*\//, "")}` : "Không quy đổi được"}
                </span>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
