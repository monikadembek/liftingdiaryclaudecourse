"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

export async function createWorkoutAction(name: string, date: string) {
  const { name: validatedName, date: validatedDate } = createWorkoutSchema.parse({ name, date });
  const workout = await createWorkout(validatedName, validatedDate);
  redirect(`/dashboard?date=${validatedDate}`);
}
