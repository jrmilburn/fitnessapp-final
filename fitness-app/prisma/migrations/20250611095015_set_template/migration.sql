-- CreateTable
CREATE TABLE "SetTemplate" (
    "id" TEXT NOT NULL,
    "reps" INTEGER,
    "weight" INTEGER,
    "exerciseSlotId" TEXT NOT NULL,

    CONSTRAINT "SetTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SetTemplate" ADD CONSTRAINT "SetTemplate_exerciseSlotId_fkey" FOREIGN KEY ("exerciseSlotId") REFERENCES "ExerciseSlot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
