-- CreateTable
CREATE TABLE "PinterestBoard" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "visibility" TEXT NOT NULL DEFAULT 'private',
    "pinterestUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PinterestBoard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PinterestBoard_userId_idx" ON "PinterestBoard"("userId");

-- AddForeignKey
ALTER TABLE "PinterestBoard" ADD CONSTRAINT "PinterestBoard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
