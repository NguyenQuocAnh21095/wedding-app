-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'STAFF');

-- CreateEnum
CREATE TYPE "DiseaseAgentType" AS ENUM ('FUNGUS', 'BACTERIA', 'VIRUS', 'PEST', 'NEMATODE', 'NUTRIENT_DEFICIENCY', 'OTHER');

-- CreateEnum
CREATE TYPE "MedicineGroup" AS ENUM ('CHEMICAL', 'BIOLOGICAL', 'HERBAL');

-- CreateEnum
CREATE TYPE "ToxicityClass" AS ENUM ('I', 'II', 'III', 'IV');

-- CreateEnum
CREATE TYPE "RemedyStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'DISCONTINUED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'STAFF',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "scientificName" TEXT,
    "groupName" TEXT,
    "growthStages" TEXT[],
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Disease" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "agentType" "DiseaseAgentType" NOT NULL DEFAULT 'OTHER',
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Disease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlantDisease" (
    "id" TEXT NOT NULL,
    "plantId" TEXT NOT NULL,
    "diseaseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlantDisease_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialCaseGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "exclusive" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpecialCaseGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialCase" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SpecialCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "activeIngredient" TEXT,
    "groupType" "MedicineGroup" NOT NULL DEFAULT 'CHEMICAL',
    "concentration" TEXT,
    "unit" TEXT,
    "phiDays" INTEGER,
    "toxicityClass" "ToxicityClass",
    "manufacturer" TEXT,
    "referencePrice" TEXT,
    "isDiscontinued" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Remedy" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "plantId" TEXT NOT NULL,
    "diseaseId" TEXT NOT NULL,
    "status" "RemedyStatus" NOT NULL DEFAULT 'DRAFT',
    "usageInstructions" TEXT,
    "notes" TEXT,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Remedy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RemedySpecialCase" (
    "id" TEXT NOT NULL,
    "remedyId" TEXT NOT NULL,
    "specialCaseId" TEXT NOT NULL,

    CONSTRAINT "RemedySpecialCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RemedyItem" (
    "id" TEXT NOT NULL,
    "remedyId" TEXT NOT NULL,
    "medicineId" TEXT NOT NULL,
    "dosageAmount" TEXT NOT NULL,
    "dosageUnit" TEXT NOT NULL,
    "mixOrder" INTEGER NOT NULL DEFAULT 0,
    "usageNote" TEXT,

    CONSTRAINT "RemedyItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Plant_name_key" ON "Plant"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Disease_name_key" ON "Disease"("name");

-- CreateIndex
CREATE UNIQUE INDEX "PlantDisease_plantId_diseaseId_key" ON "PlantDisease"("plantId", "diseaseId");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialCaseGroup_name_key" ON "SpecialCaseGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SpecialCase_groupId_name_key" ON "SpecialCase"("groupId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_name_key" ON "Medicine"("name");

-- CreateIndex
CREATE INDEX "Remedy_plantId_diseaseId_idx" ON "Remedy"("plantId", "diseaseId");

-- CreateIndex
CREATE UNIQUE INDEX "RemedySpecialCase_remedyId_specialCaseId_key" ON "RemedySpecialCase"("remedyId", "specialCaseId");

-- AddForeignKey
ALTER TABLE "PlantDisease" ADD CONSTRAINT "PlantDisease_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlantDisease" ADD CONSTRAINT "PlantDisease_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "Disease"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialCase" ADD CONSTRAINT "SpecialCase_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "SpecialCaseGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Remedy" ADD CONSTRAINT "Remedy_plantId_fkey" FOREIGN KEY ("plantId") REFERENCES "Plant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Remedy" ADD CONSTRAINT "Remedy_diseaseId_fkey" FOREIGN KEY ("diseaseId") REFERENCES "Disease"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Remedy" ADD CONSTRAINT "Remedy_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RemedySpecialCase" ADD CONSTRAINT "RemedySpecialCase_remedyId_fkey" FOREIGN KEY ("remedyId") REFERENCES "Remedy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RemedySpecialCase" ADD CONSTRAINT "RemedySpecialCase_specialCaseId_fkey" FOREIGN KEY ("specialCaseId") REFERENCES "SpecialCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RemedyItem" ADD CONSTRAINT "RemedyItem_remedyId_fkey" FOREIGN KEY ("remedyId") REFERENCES "Remedy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RemedyItem" ADD CONSTRAINT "RemedyItem_medicineId_fkey" FOREIGN KEY ("medicineId") REFERENCES "Medicine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
