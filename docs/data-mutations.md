# Data Mutations

## Helper Functions in `/data`

**ALL data mutations MUST go through helper functions located in the `src/data` directory.**

These helpers wrap Drizzle ORM calls and are the only permitted way to write to the database.

### Rules

1. **Use Drizzle ORM — never raw SQL.** All mutations must use the Drizzle query builder. Raw SQL strings (e.g., `db.execute(sql\`...\`)`) are forbidden.

2. **Always scope mutations to the authenticated user.** Every mutation MUST verify the currently authenticated user's ID and apply it. A logged-in user must NEVER be able to mutate another user's data.

### Example

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function createWorkout(name: string, date: Date) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");

  return db.insert(workouts).values({
    userId: session.user.id,
    name,
    date,
  });
}

export async function deleteWorkout(workoutId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");

  return db
    .delete(workouts)
    .where(eq(workouts.id, workoutId) && eq(workouts.userId, session.user.id));
}
```

---

## Server Actions

**ALL data mutations MUST be triggered via Next.js Server Actions.**

### Location

Server actions MUST live in colocated `actions.ts` files, placed alongside the page or component that uses them.

```
src/app/workouts/
  page.tsx
  actions.ts        ✅ colocated server actions
```

Do NOT place server actions in a global `lib/actions.ts` or similar shared file.

### Typed Parameters — No `FormData`

- All server action parameters MUST be explicitly typed using TypeScript types or interfaces.
- `FormData` MUST NOT be used as a parameter type.

```ts
// ✅ Correct
export async function createWorkout(name: string, date: Date) { ... }

// ❌ Wrong — FormData is forbidden
export async function createWorkout(formData: FormData) { ... }
```

### No Redirects Inside Server Actions

**`redirect()` MUST NOT be called inside server actions.** Redirects must be handled client-side after the server action resolves.

```ts
// ❌ Wrong — redirect() inside a server action is forbidden
export async function createWorkoutAction(name: string, date: Date) {
  const validated = createWorkoutSchema.parse({ name, date });
  await createWorkout(validated.name, validated.date);
  redirect("/workouts"); // forbidden
}

// ✅ Correct — redirect client-side after the action resolves
// In your client component:
async function handleSubmit() {
  await createWorkoutAction(name, date);
  router.push("/workouts");
}
```

### Validation with Zod

**ALL server actions MUST validate their arguments using Zod before executing any logic.**

Define a Zod schema for each action's inputs and parse the arguments at the top of the function body.

```ts
// src/app/workouts/actions.ts
"use server";

import { z } from "zod";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1),
  date: z.date(),
});

export async function createWorkoutAction(name: string, date: Date) {
  const { name: validatedName, date: validatedDate } = createWorkoutSchema.parse({ name, date });
  await createWorkout(validatedName, validatedDate);
}
```

---

## Full Example

```ts
// src/app/workouts/actions.ts
"use server";

import { z } from "zod";
import { createWorkout, deleteWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1, "Name is required"),
  date: z.date(),
});

const deleteWorkoutSchema = z.object({
  workoutId: z.string().uuid(),
});

export async function createWorkoutAction(name: string, date: Date) {
  const validated = createWorkoutSchema.parse({ name, date });
  await createWorkout(validated.name, validated.date);
}

export async function deleteWorkoutAction(workoutId: string) {
  const validated = deleteWorkoutSchema.parse({ workoutId });
  await deleteWorkout(validated.workoutId);
}
```

```ts
// src/data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function createWorkout(name: string, date: Date) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");

  return db.insert(workouts).values({
    userId: session.user.id,
    name,
    date,
  });
}

export async function deleteWorkout(workoutId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");

  return db
    .delete(workouts)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, session.user.id)));
}
```

---

## Checklist for every new mutation

- [ ] Database write is implemented as a helper function inside `src/data/`
- [ ] Helper uses Drizzle ORM (no raw SQL)
- [ ] Helper retrieves the authenticated user's ID and scopes the mutation to that user
- [ ] Server action lives in a colocated `actions.ts` file
- [ ] Server action parameters are explicitly typed — no `FormData`
- [ ] Server action validates all arguments with Zod before any logic runs
- [ ] Server action calls the `src/data/` helper — it does NOT call Drizzle directly
- [ ] Server action does NOT call `redirect()` — redirects are handled client-side after the action resolves
