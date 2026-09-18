import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [plantCount, diseaseCount, medicineCount, groupCount, remedyStatusCounts] = await Promise.all([
    prisma.plant.count({ where: { isActive: true } }),
    prisma.disease.count({ where: { isActive: true } }),
    prisma.medicine.count({ where: { isActive: true } }),
    prisma.specialCaseGroup.count({ where: { isActive: true } }),
    prisma.remedy.groupBy({ by: ["status"], _count: true }),
  ]);

  const statusMap = Object.fromEntries(remedyStatusCounts.map((r) => [r.status, r._count]));

  const cards = [
    { label: "Cây trồng", value: plantCount, href: "/admin/plants" },
    { label: "Bệnh / Sâu hại", value: diseaseCount, href: "/admin/diseases" },
    { label: "Thuốc", value: medicineCount, href: "/admin/medicines" },
    { label: "Nhóm trường hợp đặc biệt", value: groupCount, href: "/admin/special-cases" },
    { label: "Bài thuốc đã xuất bản", value: statusMap.PUBLISHED ?? 0, href: "/admin/remedies" },
    { label: "Bài thuốc đang nháp", value: statusMap.DRAFT ?? 0, href: "/admin/remedies" },
  ];

  return (
    <div>
      <h1 className="text-xl font-semibold text-green-900">Tổng quan</h1>
      <p className="text-sm text-neutral-500">Số liệu nhanh về dữ liệu hệ thống AgriRx.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded border border-black/10 bg-white p-4 hover:border-green-300"
          >
            <div className="text-2xl font-semibold text-green-800">{card.value}</div>
            <div className="mt-1 text-sm text-neutral-500">{card.label}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
