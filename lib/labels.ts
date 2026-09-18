export const AGENT_TYPE_LABELS: Record<string, string> = {
  FUNGUS: "Nấm",
  BACTERIA: "Vi khuẩn",
  VIRUS: "Virus",
  PEST: "Sâu hại",
  NEMATODE: "Tuyến trùng",
  NUTRIENT_DEFICIENCY: "Thiếu dinh dưỡng",
  OTHER: "Khác",
};

export const MEDICINE_GROUP_LABELS: Record<string, string> = {
  CHEMICAL: "Hóa học",
  BIOLOGICAL: "Sinh học",
  HERBAL: "Thảo dược / hữu cơ",
};

export const TOXICITY_LABELS: Record<string, string> = {
  I: "Nhóm I (rất độc)",
  II: "Nhóm II (độc cao)",
  III: "Nhóm III (độc trung bình)",
  IV: "Nhóm IV (ít độc)",
};

export const REMEDY_STATUS_LABELS: Record<string, string> = {
  DRAFT: "Nháp",
  PUBLISHED: "Đã xuất bản",
  DISCONTINUED: "Ngừng dùng",
};

export const REMEDY_STATUS_COLORS: Record<string, string> = {
  DRAFT: "bg-amber-100 text-amber-700",
  PUBLISHED: "bg-green-100 text-green-700",
  DISCONTINUED: "bg-neutral-200 text-neutral-500",
};
