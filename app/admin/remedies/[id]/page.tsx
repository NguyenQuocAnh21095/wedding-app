import { notFound } from "next/navigation";
import Link from "next/link";
import RemedyForm from "@/components/admin/RemedyForm";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import { updateRemedyAction, setRemedyStatusAction } from "@/lib/actions/remedies";
import { getRemedyFormData } from "@/lib/remedy-form-data";
import { prisma } from "@/lib/prisma";
import { REMEDY_STATUS_LABELS, REMEDY_STATUS_COLORS } from "@/lib/labels";

export default async function EditRemedyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [remedy, formData] = await Promise.all([
    prisma.remedy.findUnique({
      where: { id },
      include: {
        items: { include: { medicine: true }, orderBy: { mixOrder: "asc" } },
        specialCases: true,
        createdBy: true,
      },
    }),
    getRemedyFormData(),
  ]);
  if (!remedy) notFound();

  const updateWithId = updateRemedyAction.bind(null, remedy.id);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-green-900">Sửa bài thuốc</h1>
          <p className="text-sm text-neutral-500">
            Tạo bởi {remedy.createdBy.name} · Cập nhật {remedy.updatedAt.toLocaleDateString("vi-VN")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs ${REMEDY_STATUS_COLORS[remedy.status]}`}>
            {REMEDY_STATUS_LABELS[remedy.status]}
          </span>
          <Link href={`/bai-thuoc/${remedy.id}`} className="text-sm text-green-700 hover:underline">
            Xem như Staff ↗
          </Link>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {remedy.status !== "PUBLISHED" ? (
          <form action={setRemedyStatusAction}>
            <input type="hidden" name="id" value={remedy.id} />
            <input type="hidden" name="status" value="PUBLISHED" />
            <button type="submit" className="rounded bg-green-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-800">
              Xuất bản
            </button>
          </form>
        ) : null}
        {remedy.status !== "DRAFT" ? (
          <form action={setRemedyStatusAction}>
            <input type="hidden" name="id" value={remedy.id} />
            <input type="hidden" name="status" value="DRAFT" />
            <button type="submit" className="rounded border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50">
              Chuyển về nháp
            </button>
          </form>
        ) : null}
        {remedy.status !== "DISCONTINUED" ? (
          <form action={setRemedyStatusAction}>
            <input type="hidden" name="id" value={remedy.id} />
            <input type="hidden" name="status" value="DISCONTINUED" />
            <ConfirmSubmitButton
              confirmMessage="Ngừng sử dụng bài thuốc này? Bài thuốc sẽ không còn hiện trong kết quả tra cứu."
              className="rounded border border-red-300 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
            >
              Ngừng sử dụng
            </ConfirmSubmitButton>
          </form>
        ) : null}
      </div>

      <div className="mt-6">
        <RemedyForm
          action={updateWithId}
          plants={formData.plants}
          specialCaseGroups={formData.specialCaseGroups}
          medicines={formData.medicines}
          initial={{
            name: remedy.name ?? "",
            plantId: remedy.plantId,
            diseaseId: remedy.diseaseId,
            usageInstructions: remedy.usageInstructions ?? "",
            notes: remedy.notes ?? "",
            specialCaseIds: remedy.specialCases.map((sc) => sc.specialCaseId),
            items: remedy.items.map((item) => ({
              medicineId: item.medicineId,
              dosageAmount: item.dosageAmount,
              dosageUnit: item.dosageUnit,
              usageNote: item.usageNote ?? "",
            })),
          }}
        />
      </div>
    </div>
  );
}
