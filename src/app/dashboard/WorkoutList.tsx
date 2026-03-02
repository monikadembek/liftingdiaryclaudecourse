"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { format, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type Set = {
  id: number;
  setNumber: number;
  reps: number | null;
  weight: string | null;
};

type WorkoutExercise = {
  id: number;
  order: number;
  exercise: { id: number; name: string };
  sets: Set[];
};

type Workout = {
  id: number;
  userId: string;
  date: string;
  name: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  workoutExercises: WorkoutExercise[];
};

export function WorkoutList({
  workouts,
  selectedDate,
}: {
  workouts: Workout[];
  selectedDate: string;
}) {
  const router = useRouter();
  const date = parseISO(selectedDate);

  function handleDateSelect(d: Date | undefined) {
    if (!d) return;
    router.replace(`?date=${format(d, "yyyy-MM-dd")}`);
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-muted-foreground">Date</span>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-48 justify-start gap-2">
              <CalendarIcon className="h-4 w-4" />
              {format(date, "do MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            Workouts for {format(date, "do MMM yyyy")}
          </h2>
          <Button asChild>
            <Link href={`/dashboard/workout/new?date=${selectedDate}`}>
              Log New Workout
            </Link>
          </Button>
        </div>

        {workouts.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No workouts logged for this date.
          </p>
        ) : (
          workouts.map((workout) => (
            <Link key={workout.id} href={`/dashboard/workout/${workout.id}`}>
              <Card className="hover:bg-accent transition-colors cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">
                    {workout.name ?? "Untitled Workout"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {workout.workoutExercises.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No exercises logged.</p>
                  ) : (
                    <div className="space-y-3">
                      {workout.workoutExercises.map((we) => (
                        <div key={we.id}>
                          <p className="text-sm font-medium">{we.exercise.name}</p>
                          {we.sets.length > 0 && (
                            <div className="mt-1 space-y-0.5">
                              {we.sets.map((set) => (
                                <p key={set.id} className="text-sm text-muted-foreground">
                                  Set {set.setNumber}
                                  {set.reps != null ? ` · ${set.reps} reps` : ""}
                                  {set.weight != null ? ` · ${set.weight} kg` : ""}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </>
  );
}
