import { prisma } from "@/lib/prisma";
import { toggleGroupActiveAction, toggleCaseActiveAction } from "@/lib/actions/special-cases";
import ConfirmSubmitButton from "@/components/ConfirmSubmitButton";
import { AddGroupForm, AddCaseForm } from "@/components/admin/SpecialCaseForms";

export default async function AdminSpecialCasesPage() {
  const groups = await prisma.specialCaseGroup.findMany({
    orderBy: { name: "asc" },
    include: { cases: { orderBy: { name: "asc" } } },
  });

  return (
    <div>
      <div>
        <h1 className="text-xl font-semibold text-green-900">Trường hợp đặc biệt</h1>
        <p className="text-sm text-neutral-500">
          Các nhóm điều kiện rẽ nhánh (giai đoạn sinh trưởng, mức độ, canh tác...) dùng khi tạo bài thuốc.
        </p>
      </div>

      <div className="mt-6">
        <AddGroupForm />
      </div>

      <div className="mt-6 space-y-4">
        {groups.map((group) => (
          <div key={group.id} className="rounded border border-black/10 bg-white p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium text-neutral-800">{group.name}</span>
                <span className="ml-2 text-xs text-neutral-400">
                  {group.exclusive ? "Chọn 1 trong nhóm" : "Có thể chọn nhiều"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className={`rounded-full px-2 py-0.5 ${group.isActive ? "bg-green-100 text-green-700" : "bg-neutral-200 text-neutral-500"}`}>
                  {group.isActive ? "Đang dùng" : "Đã ẩn"}
                </span>
                <form action={toggleGroupActiveAction}>
                  <input type="hidden" name="id" value={group.id} />
                  <ConfirmSubmitButton
                    confirmMessage={group.isActive ? "Ẩn nhóm này?" : "Kích hoạt lại nhóm này?"}
                    className="text-neutral-500 hover:underline"
                  >
                    {group.isActive ? "Ẩn" : "Kích hoạt"}
                  </ConfirmSubmitButton>
                </form>
              </div>
            </div>

            <ul className="mt-3 space-y-1.5">
              {group.cases.map((c) => (
                <li key={c.id} className="flex items-center justify-between rounded bg-neutral-50 px-3 py-1.5 text-sm">
                  <div>
                    <span className="text-neutral-700">{c.name}</span>
                    {c.description ? <span className="ml-2 text-xs text-neutral-400">{c.description}</span> : null}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className={c.isActive ? "text-green-700" : "text-neutral-400"}>
                      {c.isActive ? "Đang dùng" : "Đã ẩn"}
                    </span>
                    <form action={toggleCaseActiveAction}>
                      <input type="hidden" name="id" value={c.id} />
                      <ConfirmSubmitButton
                        confirmMessage={c.isActive ? "Ẩn trường hợp này?" : "Kích hoạt lại?"}
                        className="text-neutral-500 hover:underline"
                      >
                        {c.isActive ? "Ẩn" : "Kích hoạt"}
                      </ConfirmSubmitButton>
                    </form>
                  </div>
                </li>
              ))}
              {group.cases.length === 0 ? <li className="text-xs text-neutral-400">Chưa có trường hợp nào.</li> : null}
            </ul>

            <div className="mt-3 border-t border-black/5 pt-3">
              <AddCaseForm groupId={group.id} />
            </div>
          </div>
        ))}
        {groups.length === 0 ? (
          <p className="rounded border border-dashed border-neutral-300 p-6 text-center text-sm text-neutral-400">
            Chưa có nhóm trường hợp đặc biệt nào.
          </p>
        ) : null}
      </div>
    </div>
  );
}
