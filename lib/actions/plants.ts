"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";

const plantSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên cây trồng"),
  scientificName: z.string().trim().optional(),
  groupName: z.string().trim().optional(),
  growthStages: z.string().trim().optional(),
  imageUrl: z.string().trim().optional(),
});

export type PlantFormState = { error?: string };

function parseGrowthStages(value: string | undefined) {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createPlantAction(_prevState: PlantFormState, formData: FormData): Promise<PlantFormState> {
  await requireAdmin();
  const parsed = plantSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const existing = await prisma.plant.findUnique({ where: { name: parsed.data.name } });
  if (existing) return { error: "Đã tồn tại loại cây với tên này" };

  await prisma.plant.create({
    data: {
      name: parsed.data.name,
      scientificName: parsed.data.scientificName || null,
      groupName: parsed.data.groupName || null,
      growthStages: parseGrowthStages(parsed.data.growthStages),
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  redirect("/admin/plants");
}

export async function updatePlantAction(
  id: string,
  _prevState: PlantFormState,
  formData: FormData
): Promise<PlantFormState> {
  await requireAdmin();
  const parsed = plantSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const existing = await prisma.plant.findUnique({ where: { name: parsed.data.name } });
  if (existing && existing.id !== id) return { error: "Đã tồn tại loại cây với tên này" };

  await prisma.plant.update({
    where: { id },
    data: {
      name: parsed.data.name,
      scientificName: parsed.data.scientificName || null,
      groupName: parsed.data.groupName || null,
      growthStages: parseGrowthStages(parsed.data.growthStages),
      imageUrl: parsed.data.imageUrl || null,
    },
  });

  redirect("/admin/plants");
}

export async function togglePlantActiveAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const plant = await prisma.plant.findUniqueOrThrow({ where: { id } });
  await prisma.plant.update({ where: { id }, data: { isActive: !plant.isActive } });
  redirect("/admin/plants");
}
