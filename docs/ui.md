# UI Coding Standards

## Component Library

**ONLY shadcn/ui components may be used for UI in this project.**

- Do NOT create custom UI components (buttons, inputs, cards, dialogs, etc.)
- Do NOT use any other component library (MUI, Chakra, Mantine, etc.)
- All UI must be composed exclusively from shadcn/ui primitives
- If a shadcn/ui component does not exist for a use case, use the closest available shadcn/ui component and compose from it

Install new shadcn/ui components via:

```bash
npx shadcn@latest add <component-name>
```

## Date Formatting

All dates must be formatted using **date-fns**.

Dates must follow this format: `do MMM yyyy`

### Examples

| Raw Date | Formatted Output |
|---|---|
| 2025-09-01 | 1st Sep 2025 |
| 2025-08-02 | 2nd Aug 2025 |
| 2026-01-03 | 3rd Jan 2026 |
| 2025-06-04 | 4th Jun 2025 |

### Usage

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy"); // e.g. "1st Sep 2025"
```
