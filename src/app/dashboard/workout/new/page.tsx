import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { NewWorkoutForm } from "./NewWorkoutForm";

export default async function NewWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/");

  const { date } = await searchParams;
  const defaultDate = date ?? format(new Date(), "yyyy-MM-dd");

  return (
    <div className="container mx-auto max-w-lg p-6 space-y-6">
      <h1 className="text-2xl font-bold">New workout</h1>
      <NewWorkoutForm defaultDate={defaultDate} />
    </div>
  );
}
