/*
  Warnings:

  - Made the column `summary` on table `AcademyModule` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "AcademyModule" ADD COLUMN     "category" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "lecture" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "workbookPrompt" TEXT NOT NULL DEFAULT '',
ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "summary" SET NOT NULL,
ALTER COLUMN "summary" SET DEFAULT '';
