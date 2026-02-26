# Data Fetching

## CRITICAL: Server Components Only

**ALL data fetching in this application MUST be done exclusively via React Server Components.**

The following approaches are strictly **FORBIDDEN**:
- Fetching data in Client Components (components with `"use client"`)
- Fetching data via Route Handlers (e.g., `app/api/*/route.ts`)
- Fetching data via `useEffect` + `fetch`
- Any other data fetching mechanism outside of Server Components

If you need data in a Client Component, fetch it in a Server Component parent and pass it down as props.

## Database Queries

All database queries MUST go through helper functions located in the `/data` directory.

### Rules

1. **Use Drizzle ORM — never raw SQL.** All queries must use the Drizzle query builder or Drizzle's relational query API. Raw SQL strings (e.g., `db.execute(sql\`...\`)`) are forbidden.

2. **Always scope data to the authenticated user.** Every query that returns user data MUST filter by the currently authenticated user's ID. A logged-in user must NEVER be able to access another user's data.

### Example structure

```ts
// data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function getWorkoutsForCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthenticated");

  return db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, session.user.id));
}
```

```tsx
// app/dashboard/page.tsx  (Server Component)
import { getWorkoutsForCurrentUser } from "@/data/workouts";

export default async function DashboardPage() {
  const workouts = await getWorkoutsForCurrentUser();
  return <WorkoutList workouts={workouts} />;
}
```

### Checklist for every new data helper

- [ ] Lives inside `/data`
- [ ] Uses Drizzle ORM (no raw SQL)
- [ ] Retrieves the authenticated user's ID and filters all queries by it
- [ ] Is called only from a Server Component
