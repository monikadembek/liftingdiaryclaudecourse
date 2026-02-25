"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const mockWorkouts = [
  {
    id: 1,
    name: "Bench Press",
    sets: 4,
    reps: 8,
    weight: 80,
    date: new Date(2026, 1, 25),
  },
  {
    id: 2,
    name: "Squat",
    sets: 3,
    reps: 5,
    weight: 120,
    date: new Date(2026, 1, 25),
  },
  {
    id: 3,
    name: "Deadlift",
    sets: 3,
    reps: 5,
    weight: 140,
    date: new Date(2026, 1, 25),
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date(2026, 1, 25));

  const workoutsForDate = mockWorkouts.filter(
    (w) => format(w.date, "do MMM yyyy") === format(date, "do MMM yyyy")
  );

  return (
    <div className="container mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

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
              onSelect={(d) => d && setDate(d)}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          Workouts for {format(date, "do MMM yyyy")}
        </h2>

        {workoutsForDate.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No workouts logged for this date.
          </p>
        ) : (
          workoutsForDate.map((workout) => (
            <Card key={workout.id}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{workout.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {workout.sets} sets &times; {workout.reps} reps &mdash;{" "}
                  {workout.weight} kg
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
