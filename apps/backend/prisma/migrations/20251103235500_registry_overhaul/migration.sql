-- AlterEnum
BEGIN;
CREATE TYPE "RegistrySource_new" AS ENUM ('macro', 'silvercross', 'awin', 'cj', 'myregistry', 'babylist', 'impact', 'static');
ALTER TABLE "public"."RegistryItem" ALTER COLUMN "source" DROP DEFAULT;
ALTER TABLE "RegistryItem" ALTER COLUMN "source" TYPE "RegistrySource_new" USING ("source"::text::"RegistrySource_new");
ALTER TYPE "RegistrySource" RENAME TO "RegistrySource_old";
ALTER TYPE "RegistrySource_new" RENAME TO "RegistrySource";
DROP TYPE "public"."RegistrySource_old";
ALTER TABLE "RegistryItem" ALTER COLUMN "source" SET DEFAULT 'myregistry';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."RegistryEntry" DROP CONSTRAINT "RegistryEntry_itemId_fkey";

-- DropForeignKey
ALTER TABLE "public"."RegistryEntry" DROP CONSTRAINT "RegistryEntry_userId_fkey";

-- AlterTable
ALTER TABLE "RegistryItem" ADD COLUMN     "affiliateId" TEXT,
ADD COLUMN     "affiliateUrl" TEXT,
ADD COLUMN     "externalId" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "importedFrom" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "retailer" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
ALTER COLUMN "source" SET DEFAULT 'myregistry';

-- DropTable
DROP TABLE "public"."RegistryEntry";

-- CreateTable
CREATE TABLE "RegistryNote" (
    "id" TEXT NOT NULL,
    "registryItemId" TEXT NOT NULL,
    "mentorId" TEXT,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistryNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegistryCatalogItem" (
    "id" TEXT NOT NULL,
    "externalId" TEXT,
    "title" TEXT NOT NULL,
    "brand" TEXT,
    "retailer" TEXT,
    "category" TEXT,
    "price" DECIMAL(10,2),
    "image" TEXT,
    "url" TEXT,
    "affiliateUrl" TEXT,
    "source" "RegistrySource" NOT NULL DEFAULT 'myregistry',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegistryCatalogItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RegistryNote_registryItemId_mentorId_key" ON "RegistryNote"("registryItemId", "mentorId");

-- CreateIndex
CREATE UNIQUE INDEX "RegistryItem_externalId_userId_key" ON "RegistryItem"("externalId", "userId");

-- AddForeignKey
ALTER TABLE "RegistryItem" ADD CONSTRAINT "RegistryItem_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistryNote" ADD CONSTRAINT "RegistryNote_registryItemId_fkey" FOREIGN KEY ("registryItemId") REFERENCES "RegistryItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistryNote" ADD CONSTRAINT "RegistryNote_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
