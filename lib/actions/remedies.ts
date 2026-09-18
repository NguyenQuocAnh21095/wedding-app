"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";

const itemSchema = z.object({
  medicineId: z.string().trim().min(1),
  dosageAmount: z.string().trim().min(1, "Vui lòng nhập liều lượng cho từng loại thuốc"),
  dosageUnit: z.string().trim().min(1, "Vui lòng nhập đơn vị cho từng loại thuốc"),
  usageNote: z.string().trim().optional(),
});

const remedySchema = z.object({
  name: z.string().trim().optional(),
  plantId: z.string().trim().min(1, "Vui lòng chọn cây trồng"),
  diseaseId: z.string().trim().min(1, "Vui lòng chọn bệnh"),
  usageInstructions: z.string().trim().optional(),
  notes: z.string().trim().optional(),
  itemsJson: z.string(),
});

export type RemedyFormState = { error?: string };

function parseItems(itemsJson: string) {
  let raw: unknown;
  try {
    raw = JSON.parse(itemsJson);
  } catch {
    return { error: "Danh sách thuốc không hợp lệ" } as const;
  }
  const result = z.array(itemSchema).min(1, "Bài thuốc cần ít nhất 1 loại thuốc").safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0]?.message ?? "Danh sách thuốc không hợp lệ" } as const;
  }
  return { items: result.data } as const;
}

export async function createRemedyAction(_prevState: RemedyFormState, formData: FormData): Promise<RemedyFormState> {
  const session = await requireAdmin();
  const parsed = remedySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const itemsResult = parseItems(parsed.data.itemsJson);
  if ("error" in itemsResult) return { error: itemsResult.error };

  const link = await prisma.plantDisease.findUnique({
    where: { plantId_diseaseId: { plantId: parsed.data.plantId, diseaseId: parsed.data.diseaseId } },
  });
  if (!link) return { error: "Bệnh này chưa được gắn với cây trồng đã chọn" };

  const specialCaseIds = formData.getAll("specialCaseIds").map(String).filter(Boolean);

  await prisma.remedy.create({
    data: {
      name: parsed.data.name || null,
      plantId: parsed.data.plantId,
      diseaseId: parsed.data.diseaseId,
      usageInstructions: parsed.data.usageInstructions || null,
      notes: parsed.data.notes || null,
      createdById: session.sub,
      specialCases: { create: specialCaseIds.map((specialCaseId) => ({ specialCaseId })) },
      items: {
        create: itemsResult.items.map((item, index) => ({
          medicineId: item.medicineId,
          dosageAmount: item.dosageAmount,
          dosageUnit: item.dosageUnit,
          usageNote: item.usageNote || null,
          mixOrder: index + 1,
        })),
      },
    },
  });

  redirect("/admin/remedies");
}

export async function updateRemedyAction(
  id: string,
  _prevState: RemedyFormState,
  formData: FormData
): Promise<RemedyFormState> {
  await requireAdmin();
  const parsed = remedySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const itemsResult = parseItems(parsed.data.itemsJson);
  if ("error" in itemsResult) return { error: itemsResult.error };

  const link = await prisma.plantDisease.findUnique({
    where: { plantId_diseaseId: { plantId: parsed.data.plantId, diseaseId: parsed.data.diseaseId } },
  });
  if (!link) return { error: "Bệnh này chưa được gắn với cây trồng đã chọn" };

  const specialCaseIds = formData.getAll("specialCaseIds").map(String).filter(Boolean);

  await prisma.$transaction([
    prisma.remedy.update({
      where: { id },
      data: {
        name: parsed.data.name || null,
        plantId: parsed.data.plantId,
        diseaseId: parsed.data.diseaseId,
        usageInstructions: parsed.data.usageInstructions || null,
        notes: parsed.data.notes || null,
      },
    }),
    prisma.remedySpecialCase.deleteMany({ where: { remedyId: id } }),
    prisma.remedySpecialCase.createMany({
      data: specialCaseIds.map((specialCaseId) => ({ remedyId: id, specialCaseId })),
    }),
    prisma.remedyItem.deleteMany({ where: { remedyId: id } }),
    prisma.remedyItem.createMany({
      data: itemsResult.items.map((item, index) => ({
        remedyId: id,
        medicineId: item.medicineId,
        dosageAmount: item.dosageAmount,
        dosageUnit: item.dosageUnit,
        usageNote: item.usageNote || null,
        mixOrder: index + 1,
      })),
    }),
  ]);

  redirect(`/admin/remedies/${id}`);
}

const STATUS_VALUES = ["DRAFT", "PUBLISHED", "DISCONTINUED"] as const;

export async function setRemedyStatusAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  if (!STATUS_VALUES.includes(status as (typeof STATUS_VALUES)[number])) return;
  await prisma.remedy.update({ where: { id }, data: { status: status as (typeof STATUS_VALUES)[number] } });
  redirect(`/admin/remedies/${id}`);
}
