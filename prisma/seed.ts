import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin@123", 10);
  const staffPasswordHash = await bcrypt.hash("Staff@123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@agrirx.vn" },
    update: {},
    create: {
      name: "Quản trị viên",
      email: "admin@agrirx.vn",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "staff@agrirx.vn" },
    update: {},
    create: {
      name: "Nhân viên kỹ thuật",
      email: "staff@agrirx.vn",
      passwordHash: staffPasswordHash,
      role: "STAFF",
    },
  });

  const lua = await prisma.plant.upsert({
    where: { name: "Lúa" },
    update: {},
    create: {
      name: "Lúa",
      scientificName: "Oryza sativa",
      groupName: "Cây lương thực",
      growthStages: ["Mạ", "Đẻ nhánh", "Làm đòng", "Trổ bông", "Chín"],
    },
  });

  const caChua = await prisma.plant.upsert({
    where: { name: "Cà chua" },
    update: {},
    create: {
      name: "Cà chua",
      scientificName: "Solanum lycopersicum",
      groupName: "Rau ăn quả",
      growthStages: ["Cây con", "Sinh trưởng", "Ra hoa", "Đậu quả", "Thu hoạch"],
    },
  });

  const cam = await prisma.plant.upsert({
    where: { name: "Cam" },
    update: {},
    create: {
      name: "Cam",
      scientificName: "Citrus sinensis",
      groupName: "Cây ăn quả",
      growthStages: ["Kiến thiết cơ bản", "Kinh doanh", "Ra hoa", "Đậu quả"],
    },
  });

  const daoOn = await prisma.disease.upsert({
    where: { name: "Đạo ôn" },
    update: {},
    create: { name: "Đạo ôn", agentType: "FUNGUS", description: "Bệnh do nấm Pyricularia oryzae gây ra trên lá, cổ bông." },
  });

  const bacLa = await prisma.disease.upsert({
    where: { name: "Bạc lá lúa" },
    update: {},
    create: { name: "Bạc lá lúa", agentType: "BACTERIA", description: "Bệnh do vi khuẩn Xanthomonas oryzae gây cháy mép lá." },
  });

  const suongMai = await prisma.disease.upsert({
    where: { name: "Sương mai" },
    update: {},
    create: { name: "Sương mai", agentType: "FUNGUS", description: "Bệnh do nấm Phytophthora infestans, phát triển mạnh khi ẩm độ cao." },
  });

  const sauVeBua = await prisma.disease.upsert({
    where: { name: "Sâu vẽ bùa" },
    update: {},
    create: { name: "Sâu vẽ bùa", agentType: "PEST", description: "Ấu trùng đục lá non tạo đường hầm ngoằn ngoèo, hại chồi non cây có múi." },
  });

  async function linkPlantDisease(plantId: string, diseaseId: string) {
    await prisma.plantDisease.upsert({
      where: { plantId_diseaseId: { plantId, diseaseId } },
      update: {},
      create: { plantId, diseaseId },
    });
  }
  await linkPlantDisease(lua.id, daoOn.id);
  await linkPlantDisease(lua.id, bacLa.id);
  await linkPlantDisease(caChua.id, suongMai.id);
  await linkPlantDisease(cam.id, sauVeBua.id);
  await linkPlantDisease(caChua.id, sauVeBua.id);

  const growthStageGroup = await prisma.specialCaseGroup.upsert({
    where: { name: "Giai đoạn sinh trưởng" },
    update: {},
    create: { name: "Giai đoạn sinh trưởng", exclusive: true },
  });
  const severityGroup = await prisma.specialCaseGroup.upsert({
    where: { name: "Mức độ bệnh" },
    update: {},
    create: { name: "Mức độ bệnh", exclusive: true },
  });
  const farmingGroup = await prisma.specialCaseGroup.upsert({
    where: { name: "Phương thức canh tác" },
    update: {},
    create: { name: "Phương thức canh tác", exclusive: false },
  });

  async function upsertCase(groupId: string, name: string, description?: string) {
    return prisma.specialCase.upsert({
      where: { groupId_name: { groupId, name } },
      update: {},
      create: { groupId, name, description },
    });
  }
  const caseYoung = await upsertCase(growthStageGroup.id, "Cây con / mới trồng");
  await upsertCase(growthStageGroup.id, "Sinh trưởng - phát triển");
  await upsertCase(growthStageGroup.id, "Ra hoa - đậu quả");
  const caseMild = await upsertCase(severityGroup.id, "Nhẹ (mới chớm)");
  const caseSevere = await upsertCase(severityGroup.id, "Nặng (lan rộng)");
  const caseOrganic = await upsertCase(farmingGroup.id, "Canh tác hữu cơ");
  await upsertCase(farmingGroup.id, "Canh tác thông thường");

  const validacin = await prisma.medicine.upsert({
    where: { name: "Validacin 5SL" },
    update: {},
    create: {
      name: "Validacin 5SL",
      activeIngredient: "Validamycin",
      groupType: "CHEMICAL",
      concentration: "5%",
      unit: "ml/bình 16L",
      phiDays: 7,
      toxicityClass: "IV",
      manufacturer: "Việt Thắng",
    },
  });

  const tiltSuper = await prisma.medicine.upsert({
    where: { name: "Tilt Super 300EC" },
    update: {},
    create: {
      name: "Tilt Super 300EC",
      activeIngredient: "Propiconazole + Difenoconazole",
      groupType: "CHEMICAL",
      concentration: "300EC",
      unit: "ml/bình 16L",
      phiDays: 14,
      toxicityClass: "II",
      manufacturer: "Syngenta",
    },
  });

  const kasumin = await prisma.medicine.upsert({
    where: { name: "Kasumin 2SL" },
    update: {},
    create: {
      name: "Kasumin 2SL",
      activeIngredient: "Kasugamycin",
      groupType: "CHEMICAL",
      concentration: "2%",
      unit: "ml/bình 16L",
      phiDays: 7,
      toxicityClass: "III",
      manufacturer: "Hokko Chemical",
    },
  });

  const trichoderma = await prisma.medicine.upsert({
    where: { name: "Trichoderma BIO-F" },
    update: {},
    create: {
      name: "Trichoderma BIO-F",
      activeIngredient: "Nấm đối kháng Trichoderma spp.",
      groupType: "BIOLOGICAL",
      unit: "g/bình 16L",
      phiDays: 0,
      toxicityClass: "IV",
      manufacturer: "Viện Sinh học Nhiệt đới",
    },
  });

  const dauKhoang = await prisma.medicine.upsert({
    where: { name: "Dầu khoáng SK Enspray 99EC" },
    update: {},
    create: {
      name: "Dầu khoáng SK Enspray 99EC",
      activeIngredient: "Petroleum spray oil",
      groupType: "HERBAL",
      unit: "ml/bình 16L",
      phiDays: 3,
      toxicityClass: "IV",
      manufacturer: "Caltex",
    },
  });

  const movento = await prisma.medicine.upsert({
    where: { name: "Movento 150OD" },
    update: {},
    create: {
      name: "Movento 150OD",
      activeIngredient: "Spirotetramat",
      groupType: "CHEMICAL",
      concentration: "150OD",
      unit: "ml/bình 16L",
      phiDays: 14,
      toxicityClass: "III",
      manufacturer: "Bayer",
    },
  });

  async function createRemedy(opts: {
    name: string;
    plantId: string;
    diseaseId: string;
    status: "DRAFT" | "PUBLISHED" | "DISCONTINUED";
    usageInstructions: string;
    specialCaseIds: string[];
    items: { medicineId: string; dosageAmount: string; dosageUnit: string; mixOrder: number; usageNote?: string }[];
  }) {
    const existing = await prisma.remedy.findFirst({ where: { name: opts.name } });
    if (existing) return existing;
    return prisma.remedy.create({
      data: {
        name: opts.name,
        plantId: opts.plantId,
        diseaseId: opts.diseaseId,
        status: opts.status,
        usageInstructions: opts.usageInstructions,
        createdById: admin.id,
        specialCases: { create: opts.specialCaseIds.map((specialCaseId) => ({ specialCaseId })) },
        items: { create: opts.items },
      },
    });
  }

  await createRemedy({
    name: "Đạo ôn lúa - mới chớm",
    plantId: lua.id,
    diseaseId: daoOn.id,
    status: "PUBLISHED",
    usageInstructions: "Phun ướt đều tán lá vào sáng sớm hoặc chiều mát, phun lại sau 5-7 ngày nếu bệnh chưa dứt.",
    specialCaseIds: [caseMild.id],
    items: [{ medicineId: validacin.id, dosageAmount: "25", dosageUnit: "ml/bình 16L", mixOrder: 1 }],
  });

  await createRemedy({
    name: "Đạo ôn lúa - lan rộng",
    plantId: lua.id,
    diseaseId: daoOn.id,
    status: "PUBLISHED",
    usageInstructions: "Phối hợp 2 loại thuốc, phun kỹ 2 mặt lá và cổ bông. Ngừng phun trước thu hoạch tối thiểu 14 ngày.",
    specialCaseIds: [caseSevere.id],
    items: [
      { medicineId: tiltSuper.id, dosageAmount: "10", dosageUnit: "ml/bình 16L", mixOrder: 1 },
      { medicineId: validacin.id, dosageAmount: "25", dosageUnit: "ml/bình 16L", mixOrder: 2 },
    ],
  });

  await createRemedy({
    name: "Bạc lá lúa",
    plantId: lua.id,
    diseaseId: bacLa.id,
    status: "PUBLISHED",
    usageInstructions: "Phun khi phát hiện vết bệnh đầu tiên, tránh phun lúc trời mưa.",
    specialCaseIds: [],
    items: [{ medicineId: kasumin.id, dosageAmount: "20", dosageUnit: "ml/bình 16L", mixOrder: 1 }],
  });

  await createRemedy({
    name: "Sương mai cà chua - canh tác hữu cơ",
    plantId: caChua.id,
    diseaseId: suongMai.id,
    status: "PUBLISHED",
    usageInstructions: "Phun phòng định kỳ 7-10 ngày/lần, phù hợp vùng trồng theo hướng hữu cơ.",
    specialCaseIds: [caseOrganic.id],
    items: [{ medicineId: trichoderma.id, dosageAmount: "30", dosageUnit: "g/bình 16L", mixOrder: 1 }],
  });

  await createRemedy({
    name: "Sương mai cà chua - thông thường",
    plantId: caChua.id,
    diseaseId: suongMai.id,
    status: "PUBLISHED",
    usageInstructions: "Phun khi bệnh chớm xuất hiện, cách ly đủ 14 ngày trước khi thu hoạch.",
    specialCaseIds: [],
    items: [{ medicineId: tiltSuper.id, dosageAmount: "15", dosageUnit: "ml/bình 16L", mixOrder: 1 }],
  });

  await createRemedy({
    name: "Sâu vẽ bùa trên cam - cây con",
    plantId: cam.id,
    diseaseId: sauVeBua.id,
    status: "PUBLISHED",
    usageInstructions: "Ưu tiên dầu khoáng cho cây con để hạn chế ảnh hưởng thiên địch, phun ướt đều mặt dưới lá non.",
    specialCaseIds: [caseYoung.id],
    items: [{ medicineId: dauKhoang.id, dosageAmount: "80", dosageUnit: "ml/bình 16L", mixOrder: 1 }],
  });

  await createRemedy({
    name: "Sâu vẽ bùa trên cam - tổng quát (nháp)",
    plantId: cam.id,
    diseaseId: sauVeBua.id,
    status: "DRAFT",
    usageInstructions: "Bản nháp - cần rà soát liều lượng trước khi xuất bản.",
    specialCaseIds: [],
    items: [{ medicineId: movento.id, dosageAmount: "10", dosageUnit: "ml/bình 16L", mixOrder: 1 }],
  });

  console.log("Seed hoàn tất.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
