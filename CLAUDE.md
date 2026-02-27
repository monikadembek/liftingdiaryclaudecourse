# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Docs-First Requirement

**Before generating any code, Claude Code MUST first read and refer to the relevant documentation files in the `/docs` directory.** All implementation decisions, patterns, and conventions should align with what is specified in those docs. If a relevant doc file exists for the feature or area being worked on, it takes precedence over general assumptions.

- /docs/ui.md
- /docs/data-fetching.md
- /docs/data-mutations.md
- /docs/auth.md
- /docs/server-components.md
- /docs/routing.md

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Architecture

**Next.js 16 App Router** project with TypeScript and Tailwind CSS 4.

- `src/app/` — App Router pages and layouts
  - `layout.tsx` — Root layout (fonts, metadata, global HTML structure)
  - `page.tsx` — Home page
  - `globals.css` — Global styles; Tailwind 4 uses `@theme inline` for CSS custom properties, not a `tailwind.config.*`
- `public/` — Static assets served at root path

**Path alias:** `@/*` resolves to `./src/*`.

**Tailwind CSS 4** is configured via PostCSS (`postcss.config.mjs`) using `@tailwindcss/postcss` — there is no separate `tailwind.config.js`. Theme customization goes in `globals.css` under `@theme inline`.

**ESLint** uses the new flat config format (`eslint.config.mjs`, ESLint 9+).
