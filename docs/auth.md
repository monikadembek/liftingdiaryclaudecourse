# Auth Coding Standards

## Provider

**This app uses [Clerk](https://clerk.com) for authentication exclusively.**

- Do NOT implement custom auth logic (sessions, JWTs, password hashing, etc.)
- Do NOT use any other auth library (NextAuth, Auth.js, Lucia, etc.)
- All auth must go through Clerk's SDK

## Setup

`ClerkProvider` wraps the entire app in `src/app/layout.tsx`. Do not add it anywhere else or remove it.

The Clerk middleware runs on all routes via `src/middleware.ts` using `clerkMiddleware()`.

## Getting the Current User

### In Server Components and data helpers

Use `auth()` from `@clerk/nextjs/server` to retrieve the current user's ID:

```ts
import { auth } from "@clerk/nextjs/server";

const { userId } = await auth();
if (!userId) throw new Error("Unauthenticated");
```

### In Client Components

Use the `useAuth()` or `useUser()` hooks from `@clerk/nextjs`:

```ts
import { useAuth } from "@clerk/nextjs";

const { userId } = useAuth();
```

Note: data fetching must still happen in Server Components — see `data-fetching.md`.

## UI Components

Use Clerk's pre-built UI components for all sign-in/sign-up/user flows:

| Component | Import | Purpose |
|---|---|---|
| `<SignInButton>` | `@clerk/nextjs` | Triggers sign-in (use `mode="modal"`) |
| `<SignUpButton>` | `@clerk/nextjs` | Triggers sign-up (use `mode="modal"`) |
| `<UserButton>` | `@clerk/nextjs` | Avatar/menu for signed-in user |
| `<SignedIn>` | `@clerk/nextjs` | Renders children only when signed in |
| `<SignedOut>` | `@clerk/nextjs` | Renders children only when signed out |

Do NOT build custom sign-in/sign-up forms or user menus.

## Route Protection

To protect a route so only authenticated users can access it, use `auth()` at the top of the Server Component and redirect if there is no `userId`:

```ts
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const { userId } = await auth();
if (!userId) redirect("/");
```

For middleware-level protection across multiple routes, configure `clerkMiddleware` in `src/middleware.ts`.

## Rules

- Always check `userId` before any data access — never trust that a route is protected by middleware alone
- Never expose another user's data — all queries must be scoped to the authenticated `userId` (see `data-fetching.md`)
- Never store `userId` or auth tokens in client-side state (localStorage, cookies managed by you, etc.) — Clerk handles session management
