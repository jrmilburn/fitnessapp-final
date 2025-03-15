import { prisma } from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import BarChart from "../../../components/analytics/BarChart";

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

  // Aggregate completed sets for each muscle group per week.
  // The final structure is: { muscle: [week1Count, week2Count, ...] }
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
    <div className="max-w-[calc(100% - 16rem)] ml-64 min-h-screen flex flex-col gap-4 justify-start items-center p-4 relative">
      <div className="max-w-2xl mx-auto w-full max-h-screen flex flex-col">
        <h6 className="mb-8">Weekly Set Volumes</h6>
        {sortedMuscles.map((muscle, index) => (
          <div key={muscle} className="w-full">
            <BarChart
              chartData={{
                labels: weekLabels,
                datasets: [
                  {
                    label: `${muscle} Completed Sets`,
                    data: muscleGroupData[muscle],
                    backgroundColor: "rgba(75, 192, 192, 0.6)",
                    barPercentage: 0.5,         // Adjust this value to make the bars narrower
                    categoryPercentage: 0.5,      // Adjust this value to further control bar width
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
                    suggestedMax: 20,
                    ticks: {
                      stepSize: 10,
                    },
                  },
                  x: {
                    ticks: { display: index === sortedMuscles.length - 1 },
                    grid: { display: true },
                  },
                },
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
