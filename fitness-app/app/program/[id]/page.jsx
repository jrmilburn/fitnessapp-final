import { prisma } from "../../../lib/prisma";
import WorkoutView from "../../../components/program/WorkoutView";

export default async function ProgramView({ params }) {
  // No need to await params; it's already available as an object
  const { id } = params;

  const program = await prisma.program.findUnique({
    where: {
      id: id, // Convert to Number if your schema requires it (e.g., Number(id))
    },
    include: {
      weeks: {
        include: {
          workouts: {
            include: {
              exercises: {
                include: {
                  sets: true,
                },
              },
            },
          },
        },
      },
    },
  });

  console.log(program);

  return (
    <>
      {program && (
        <WorkoutView 
          initProgram={program} // Pass the program object directly
        />
      )}
    </>
  );
}
