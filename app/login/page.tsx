"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/lib/actions/auth";

const initialState: LoginState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-[calc(100vh-57px)] items-center justify-center bg-[var(--background)] px-4">
      <div className="w-full max-w-sm rounded-xl border border-black/10 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold text-green-800">AgriRx</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Đăng nhập để tra cứu và quản lý bài thuốc bảo vệ thực vật
        </p>

        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
              placeholder="ban@agrirx.vn"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-1 w-full rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded bg-green-700 px-3 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-60"
          >
            {pending ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-6 rounded bg-neutral-50 p-3 text-xs text-neutral-500">
          <p className="font-medium text-neutral-600">Tài khoản demo</p>
          <p>Admin: admin@agrirx.vn / Admin@123</p>
          <p>Staff: staff@agrirx.vn / Staff@123</p>
        </div>
      </div>
    </div>
  );
}
