# Architectural Handoff — Next.js + Tailwind + daisyUI

**How to use this file:** Antigravity auto-loads `AGENTS.md` (and `GEMINI.md`, which takes
precedence on conflicts) from your project root at the start of every session. Drop this
file in as `AGENTS.md` in any new project using this stack, adjust the version-check lines
below, and it stands as the standing architectural contract for that project.

Reference versions at time of writing: Next.js 16.x (App Router), Tailwind CSS 4.x
(CSS-first config), daisyUI 5.x (Tailwind plugin). **Verify current versions before
scaffolding** — see the Agent Operating Rules below.

---

## 1. Directory & module boundaries

- `app/` is routing only: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`.
  No business logic, no data-shaping, no reusable UI defined inline here.
- Domain/feature logic lives outside `app/` — a top-level `features/` directory organized
  **by domain, not by file type** (no project-wide `utils/`, `hooks/`, `types/` dumping grounds).
- Shared, cross-feature UI primitives live in one `components/ui/` directory. Feature-owned
  components live next to the feature that owns them (e.g., `features/billing/components/`).
- Import direction is one-way: `app/` → `features/` → `lib/`. A feature module never imports
  from `app/`, and features don't import from each other — share through `lib/` if two
  features need the same thing.

## 2. Server vs. client boundary

- Every component defaults to a Server Component. Never add `"use client"` pre-emptively.
- A client component needs a concrete justification: state, an effect, an event handler, or
  a browser-only API. "It might need it later" is not a justification.
- When only one small piece of a component needs interactivity, extract *that piece* into
  its own client component rather than promoting the whole parent.
- Never fetch data in a client component when the same data could be fetched server-side and
  passed down as props.

## 3. Data mutations, actions & caching policy

- **Explicit caching:** Every `fetch` call makes an **explicit** caching decision (`cache: 'no-store'`,
  `revalidate: N`, or `cache: 'force-cache'`) with a comment stating why. Never rely on implicit defaults.
- **Data co-location:** Co-locate data-fetching functions with the feature that owns the data —
  never author raw SQL/ORM queries directly inside `page.tsx` or client components.
- **Server Actions for mutations:** Server Actions are the default for mutations. Only add a
  Route Handler when the consumer genuinely isn't a same-origin form/component (public API, webhook,
  third-party callback).
- **Payload runtime validation:** Never trust client payloads. Validate every Server Action input
  with a schema library (e.g. Zod) before it reaches domain logic.
- **Standardized return shape:** Server Actions must return a standardized, typed result shape:
  ```ts
  type ActionResponse<T> =
    | { success: true; data: T; errors?: never }
    | { success: false; errors: Record<string, string[]>; data?: never };
  ```
- **Form state lifecycle:** Wire forms with React's action-state hooks (`useActionState`,
  `useFormStatus`) and optimistic updates rather than hand-rolled `useState` submission handling.

## 4. Auth & network boundaries

- **Route protection lives at the network boundary AND in the data layer — never only one.**
  The request-interception file is easy to reach for as the single security gate, but relying
  on it alone has caused real bypasses in production (see CVE-2025-29927). Use it only for
  light checks — token presence, redirects — and re-verify the actual session/permissions
  inside the Server Component, Server Action, or Route Handler that touches the data.
  - As of Next.js 16, this file is `proxy.ts` exporting a `proxy` function, replacing the
    deprecated `middleware.ts` / `middleware` export from 15 and earlier. Confirm the current
    file convention before creating it — Next.js's own conventions have shifted, not just its
    dependencies.
  - Centralize the public-vs-protected route matcher in one place (e.g. `lib/auth/routes.ts`);
    don't scatter route-protection logic across files.

## 5. Database & external client lifecycle

- **External clients are singletons.** Database clients (Prisma, Drizzle, Supabase) and connection
  pools must be initialized once on `globalThis` in development, so Fast Refresh doesn't spawn a
  new client — and exhaust a connection pool — on every edit.
- **Repository isolation:** Isolate database operations into feature-owned repository or service
  functions; keep data-layer concerns decoupled from UI orchestration.

## 6. State management & URL state

- **State hierarchy — use the option lowest on this list that still solves the problem:**
  1. *Server-fetched data:* Server Components (re-rendered on navigation / revalidation)
  2. *URL state:* Search query params (`useSearchParams` / `nuqs`) for filters, pagination, tabs,
     and open/closed modals — shareable, bookmarkable, and server-renderable
  3. *Local component state:* `useState` / `useReducer` confined to leaf interactive components
  4. *Global client store:* A dedicated store (e.g. Zustand) only when state genuinely spans
     multiple disconnected component trees. Never wrap the entire root layout in massive React Context providers.

## 7. Styling policy

- Tailwind utility classes are the default. Reach for a scoped CSS file only for what
  utilities can't reasonably express (complex keyframes, third-party style overrides).
- daisyUI supplies component classes (`btn`, `card`, `table`, `modal`, etc.) and theming —
  use its components before hand-rolling equivalents; layer utility classes on top only for
  one-off adjustments.
- Design tokens (brand colors, fonts, spacing scale) are defined **once**, centrally, in the
  CSS theme layer. No hard-coded hex values scattered through components.
- Theme switching, if the project needs it, is wired once at the root layout. Individual
  components never hardcode a theme name.

## 8. SEO, metadata & asset optimization

- **Metadata configuration:** Root `layout.tsx` must define base metadata (`metadataBase`,
  `title.template`, standard OpenGraph/Twitter cards). Dynamic routes must export a typed
  `generateMetadata()` function.
- **Zero layout shift typography:** Use `next/font` for webfonts (no layout shift, zero
  external requests, preloaded at build time).
- **Optimized imagery:** Use `next/image` with explicit `width`/`height` or `fill` for any image
  that affects layout. Configure `images.remotePatterns` in `next.config.ts` for any external
  domain up front.

## 9. Type safety & error handling

- Strict TypeScript. No implicit `any`. External API responses and database outputs must be typed.
- Every route segment that can fail defines its own `error.tsx` (client boundary) and `not-found.tsx`.
  Every route with async data defines a `loading.tsx` skeleton rather than a blank screen during the wait.
- Environment variables are validated at boot through a typed config schema module (e.g.
  `@t3-oss/env-nextjs` or a custom Zod schema in `lib/env.ts`), never raw `process.env` scattered
  through the codebase. Secrets are never referenced inside a client component.

## 10. Agent operating rules (Antigravity-specific)

- **Plan before building.** For any new feature, produce a short implementation plan (files
  to touch, data flow, one open question if any) and wait for approval before executing —
  unless the task is a small, reversible, single-file fix.
- **Verify before presenting.** After a UI change, run the dev server, load the affected
  route with the browser subagent, and confirm there are no console errors before calling
  the task done.
- **Deny by default on irreversible actions.** Never modify lockfiles, environment files,
  database migrations, or CI config without explicit confirmation first — even in
  agent-driven/autopilot mode.
- **Check docs before configuring fast-moving tooling — including Next.js itself.** Tailwind
  and daisyUI have changed their configuration format across major versions; Next.js has
  renamed core file conventions (e.g. `middleware.ts` → `proxy.ts` in v16). Before writing
  config, auth, or routing files, confirm current naming and syntax rather than reproducing a
  pattern from training data.
- **Prefer editing over adding.** Prefer extending an existing file over creating a new one
  with overlapping responsibility. If a new file is warranted, say why in the plan.

## 11. Pre-flight checklist (run once per new project)

1. Confirm the runtime/Node version against current framework requirements.
2. Scaffold with the official CLI; answer each prompt deliberately rather than accepting
   defaults you haven't read.
3. Install and wire the styling stack (Tailwind, then daisyUI) before writing any UI.
4. Establish the typed environment configuration module (`lib/env.ts`).
5. Decide the project's default caching posture (mostly-static content vs. mostly-live data)
   and record that decision back into this file so it's documented from day one.
6. If the project needs auth or route protection, confirm the current request-interception
   file convention (`proxy.ts` vs `middleware.ts`) and name the approved validation library and global-state tool here.
7. Setup database singleton clients on `globalThis` if connecting to persistent data stores.
8. Confirm this file lives at the project root as `AGENTS.md`.

---

*Keep this file focused.* If a rule stops mattering for a given project, delete it rather
than letting the file grow — a large, unfocused rules file is more likely to be partially
ignored than a short, current one.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
