"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSessionCookie, clearSessionCookie, verifyPassword } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().email("Email không hợp lệ"),
  password: z.string().min(1, "Vui lòng nhập mật khẩu"),
});

export type LoginState = { error?: string };

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };
  }

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!user || !user.isActive) {
    return { error: "Email hoặc mật khẩu không đúng" };
  }

  const validPassword = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!validPassword) {
    return { error: "Email hoặc mật khẩu không đúng" };
  }

  await createSessionCookie({ sub: user.id, name: user.name, role: user.role });
  redirect(user.role === "ADMIN" ? "/admin" : "/tra-cuu");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/login");
}
