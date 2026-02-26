import { format } from "date-fns";
import { getWorkoutsForDate } from "@/data/workouts";
import { WorkoutList } from "./WorkoutList";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;
  const selectedDate = date ?? format(new Date(), "yyyy-MM-dd");
  const workouts = await getWorkoutsForDate(selectedDate);

  return (
    <div className="container mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <WorkoutList workouts={workouts} selectedDate={selectedDate} />
    </div>
  );
}
