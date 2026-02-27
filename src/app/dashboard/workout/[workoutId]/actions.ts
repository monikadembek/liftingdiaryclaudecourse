"use server";

import { z } from "zod";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().min(1, "Name is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export async function updateWorkoutAction(workoutId: number, name: string, date: string) {
  const validated = updateWorkoutSchema.parse({ workoutId, name, date });
  await updateWorkout(validated.workoutId, validated.name, validated.date);
}
