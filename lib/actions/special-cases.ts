"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guard";

export type SpecialCaseFormState = { error?: string };

const groupSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên nhóm"),
  exclusive: z.string().optional(),
});

export async function createSpecialCaseGroupAction(
  _prevState: SpecialCaseFormState,
  formData: FormData
): Promise<SpecialCaseFormState> {
  await requireAdmin();
  const parsed = groupSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const existing = await prisma.specialCaseGroup.findUnique({ where: { name: parsed.data.name } });
  if (existing) return { error: "Đã tồn tại nhóm với tên này" };

  await prisma.specialCaseGroup.create({
    data: { name: parsed.data.name, exclusive: parsed.data.exclusive === "on" },
  });

  redirect("/admin/special-cases");
}

export async function toggleGroupActiveAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const group = await prisma.specialCaseGroup.findUniqueOrThrow({ where: { id } });
  await prisma.specialCaseGroup.update({ where: { id }, data: { isActive: !group.isActive } });
  redirect("/admin/special-cases");
}

const caseSchema = z.object({
  groupId: z.string().trim().min(1),
  name: z.string().trim().min(1, "Vui lòng nhập tên trường hợp"),
  description: z.string().trim().optional(),
});

export async function createSpecialCaseAction(
  _prevState: SpecialCaseFormState,
  formData: FormData
): Promise<SpecialCaseFormState> {
  await requireAdmin();
  const parsed = caseSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const existing = await prisma.specialCase.findUnique({
    where: { groupId_name: { groupId: parsed.data.groupId, name: parsed.data.name } },
  });
  if (existing) return { error: "Đã tồn tại trường hợp với tên này trong nhóm" };

  await prisma.specialCase.create({
    data: {
      groupId: parsed.data.groupId,
      name: parsed.data.name,
      description: parsed.data.description || null,
    },
  });

  redirect("/admin/special-cases");
}

export async function toggleCaseActiveAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const specialCase = await prisma.specialCase.findUniqueOrThrow({ where: { id } });
  await prisma.specialCase.update({ where: { id }, data: { isActive: !specialCase.isActive } });
  redirect("/admin/special-cases");
}
