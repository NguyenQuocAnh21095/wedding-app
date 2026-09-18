"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";

const GROUP_TYPES = ["CHEMICAL", "BIOLOGICAL", "HERBAL"] as const;
const TOXICITY_CLASSES = ["I", "II", "III", "IV"] as const;

const medicineSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên thuốc"),
  activeIngredient: z.string().trim().optional(),
  groupType: z.enum(GROUP_TYPES),
  concentration: z.string().trim().optional(),
  unit: z.string().trim().optional(),
  phiDays: z.string().trim().optional(),
  toxicityClass: z.union([z.enum(TOXICITY_CLASSES), z.literal("")]).optional(),
  manufacturer: z.string().trim().optional(),
  referencePrice: z.string().trim().optional(),
  isDiscontinued: z.string().optional(),
});

export type MedicineFormState = { error?: string };

function buildData(parsed: z.infer<typeof medicineSchema>) {
  return {
    name: parsed.name,
    activeIngredient: parsed.activeIngredient || null,
    groupType: parsed.groupType,
    concentration: parsed.concentration || null,
    unit: parsed.unit || null,
    phiDays: parsed.phiDays ? Number(parsed.phiDays) : null,
    toxicityClass: parsed.toxicityClass || null,
    manufacturer: parsed.manufacturer || null,
    referencePrice: parsed.referencePrice || null,
    isDiscontinued: parsed.isDiscontinued === "on",
  };
}

export async function createMedicineAction(_prevState: MedicineFormState, formData: FormData): Promise<MedicineFormState> {
  await requireAdmin();
  const parsed = medicineSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const existing = await prisma.medicine.findUnique({ where: { name: parsed.data.name } });
  if (existing) return { error: "Đã tồn tại thuốc với tên này" };

  await prisma.medicine.create({ data: buildData(parsed.data) });
  redirect("/admin/medicines");
}

export async function updateMedicineAction(
  id: string,
  _prevState: MedicineFormState,
  formData: FormData
): Promise<MedicineFormState> {
  await requireAdmin();
  const parsed = medicineSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const existing = await prisma.medicine.findUnique({ where: { name: parsed.data.name } });
  if (existing && existing.id !== id) return { error: "Đã tồn tại thuốc với tên này" };

  await prisma.medicine.update({ where: { id }, data: buildData(parsed.data) });
  redirect("/admin/medicines");
}

export async function toggleMedicineActiveAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const medicine = await prisma.medicine.findUniqueOrThrow({ where: { id } });
  await prisma.medicine.update({ where: { id }, data: { isActive: !medicine.isActive } });
  redirect("/admin/medicines");
}
