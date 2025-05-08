/*
  Warnings:

  - You are about to drop the column `muscle` on the `ExerciseTemplate` table. All the data in the column will be lost.
  - Added the required column `muscleGroupId` to the `ExerciseTemplate` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ExerciseTemplate" DROP COLUMN "muscle",
ADD COLUMN     "muscleGroupId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "MuscleGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "recoveryFactor" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MuscleGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MuscleGroup_name_key" ON "MuscleGroup"("name");

-- CreateIndex
CREATE INDEX "ExerciseTemplate_muscleGroupId_idx" ON "ExerciseTemplate"("muscleGroupId");

-- AddForeignKey
ALTER TABLE "ExerciseTemplate" ADD CONSTRAINT "ExerciseTemplate_muscleGroupId_fkey" FOREIGN KEY ("muscleGroupId") REFERENCES "MuscleGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
