import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import BarChart from "../../../components/analytics/BarChart";
// Import redirect from next/navigation
import { redirect } from "next/navigation";

export default async function ExerciseAnalytics() {
  // Authenticate and load the current user
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return <div>Not authenticated</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user || !user.currentProgramId) {
    return <div>User or current program not found</div>;
  }

  // Retrieve program data including weeks, workouts, and exercises
  const programData = await prisma.program.findUnique({
    where: { id: user.currentProgramId },
    select: {
      weeks: {
        select: {
          workouts: {
            select: {
              exercises: {
                select: {
                  muscle: true,
                  sets: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // Redirect to '/new' if programData is not available
  if (!programData) {
    redirect("/new");
  }

  // Aggregate completed sets for each muscle group per week.
  const muscleGroupData = {};
  const weeks = programData.weeks;
  const totalWeeks = weeks.length;

  weeks.forEach((week, weekIndex) => {
    week.workouts.forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        const muscle = exercise.muscle;
        // Count completed sets for this exercise
        const completedCount = exercise.sets.filter((set) => set.complete).length;
        if (!muscleGroupData[muscle]) {
          // Initialize an array of zeros, one entry per week
          muscleGroupData[muscle] = new Array(totalWeeks).fill(0);
        }
        muscleGroupData[muscle][weekIndex] += completedCount;
      });
    });
  });

  // Create week labels (e.g., "Week 1", "Week 2", ...)
  const weekLabels = weeks.map((_, i) => `Week ${i + 1}`);

  // Sort the muscle groups alphabetically (optional)
  const sortedMuscles = Object.keys(muscleGroupData).sort();

  return (
    <div className="flex flex-col justify-center items-center p-4">
      <div className="w-full flex flex-col justify-center items-center">
          <BarChart
            chartData={muscleGroupData}
          />
      </div>
    </div>
  );
}
