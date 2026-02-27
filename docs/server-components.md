# Server Components

## Async Params (Next.js 16)

**In Next.js 16, `params` and `searchParams` are Promises and MUST be awaited.**

This is a breaking change from earlier Next.js versions. Accessing params synchronously will not work — you must `await` them before use.

### Rules

1. **Always `await` params** — `params` is a `Promise<{ ... }>`, not a plain object.
2. **Always `await` searchParams** — `searchParams` is a `Promise<{ ... }>`, not a plain object.
3. **Type params as `Promise<{ ... }>`** in the component's props type.

### Page Component Example

```tsx
// app/dashboard/workout/[workoutId]/page.tsx

type Props = {
  params: Promise<{ workoutId: string }>;
};

export default async function WorkoutPage({ params }: Props) {
  const { workoutId } = await params;

  // Now use workoutId safely
}
```

### With searchParams

```tsx
type Props = {
  params: Promise<{ workoutId: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function WorkoutPage({ params, searchParams }: Props) {
  const { workoutId } = await params;
  const { tab } = await searchParams;
}
```

### Common Mistake — DO NOT DO THIS

```tsx
// ❌ WRONG — params is a Promise, not an object
export default async function WorkoutPage({ params }: { params: { workoutId: string } }) {
  const { workoutId } = params; // will NOT work in Next.js 16
}
```

## General Server Component Rules

- Server Components must be `async` functions when they perform any async work (data fetching, awaiting params, etc.).
- Never add `"use client"` to a component that fetches data — see `/docs/data-fetching.md`.
- Pass data down to Client Components as props; do not fetch inside Client Components.
