/*
  Warnings:

  - You are about to drop the column `comment` on the `MuscleFeedback` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MuscleFeedback" DROP COLUMN "comment";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "fatigue" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "nextWorkoutId" TEXT,
ADD COLUMN     "previousWorkoutId" TEXT;
