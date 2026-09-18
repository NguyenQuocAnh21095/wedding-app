import Link from "next/link";
import { getSession } from "@/lib/auth";
import { logoutAction } from "@/lib/actions/auth";

const ADMIN_LINKS = [
  { href: "/admin", label: "Tổng quan" },
  { href: "/admin/plants", label: "Cây trồng" },
  { href: "/admin/diseases", label: "Bệnh / Sâu hại" },
  { href: "/admin/special-cases", label: "Trường hợp đặc biệt" },
  { href: "/admin/medicines", label: "Thuốc" },
  { href: "/admin/remedies", label: "Bài thuốc" },
];

const STAFF_LINKS = [
  { href: "/tra-cuu", label: "Tra cứu" },
  { href: "/tim-kiem", label: "Tìm kiếm nhanh" },
];

export default async function NavBar() {
  const session = await getSession();
  if (!session) return null;

  const links = session.role === "ADMIN" ? ADMIN_LINKS : STAFF_LINKS;

  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center gap-5">
          <Link href={session.role === "ADMIN" ? "/admin" : "/tra-cuu"} className="text-lg font-semibold text-green-800">
            AgriRx
          </Link>
          <nav className="flex flex-wrap gap-4 text-sm">
            {links.map((link) => (
              <Link key={link.href} href={link.href} className="text-neutral-600 hover:text-green-700">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3 text-sm text-neutral-600">
          <span>
            {session.name} · <span className="text-neutral-400">{session.role === "ADMIN" ? "Admin" : "Staff"}</span>
          </span>
          <form action={logoutAction}>
            <button type="submit" className="rounded border border-neutral-300 px-3 py-1 hover:bg-neutral-50">
              Đăng xuất
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
