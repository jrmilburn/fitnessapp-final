-- CreateTable
CREATE TABLE "ProgramTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "goal" TEXT,
    "length" INTEGER NOT NULL,
    "daysPerWeek" INTEGER NOT NULL,
    "comments" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProgramTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeekTemplate" (
    "id" TEXT NOT NULL,
    "weekNo" INTEGER NOT NULL,
    "programTemplateId" TEXT NOT NULL,

    CONSTRAINT "WeekTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutTemplate" (
    "id" TEXT NOT NULL,
    "dayNo" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "weekTemplateId" TEXT NOT NULL,

    CONSTRAINT "WorkoutTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseSlot" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "targetSets" INTEGER NOT NULL,
    "templateId" TEXT NOT NULL,
    "workoutTemplateId" TEXT NOT NULL,

    CONSTRAINT "ExerciseSlot_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProgramTemplate" ADD CONSTRAINT "ProgramTemplate_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeekTemplate" ADD CONSTRAINT "WeekTemplate_programTemplateId_fkey" FOREIGN KEY ("programTemplateId") REFERENCES "ProgramTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutTemplate" ADD CONSTRAINT "WorkoutTemplate_weekTemplateId_fkey" FOREIGN KEY ("weekTemplateId") REFERENCES "WeekTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseSlot" ADD CONSTRAINT "ExerciseSlot_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "ExerciseTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExerciseSlot" ADD CONSTRAINT "ExerciseSlot_workoutTemplateId_fkey" FOREIGN KEY ("workoutTemplateId") REFERENCES "WorkoutTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
