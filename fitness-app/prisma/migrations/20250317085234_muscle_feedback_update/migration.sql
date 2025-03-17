/*
  Warnings:

  - You are about to drop the column `exerciseId` on the `MuscleFeedback` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `MuscleFeedback` table. All the data in the column will be lost.
  - Added the required column `jointpain` to the `MuscleFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `soreness` to the `MuscleFeedback` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workload` to the `MuscleFeedback` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MuscleFeedback" DROP COLUMN "exerciseId",
DROP COLUMN "rating",
ADD COLUMN     "jointpain" INTEGER NOT NULL,
ADD COLUMN     "soreness" INTEGER NOT NULL,
ADD COLUMN     "workload" INTEGER NOT NULL;
