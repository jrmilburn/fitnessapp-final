/*
  Warnings:

  - You are about to drop the column `autoRegulated` on the `Program` table. All the data in the column will be lost.
  - You are about to drop the `MuscleFeedback` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MuscleFeedback" DROP CONSTRAINT "MuscleFeedback_workoutId_fkey";

-- AlterTable
ALTER TABLE "Program" DROP COLUMN "autoRegulated";

-- DropTable
DROP TABLE "MuscleFeedback";
