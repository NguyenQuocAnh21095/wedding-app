"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";

const AGENT_TYPES = ["FUNGUS", "BACTERIA", "VIRUS", "PEST", "NEMATODE", "NUTRIENT_DEFICIENCY", "OTHER"] as const;

const diseaseSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên bệnh"),
  agentType: z.enum(AGENT_TYPES),
  description: z.string().trim().optional(),
});

export type DiseaseFormState = { error?: string };

function getPlantIds(formData: FormData) {
  return formData.getAll("plantIds").map(String).filter(Boolean);
}

export async function createDiseaseAction(_prevState: DiseaseFormState, formData: FormData): Promise<DiseaseFormState> {
  await requireAdmin();
  const parsed = diseaseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const existing = await prisma.disease.findUnique({ where: { name: parsed.data.name } });
  if (existing) return { error: "Đã tồn tại bệnh với tên này" };

  const plantIds = getPlantIds(formData);

  await prisma.disease.create({
    data: {
      name: parsed.data.name,
      agentType: parsed.data.agentType,
      description: parsed.data.description || null,
      plants: { create: plantIds.map((plantId) => ({ plantId })) },
    },
  });

  redirect("/admin/diseases");
}

export async function updateDiseaseAction(
  id: string,
  _prevState: DiseaseFormState,
  formData: FormData
): Promise<DiseaseFormState> {
  await requireAdmin();
  const parsed = diseaseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const existing = await prisma.disease.findUnique({ where: { name: parsed.data.name } });
  if (existing && existing.id !== id) return { error: "Đã tồn tại bệnh với tên này" };

  const plantIds = getPlantIds(formData);

  await prisma.$transaction([
    prisma.disease.update({
      where: { id },
      data: {
        name: parsed.data.name,
        agentType: parsed.data.agentType,
        description: parsed.data.description || null,
      },
    }),
    prisma.plantDisease.deleteMany({ where: { diseaseId: id } }),
    prisma.plantDisease.createMany({ data: plantIds.map((plantId) => ({ plantId, diseaseId: id })) }),
  ]);

  redirect("/admin/diseases");
}

export async function toggleDiseaseActiveAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const disease = await prisma.disease.findUniqueOrThrow({ where: { id } });
  await prisma.disease.update({ where: { id }, data: { isActive: !disease.isActive } });
  redirect("/admin/diseases");
}
