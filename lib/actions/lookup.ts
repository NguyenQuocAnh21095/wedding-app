"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/guard";

export type RemedyResult = {
  id: string;
  name: string;
  specialCaseNames: string[];
  itemCount: number;
  matchedCaseCount: number;
};

export async function findRemedies(
  plantId: string,
  diseaseId: string,
  selectedCaseIds: string[]
): Promise<RemedyResult[]> {
  await requireUser();
  if (!plantId || !diseaseId) return [];

  const remedies = await prisma.remedy.findMany({
    where: { plantId, diseaseId, status: "PUBLISHED" },
    include: {
      items: true,
      specialCases: { include: { specialCase: true } },
      plant: true,
      disease: true,
    },
  });

  const selectedSet = new Set(selectedCaseIds);

  const matches = remedies.filter((remedy) =>
    remedy.specialCases.every((rsc) => selectedSet.has(rsc.specialCaseId))
  );

  return matches
    .map((remedy) => ({
      id: remedy.id,
      name: remedy.name || `${remedy.plant.name} - ${remedy.disease.name}`,
      specialCaseNames: remedy.specialCases.map((rsc) => rsc.specialCase.name),
      itemCount: remedy.items.length,
      matchedCaseCount: remedy.specialCases.length,
    }))
    .sort((a, b) => b.matchedCaseCount - a.matchedCaseCount || a.name.localeCompare(b.name));
}
