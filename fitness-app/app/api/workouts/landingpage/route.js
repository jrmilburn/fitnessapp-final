// app/api/program/workouts/route.js  (App Router – JavaScript)
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

/*─────────────────────────────────────────────────────────────
  1 ▸  ALLOW-LIST every origin that may call this endpoint
──────────────────────────────────────────────────────────────*/
const allowed = new Set([
  "http://localhost:3000",
  "https://joemilburn.com.au",
]);

function cors(origin) {
  /* If caller is allowed, echo it back; otherwise omit the header.
     We can keep Credentials=true in case you later add cookies.   */
  return {
    ...(allowed.has(origin) && { "Access-Control-Allow-Origin": origin }),
    "Access-Control-Allow-Methods": "GET,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
  };
}

/*─────────────────────────────────────────────────────────────
  2 ▸  CORS pre-flight
──────────────────────────────────────────────────────────────*/
export function OPTIONS(req) {
  const origin = req.headers.get("origin") ?? "";
  return NextResponse.json({}, { headers: cors(origin) });
}

/*─────────────────────────────────────────────────────────────
  3 ▸  Actual data route  (no authentication)
──────────────────────────────────────────────────────────────*/
export async function GET(req) {
  const origin = req.headers.get("origin") ?? "";

  /* — existing Prisma look-ups — */
  const user = await prisma.user.findUnique({
    where: { email: "jrmilburn@outlook.com" },
    select: { currentProgramId: true },
  });
  if (!user?.currentProgramId) {
    return NextResponse.json(
      { error: "No current program" },
      { status: 404, headers: cors(origin) }
    );
  }

  const program = await prisma.program.findUnique({
    where: { id: user.currentProgramId },
    include: {
      weeks: {
        orderBy: { weekNo: "asc" },
        include: {
          workouts: {
            orderBy: { workoutNo: "asc" },
            include: {
              exercises: { include: { sets: { select: { complete: true } } } },
            },
          },
        },
      },
    },
  });
  if (!program) {
    return NextResponse.json(
      { error: "Program not found" },
      { status: 404, headers: cors(origin) }
    );
  }

  /* — derive numbers to send — */
  const workoutIsComplete = (wk) =>
    wk.exercises.every(
      (ex) => ex.sets.length && ex.sets.every((s) => s.complete)
    );

  let currentWeek = program.weeks.find(
    (w) => !w.workouts.every(workoutIsComplete)
  );
  if (!currentWeek) currentWeek = program.weeks.at(-1);

  const totalWorkouts     = currentWeek.workouts.length;
  const completedWorkouts = currentWeek.workouts.filter(workoutIsComplete).length;
  const workoutsLeft      = totalWorkouts - completedWorkouts;
  const nextWorkoutTitle  =
    currentWeek.workouts.find((w) => !workoutIsComplete(w))?.name ?? null;

  /* — send the payload with CORS headers — */
  return NextResponse.json(
    {
      weekNo: currentWeek.weekNo,
      completedWorkouts,
      totalWorkouts,
      workoutsLeft,
      nextWorkoutTitle,
    },
    { headers: cors(origin) }
  );
}
