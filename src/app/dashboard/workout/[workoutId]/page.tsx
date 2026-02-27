import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { getWorkoutById } from "@/data/workouts";
import { EditWorkoutForm } from "./EditWorkoutForm";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { workoutId } = await params;
  const id = parseInt(workoutId, 10);
  if (isNaN(id)) notFound();

  const workout = await getWorkoutById(id);
  if (!workout) notFound();

  return (
    <div className="container mx-auto max-w-lg p-6 space-y-6">
      <h1 className="text-2xl font-bold">Edit workout</h1>
      <EditWorkoutForm
        workoutId={workout.id}
        defaultName={workout.name ?? ""}
        defaultDate={workout.date}
      />
    </div>
  );
}
