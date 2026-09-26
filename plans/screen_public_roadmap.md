# Execution Plan: Screen 02 — Public Roadmap (`screen_public_roadmap.md`)

**Target Route:** `/roadmap`  
**Matching UI:** Top-Middle screen in `ui/ux.png`  
**SRS Reference:** Section 4.3 (Public Roadmap Board), Section 6 (Data Model)  
**Architectural Contract:** Conforms to [`AGENTS.md`](../AGENTS.md) (Server-rendered Kanban, co-located feature queries, responsive CSS grid)

---

## 1. Visual & Layout Breakdown (From Mockup)

1. **Header Navigation:**
   - Same global navbar (`components/ui/navbar.tsx`).
   - Active navigation item: `Roadmap` (underlined/highlighted).
2. **Page Header:**
   - Title: `<h1>Roadmap</h1>`
   - Subtitle: `"See what we're working on and what's coming next."`
3. **Three-Column Kanban Board Layout:**
   - **Column 1: Planned (Blue Accent)**
     - Header: Blue bullet dot, title `Planned`, badge counter showing total items (e.g. `12`).
     - Cards inside Planned column:
       - Example: "API v2" (description snippet, tag `API`, upvotes `128`, comments `32`).
       - Example: "Advanced analytics" (tag `Analytics`, upvotes `96`, comments `21`).
       - Example: "Mobile app" (tag `Mobile`, upvotes `72`, comments `18`).
       - Example: "Custom themes" (tag `Customization`, upvotes `54`, comments `14`).
   - **Column 2: In Progress (Yellow/Amber Accent)**
     - Header: Amber bullet dot, title `In Progress`, badge counter (e.g. `8`).
     - Cards inside In Progress column:
       - Example: "Dark mode improvements" (tag `UI`, upvotes `129`, comments `32`).
       - Example: "Slack integration" (tag `Integrations`, upvotes `84`, comments `19`).
       - Example: "Team permissions" (tag `Administration`, upvotes `61`, comments `12`).
       - Example: "Bulk actions" (tag `Productivity`, upvotes `48`, comments `9`).
   - **Column 3: Completed (Green Accent)**
     - Header: Green bullet dot, title `Completed`, badge counter (e.g. `15`).
     - Cards inside Completed column:
       - Example: "SSO support" (tag `Security`, upvotes `342`, comments `41`).
       - Example: "Vote on comments" (tag `Community`, upvotes `210`, comments `26`).
       - Example: "Real-time updates" (tag `Performance`, upvotes `176`, comments `22`).
       - Example: "Public changelog" (tag `Product`, upvotes `143`, comments `17`).

---

## 2. Server vs. Client Component Boundaries

```text
app/(public)/roadmap/page.tsx (Server Component)
├── components/ui/navbar.tsx (Server Component)
└── features/roadmap/components/roadmap-board.tsx (Server Component)
    ├── features/roadmap/components/roadmap-column.tsx (Server Component - renders column)
    │   └── features/roadmap/components/roadmap-card.tsx (Server Component)
    │       └── features/feedback/components/upvote-compact.tsx (Client Component - Optimistic)
    └── features/roadmap/components/roadmap-mobile-tabs.tsx (Client Component - for mobile screen switching)
```

- **Server Components:**
  - `page.tsx`: Server Component fetching all roadmap items grouped by status in parallel.
  - `roadmap-board.tsx`: 3-column CSS Grid (`grid grid-cols-1 md:grid-cols-3 gap-6`).
  - `roadmap-column.tsx`: Header with accent indicator, count badge, and card stack.
  - `roadmap-card.tsx`: Card surface with hover effects linking to `/posts/[id]`.
- **Client Components:**
  - `<UpvoteCompact />`: Small inline upvote pill on each card with optimistic increment.
  - `<RoadmapMobileTabs />`: Tab switcher visible only on small viewports (`sm:hidden`) allowing mobile users to toggle between Planned, In Progress, and Completed columns without horizontal overflow.

---

## 3. Data Queries & Caching Policy

### 3.1 Server Query (`features/roadmap/queries.ts`)
```typescript
export interface RoadmapData {
  planned: RoadmapPostItem[];
  inProgress: RoadmapPostItem[];
  completed: RoadmapPostItem[];
  counts: { planned: number; inProgress: number; completed: number };
}

export async function getRoadmapBoardQuery(boardSlug: string): Promise<RoadmapData> {
  // Section 3 of AGENTS.md: Explicit caching policy
  // Public roadmap changes moderately; revalidate every 60 seconds (ISR)
  // or immediate revalidation on admin status updates
}
```

---

## 4. UI Implementation & daisyUI Tokens

- **Kanban Column Container:**
  - `bg-base-200/50 rounded-2xl p-4 border border-base-200 flex flex-col gap-3 min-h-[600px]`
- **Column Headers:**
  - Planned: `<span class="h-2.5 w-2.5 rounded-full bg-info"></span>` + `font-semibold text-base-content` + `<span class="badge badge-sm badge-ghost">12</span>`
  - In Progress: `<span class="h-2.5 w-2.5 rounded-full bg-warning"></span>` + `font-semibold text-base-content` + `<span class="badge badge-sm badge-ghost">8</span>`
  - Completed: `<span class="h-2.5 w-2.5 rounded-full bg-success"></span>` + `font-semibold text-base-content` + `<span class="badge badge-sm badge-ghost">15</span>`
- **Roadmap Card:**
  - `card bg-base-100 p-4 rounded-xl border border-base-200 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer`
  - Tag badge: `badge badge-outline badge-sm text-xs`
  - Footer stats: Upvote count and comment count styled with subtle icon SVGs.

---

## 5. SEO & Metadata Integration

- In `app/(public)/roadmap/page.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Public Product Roadmap | FeaturePulse',
  description: "Explore what features the FeaturePulse team is currently planning, building, and launching. Vote on priorities.",
  openGraph: {
    title: 'FeaturePulse Public Roadmap',
    description: "Explore what we're working on and what's coming next.",
  },
};
```

---

## 6. Skeletons & Error Handling

- **`loading.tsx`:** Renders 3 columns each with 4 daisyUI skeleton cards with pulsating headers to prevent layout shift.
- **`error.tsx`:** Displays a friendly error boundary with retry trigger.
