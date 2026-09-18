import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function TimKiemPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const remedies = query
    ? await prisma.remedy.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { plant: { name: { contains: query, mode: "insensitive" } } },
            { disease: { name: { contains: query, mode: "insensitive" } } },
            { items: { some: { medicine: { name: { contains: query, mode: "insensitive" } } } } },
          ],
        },
        include: { plant: true, disease: true, items: { include: { medicine: true } } },
        orderBy: { updatedAt: "desc" },
        take: 30,
      })
    : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-xl font-semibold text-green-900">Tìm kiếm nhanh</h1>
      <p className="mt-1 text-sm text-neutral-500">Tìm theo tên cây, tên bệnh hoặc tên thuốc.</p>

      <form className="mt-4 flex gap-2">
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Ví dụ: đạo ôn, cà chua, Tilt Super..."
          className="flex-1 rounded border border-neutral-300 px-3 py-2 text-sm focus:border-green-600 focus:outline-none"
        />
        <button type="submit" className="rounded bg-green-700 px-4 py-2 text-sm font-medium text-white hover:bg-green-800">
          Tìm
        </button>
      </form>

      <div className="mt-6 space-y-2">
        {query && remedies.length === 0 ? (
          <p className="rounded border border-dashed border-neutral-300 p-4 text-sm text-neutral-400">
            Không tìm thấy bài thuốc phù hợp với &quot;{query}&quot;.
          </p>
        ) : null}
        {remedies.map((remedy) => (
          <Link
            key={remedy.id}
            href={`/bai-thuoc/${remedy.id}`}
            className="block rounded border border-black/10 bg-white p-4 hover:border-green-300"
          >
            <div className="font-medium text-neutral-800">{remedy.name || `${remedy.plant.name} - ${remedy.disease.name}`}</div>
            <div className="mt-1 text-xs text-neutral-500">
              {remedy.plant.name} · {remedy.disease.name}
            </div>
            <div className="mt-1 text-xs text-neutral-400">
              {remedy.items.map((i) => i.medicine.name).join(", ")}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
