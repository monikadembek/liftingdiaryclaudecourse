import { db } from "@/db";
import { workouts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function createWorkout(name: string, date: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  const result = await db.insert(workouts).values({
    userId,
    name,
    date,
  }).returning({ id: workouts.id });

  return result[0];
}

export async function getWorkoutsForDate(date: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthenticated");

  return db.query.workouts.findMany({
    where: and(eq(workouts.userId, userId), eq(workouts.date, date)),
    with: {
      workoutExercises: {
        with: {
          exercise: true,
          sets: {
            orderBy: (sets, { asc }) => [asc(sets.setNumber)],
          },
        },
        orderBy: (workoutExercises, { asc }) => [asc(workoutExercises.order)],
      },
    },
  });
}
