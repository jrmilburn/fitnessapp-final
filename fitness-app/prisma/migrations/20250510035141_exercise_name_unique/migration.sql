/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ExerciseTemplate` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ExerciseTemplate_name_key" ON "ExerciseTemplate"("name");
