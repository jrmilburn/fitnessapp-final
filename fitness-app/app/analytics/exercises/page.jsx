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
    <div className="max-w-[calc(100% - 16rem)] ml-64 min-h-screen flex flex-col gap-4 justify-start items-center p-4">
      <div className="max-w-2xl w-full flex flex-col gap-4">
        <h6 className="mb-8 text-center text-xl font-bold">Weekly Set Volumes</h6>
        {sortedMuscles.map((muscle) => (
          <BarChart
            key={muscle}
            chartData={{
              labels: weekLabels,
              datasets: [
                {
                  label: `${muscle} Completed Sets`,
                  data: muscleGroupData[muscle],
                  backgroundColor: "rgba(75, 192, 192, 0.6)",
                  barPercentage: 0.5,
                  categoryPercentage: 0.5,
                },
              ],
            }}
            muscle={muscle}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: { display: false },
              },
              scales: {
                y: {
                  min: 0,
                  suggestedMax: 10,
                  ticks: { stepSize: 2 },
                },
                x: {
                  ticks: { display: true },
                  grid: { display: true },
                },
              },
            }}
          />
        ))}
      </div>
    </div>
  );
}
