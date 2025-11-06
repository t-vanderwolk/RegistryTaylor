-- DropForeignKey
ALTER TABLE "public"."AcademyProgress" DROP CONSTRAINT "AcademyProgress_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "public"."AcademyProgress" DROP CONSTRAINT "AcademyProgress_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Announcement" DROP CONSTRAINT "Announcement_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comment" DROP CONSTRAINT "Comment_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."CommunityPost" DROP CONSTRAINT "CommunityPost_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Event" DROP CONSTRAINT "Event_createdById_fkey";

-- DropForeignKey
ALTER TABLE "public"."EventRsvp" DROP CONSTRAINT "EventRsvp_eventId_fkey";

-- DropForeignKey
ALTER TABLE "public"."EventRsvp" DROP CONSTRAINT "EventRsvp_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Message" DROP CONSTRAINT "Message_senderId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Profile" DROP CONSTRAINT "Profile_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Questionnaire" DROP CONSTRAINT "Questionnaire_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkbookEntry" DROP CONSTRAINT "WorkbookEntry_memberId_fkey";

-- DropForeignKey
ALTER TABLE "public"."WorkbookEntry" DROP CONSTRAINT "WorkbookEntry_moduleSlug_fkey";

-- AlterTable
ALTER TABLE "AcademyModule" ADD COLUMN     "subtitle" TEXT,
ALTER COLUMN "summary" DROP NOT NULL,
ALTER COLUMN "summary" DROP DEFAULT,
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "category" DROP DEFAULT,
ALTER COLUMN "lecture" DROP NOT NULL,
ALTER COLUMN "lecture" DROP DEFAULT,
ALTER COLUMN "order" DROP NOT NULL,
ALTER COLUMN "order" DROP DEFAULT,
ALTER COLUMN "workbookPrompt" DROP NOT NULL,
ALTER COLUMN "workbookPrompt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "AcademyProgress" ADD COLUMN     "completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "quizScore" INTEGER,
ADD COLUMN     "reflection" TEXT;

-- CreateTable
CREATE TABLE "Quiz" (
    "id" SERIAL NOT NULL,
    "moduleId" TEXT NOT NULL,
    "userId" TEXT,
    "question" TEXT NOT NULL,
    "options" TEXT[],
    "answer" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Quiz_moduleId_idx" ON "Quiz"("moduleId");

-- CreateIndex
CREATE INDEX "Quiz_userId_idx" ON "Quiz"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_moduleId_question_key" ON "Quiz"("moduleId", "question");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Questionnaire" ADD CONSTRAINT "Questionnaire_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademyProgress" ADD CONSTRAINT "AcademyProgress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "AcademyModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcademyProgress" ADD CONSTRAINT "AcademyProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "AcademyModule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommunityPost" ADD CONSTRAINT "CommunityPost_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRsvp" ADD CONSTRAINT "EventRsvp_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRsvp" ADD CONSTRAINT "EventRsvp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkbookEntry" ADD CONSTRAINT "WorkbookEntry_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkbookEntry" ADD CONSTRAINT "WorkbookEntry_moduleSlug_fkey" FOREIGN KEY ("moduleSlug") REFERENCES "AcademyModule"("slug") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Announcement" ADD CONSTRAINT "Announcement_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
