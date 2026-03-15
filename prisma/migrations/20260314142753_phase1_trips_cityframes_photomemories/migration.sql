-- AlterTable
ALTER TABLE "Story" ADD COLUMN     "closingReflection" TEXT,
ADD COLUMN     "coordinates" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "tripId" TEXT;

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CityFrame" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CityFrame_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhotoMemory" (
    "id" TEXT NOT NULL,
    "storyId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "PhotoMemory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Trip_slug_key" ON "Trip"("slug");

-- CreateIndex
CREATE INDEX "CityFrame_storyId_order_idx" ON "CityFrame"("storyId", "order");

-- CreateIndex
CREATE INDEX "PhotoMemory_storyId_order_idx" ON "PhotoMemory"("storyId", "order");

-- AddForeignKey
ALTER TABLE "Story" ADD CONSTRAINT "Story_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CityFrame" ADD CONSTRAINT "CityFrame_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhotoMemory" ADD CONSTRAINT "PhotoMemory_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "Story"("id") ON DELETE CASCADE ON UPDATE CASCADE;
