"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { findRemedies, type RemedyResult } from "@/lib/actions/lookup";

type Plant = { id: string; name: string; diseases: { id: string; name: string }[] };
type SpecialCaseGroup = { id: string; name: string; exclusive: boolean; cases: { id: string; name: string }[] };

export default function LookupWizard({
  plants,
  specialCaseGroups,
}: {
  plants: Plant[];
  specialCaseGroups: SpecialCaseGroup[];
}) {
  const [plantId, setPlantId] = useState("");
  const [diseaseId, setDiseaseId] = useState("");
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);
  const [results, setResults] = useState<RemedyResult[] | null>(null);
  const [isPending, startTransition] = useTransition();

  const diseasesForPlant = useMemo(() => plants.find((p) => p.id === plantId)?.diseases ?? [], [plants, plantId]);

  useEffect(() => {
    if (!plantId || !diseaseId) {
      setResults(null);
      return;
    }
    startTransition(async () => {
      const data = await findRemedies(plantId, diseaseId, selectedCaseIds);
      setResults(data);
    });
  }, [plantId, diseaseId, selectedCaseIds]);

  function toggleCase(groupExclusive: boolean, groupCaseIds: string[], caseId: string) {
    setSelectedCaseIds((prev) => {
      if (groupExclusive) {
        const withoutGroup = prev.filter((id) => !groupCaseIds.includes(id));
        return prev.includes(caseId) ? withoutGroup : [...withoutGroup, caseId];
      }
      return prev.includes(caseId) ? prev.filter((id) => id !== caseId) : [...prev, caseId];
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-black/10 bg-white p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-neutral-700">1. Loại cây trồng</label>
            <select
              value={plantId}
              onChange={(e) => {
                setPlantId(e.target.value);
                setDiseaseId("");
                setSelectedCaseIds([]);
              }}
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
            <label className="block text-sm font-medium text-neutral-700">2. Bệnh / sâu hại</label>
            <select
              value={diseaseId}
              onChange={(e) => {
                setDiseaseId(e.target.value);
                setSelectedCaseIds([]);
              }}
              disabled={!plantId || diseasesForPlant.length === 0}
              className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-400"
            >
              <option value="">
                {!plantId
                  ? "— Chọn cây trồng trước —"
                  : diseasesForPlant.length === 0
                    ? "— Cây này chưa có bệnh nào —"
                    : "— Chọn bệnh —"}
              </option>
              {diseasesForPlant.map((disease) => (
                <option key={disease.id} value={disease.id}>
                  {disease.name}
                </option>
              ))}
            </select>
            {plantId && diseasesForPlant.length === 0 ? (
              <p className="mt-1 text-xs text-amber-600">
                Cây này chưa được gắn bệnh nào. Hãy chọn cây khác hoặc báo Admin bổ sung ở mục Bệnh / Sâu hại.
              </p>
            ) : null}
          </div>
        </div>

        {diseaseId ? (
          <div className="mt-4">
            <label className="block text-sm font-medium text-neutral-700">3. Trường hợp đặc biệt (nếu có)</label>
            <div className="mt-2 space-y-3">
              {specialCaseGroups.map((group) => (
                <div key={group.id}>
                  <p className="text-xs font-medium text-neutral-500">{group.name}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {group.cases.map((c) => {
                      const active = selectedCaseIds.includes(c.id);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() =>
                            toggleCase(
                              group.exclusive,
                              group.cases.map((gc) => gc.id),
                              c.id
                            )
                          }
                          className={`rounded-full border px-3 py-1 text-xs ${
                            active
                              ? "border-green-700 bg-green-700 text-white"
                              : "border-neutral-300 text-neutral-600 hover:border-green-400"
                          }`}
                        >
                          {c.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              <p className="text-xs text-neutral-400">Không chọn trường hợp nào nếu không rõ hoặc không áp dụng.</p>
            </div>
          </div>
        ) : null}
      </div>

      {diseaseId ? (
        <div>
          <h2 className="text-sm font-medium text-neutral-700">Kết quả bài thuốc phù hợp</h2>
          {isPending ? <p className="mt-2 text-sm text-neutral-400">Đang tìm...</p> : null}
          {!isPending && results && results.length === 0 ? (
            <p className="mt-2 rounded border border-dashed border-neutral-300 p-4 text-sm text-neutral-400">
              Chưa có bài thuốc phù hợp với lựa chọn này. Hãy thử bỏ bớt trường hợp đặc biệt.
            </p>
          ) : null}
          <div className="mt-2 space-y-2">
            {results?.map((r) => (
              <Link
                key={r.id}
                href={`/bai-thuoc/${r.id}`}
                className="block rounded border border-black/10 bg-white p-4 hover:border-green-300"
              >
                <div className="font-medium text-neutral-800">{r.name}</div>
                <div className="mt-1 flex flex-wrap gap-1">
                  {r.specialCaseNames.length > 0 ? (
                    r.specialCaseNames.map((name) => (
                      <span key={name} className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                        {name}
                      </span>
                    ))
                  ) : (
                    <span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">Áp dụng chung</span>
                  )}
                </div>
                <div className="mt-1 text-xs text-neutral-400">{r.itemCount} loại thuốc</div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
