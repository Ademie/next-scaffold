# Execution Plan: Screen 01 — Public Feedback List (`screen_feedback_list.md`)

**Target Route:** `/` or `/feedback`  
**Matching UI:** Top-Left screen in `ui/ux.png`  
**SRS Reference:** Section 4.2 (Feedback & Ideation), Section 6 (Data Model)  
**Architectural Contract:** Conforms to [`AGENTS.md`](../AGENTS.md) (RSC by default, URL-driven filtering, optimistic upvoting)

---

## 1. Visual & Layout Breakdown (From Mockup)

1. **Header Component (`components/ui/navbar.tsx`):**
   - Brand logo & name: `FeaturePulse`.
   - Navigation links: `Roadmap`, `Feedback` (active indicator: underline/primary), `Changelog`.
   - Global search icon button.
   - Secondary button: `Sign in` (links to `/login`).
2. **Hero Section:**
   - Pre-title eyebrow: `"Build a better product, together"`.
   - Main headline: `<h1>What should we build next?</h1>`.
   - Subtitle: `"Share your ideas, vote on what matters, and see our roadmap in real time."`.
3. **Primary Action Bar:**
   - Search input field: `"Search feedback..."` with instant debounce updating `?q=...` in URL.
   - Primary action button: Blue `Submit feedback` button with plus icon. Triggers URL state `?modal=submit-feedback`.
4. **Filter & Sort Control Bar:**
   - Sort tabs: `Popular` (default), `Newest`, `My votes` (syncs to URL `?sort=popular|newest|voted`).
   - Category dropdown filter: `All categories ⌄` (`?category=all|api|ui|integrations|security|mobile`).
5. **Feedback Card Feed:**
   - List of feedback cards displaying:
     - Vertical upvote button on the left (arrow icon + vote counter).
     - Title (clickable, navigates to `/posts/[id]`).
     - Description snippet (truncated to 2 lines).
     - Metadata row: Category badge (e.g. `API`, `UI`), comment counter with icon (e.g. `32 comments`), relative timestamp (e.g. `2 days ago`).
     - Status pill on top right: `Planned` (blue), `In Progress` (orange), `Under Review` (purple), `Completed` (green).

---

## 2. Server vs. Client Component Boundaries

```text
app/(public)/feedback/page.tsx (Server Component)
├── components/ui/navbar.tsx (Server Component)
├── features/feedback/components/hero-search.tsx (Client Component - URL debounce)
├── features/feedback/components/feedback-tabs.tsx (Client Component - URL sort & filter)
├── features/feedback/components/feedback-feed.tsx (Server Component - fetches & maps data)
│   └── features/feedback/components/feedback-card.tsx (Server Component)
│       └── features/feedback/components/upvote-button.tsx (Client Component - Optimistic UI)
└── features/feedback/components/submit-feedback-modal.tsx (Client Component - useActionState)
```

- **Server Components:**
  - `page.tsx`: Reads `searchParams` (`q`, `sort`, `category`, `page`), calls `getFeedbackPostsQuery()`, passes data to feed.
  - `feedback-feed.tsx`: Renders the list of posts.
  - `feedback-card.tsx`: Renders card layout, typography, tags, and status badges.
- **Client Components (Strict Leaf Interactivity):**
  - `<HeroSearch />`: Debounced input writing query param `?q=...`.
  - `<FeedbackTabs />`: Tab bar writing `?sort=...` and dropdown writing `?category=...`.
  - `<UpvoteButton />`: Handles click event, optimistic count increment, calls `toggleUpvoteAction`.
  - `<SubmitFeedbackModal />`: Controlled dialog open when `?modal=submit-feedback`, wired with React 19 `useActionState` and `useFormStatus`.

---

## 3. Data Flow & Server Action Contracts

### 3.1 Server Query (`features/feedback/queries.ts`)
```typescript
export async function getFeedbackPostsQuery({
  query?: string,
  sort?: 'popular' | 'newest' | 'voted',
  category?: string,
  boardSlug?: string,
}: GetFeedbackParams): Promise<FeedbackPostListItem[]> {
  // Explicit cache revalidation posture (Section 3 of AGENTS.md)
  // Revalidates every 60 seconds (ISR) or on demand via revalidatePath
}
```

### 3.2 Server Action Mutation (`features/feedback/actions.ts`)
1. **`submitFeedbackAction(prevState, formData: FormData): Promise<ActionResponse<Post>>`**
   - Validated via `createFeedbackSchema` (Zod):
     - `title`: `z.string().min(3).max(100)`
     - `description`: `z.string().min(10).max(2000)`
     - `category`: `z.enum(['api', 'ui', 'integrations', 'security', 'mobile'])`
   - Returns standardized `ActionResponse<T>`.
   - Triggers `revalidatePath('/feedback')` upon success.
2. **`toggleUpvoteAction(postId: string): Promise<ActionResponse<{ upvoted: boolean; count: number }>>`**
   - Atomically updates `votes` and `posts.upvoteCount`.

---

## 4. State Management & URL Synchronization

- **Search Query (`?q=billing`):** Synced to URL; triggers server re-render with filtered SQL `ILIKE`.
- **Sort Selection (`?sort=popular`):** Controls SQL `ORDER BY upvoteCount DESC` or `createdAt DESC`.
- **Category Filter (`?category=ui`):** Adds SQL `WHERE category = 'ui'`.
- **Modal Dialog (`?modal=submit-feedback`):** Allows deep linking directly to submission form and closing via browser back button.

---

## 5. UI Implementation & daisyUI Tokens

- **Card Base:** daisyUI `card bg-base-100 border border-base-200 hover:border-primary/40 transition-colors shadow-sm`.
- **Status Badges:**
  - `Planned`: `badge badge-info badge-soft`
  - `In Progress`: `badge badge-warning badge-soft`
  - `Under Review`: `badge badge-secondary badge-soft`
  - `Completed`: `badge badge-success badge-soft`
- **Upvote Button:**
  - Inactive: `btn btn-outline border-base-300 hover:border-primary hover:text-primary flex-col h-auto py-2 px-3`
  - Active (Voted): `btn btn-primary flex-col h-auto py-2 px-3 text-primary-content`

---

## 6. Error & Loading Skeletons

- **`loading.tsx`:** Renders daisyUI `skeleton` boxes mirroring the hero, search bar, and 5 card rows.
- **`error.tsx`:** Catches query failures, renders polite message with `<button onClick={() => reset()}>Try again</button>`.
