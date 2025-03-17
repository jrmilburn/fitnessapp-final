-- CreateTable
CREATE TABLE "MuscleFeedback" (
    "id" TEXT NOT NULL,
    "workoutId" TEXT NOT NULL,
    "muscle" TEXT NOT NULL,
    "exerciseId" TEXT,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MuscleFeedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MuscleFeedback" ADD CONSTRAINT "MuscleFeedback_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
