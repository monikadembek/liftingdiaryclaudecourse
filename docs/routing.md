# Routing Coding Standards

## Route Structure

**All application routes live under `/dashboard`.**

- The root `/dashboard` page is the main authenticated landing page.
- All sub-pages are nested under `/dashboard`, e.g.:
  - `/dashboard/workout/new`
  - `/dashboard/workout/[workoutId]`

Do NOT create top-level application routes outside of `/dashboard`. Public-facing pages (e.g., landing page, sign-in) live at the root level only.

## Route Protection

**All `/dashboard` routes are protected and must only be accessible by authenticated users.**

Route protection is enforced at two levels:

### 1. Middleware (primary enforcement)

Route protection for the entire `/dashboard` subtree is handled via Next.js middleware in `src/middleware.ts` using Clerk's `clerkMiddleware`. The middleware must use `createRouteMatcher` to protect all `/dashboard` routes and redirect unauthenticated users.

```ts
// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

### 2. Server Component guard (secondary enforcement)

Every `/dashboard` page component must also check authentication at the top of the Server Component as a secondary guard. Never rely on middleware alone.

```ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const { userId } = await auth();
if (!userId) redirect("/");
```

See `auth.md` for full authentication patterns.

## File Conventions

Follow the Next.js App Router file conventions for all routes:

| File | Purpose |
|---|---|
| `page.tsx` | The route's UI — must be a Server Component |
| `layout.tsx` | Shared layout for a route segment and its children |
| `actions.ts` | Server Actions for mutations in this route segment |
| `loading.tsx` | Loading UI (Suspense boundary) |
| `error.tsx` | Error UI boundary |

## Rules

- All routes under `/dashboard` MUST be protected via middleware AND a per-page `auth()` check.
- Do NOT create new routes outside of `/dashboard` for authenticated features.
- Page components (`page.tsx`) must be Server Components — do not add `"use client"` to page files.
- Use `actions.ts` files co-located with the route for Server Actions (see `data-mutations.md`).
- Dynamic route segments use the `[param]` folder naming convention (e.g., `[workoutId]`).
