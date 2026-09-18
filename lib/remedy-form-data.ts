import "server-only";
import { prisma } from "@/lib/prisma";

export async function getRemedyFormData() {
  const [plantsRaw, groupsRaw, medicinesRaw] = await Promise.all([
    prisma.plant.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: { diseases: { include: { disease: true } } },
    }),
    prisma.specialCaseGroup.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: { cases: { where: { isActive: true }, orderBy: { name: "asc" } } },
    }),
    prisma.medicine.findMany({ where: { isActive: true }, orderBy: { name: "asc" } }),
  ]);

  const plants = plantsRaw.map((plant) => ({
    id: plant.id,
    name: plant.name,
    diseases: plant.diseases
      .filter((pd) => pd.disease.isActive)
      .map((pd) => ({ id: pd.disease.id, name: pd.disease.name })),
  }));

  const specialCaseGroups = groupsRaw.map((group) => ({
    id: group.id,
    name: group.name,
    exclusive: group.exclusive,
    cases: group.cases.map((c) => ({ id: c.id, name: c.name })),
  }));

  const medicines = medicinesRaw.map((m) => ({ id: m.id, name: m.name, unit: m.unit }));

  return { plants, specialCaseGroups, medicines };
}
