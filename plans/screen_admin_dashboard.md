# Execution Plan: Screen 05 — Admin Overview & Triage Dashboard (`screen_admin_dashboard.md`)

**Target Route:** `/dashboard`  
**Matching UI:** Bottom-Right screen in `ui/ux.png`  
**SRS Reference:** Section 4.4 (Admin Backoffice), Section 4.1 (Tenant Isolation), Section 5.2 (Security)  
**Architectural Contract:** Conforms to [`AGENTS.md`](../AGENTS.md) (Data Access Layer authorization, server-rendered analytics, Server Actions for status transitions)

---

## 1. Visual & Layout Breakdown (From Mockup)

1. **Dashboard Shell & Left Sidebar (`app/(dashboard)/layout.tsx`):**
   - **Organization Switcher Dropdown:** `Acme Inc. ⌄` with tenant icon.
   - **Primary Navigation List:**
     - `Overview` (active tab, blue icon + text).
     - `Feedback` (all submitted customer requests).
     - `Roadmap` (internal drag-and-drop / column organizer).
     - `Changelog` (releases publisher).
   - **Manage Section Header:**
     - `Team` (invite and role permissions).
     - `Boards` (board visibility & tags).
     - `Settings` (organization branding, domains).
   - **User Profile Row (Bottom):**
     - Avatar circle, Name: `John Carter`, Role badge: `Admin`, Caret `>`.
2. **Main Dashboard View Header:**
   - Title: `<h1>Overview</h1>`
   - Subtitle: `"Here's what's happening with your product."`
   - Timeframe filter dropdown: `Last 7 days ⌄` (`?range=7d|30d|all`).
3. **KPI Stat Metric Cards (4-column grid):**
   - **Card 1: Total feedback** — Value: `248`, Delta badge: `▲ 12%` (green).
   - **Card 2: New this week** — Value: `62`, Delta badge: `▲ 28%` (green).
   - **Card 3: Upvotes** — Value: `1.4k`, Delta badge: `▲ 20%` (green).
   - **Card 4: Comments** — Value: `312`, Delta badge: `▲ 16%` (green).
4. **Recent Feedback Triage Table (2/3 width column):**
   - Table columns: `Title`, `Status`, `Votes`, `Comments`, `Actions`.
   - Sample Rows:
     - "Better API documentation" | `Planned` | 128 | 32
     - "Dark mode improvements" | `In Progress` | 129 | 28
     - "Slack integration" | `Under Review` | 84 | 19
     - "SSO support" | `Completed` | 342 | 41
     - "Mobile app" | `Planned` | 72 | 18
   - In-table quick status changer dropdown: Selectable status pill that triggers `updatePostStatusAction`.
5. **Feedback by Category Donut Chart (1/3 width column):**
   - Interactive SVG / Canvas Donut Chart:
     - `UI`: 28% (Blue)
     - `API`: 22% (Teal)
     - `Integrations`: 18% (Purple)
     - `Security`: 14% (Orange)
     - `Mobile`: 10% (Green)
     - `Other`: 8% (Gray)
   - Legend with color bullets and percentage stats.

---

## 2. Server vs. Client Component Boundaries

```text
app/(dashboard)/layout.tsx (Server Component - DAL tenant check)
├── features/dashboard/components/sidebar.tsx (Server Component)
│   ├── features/dashboard/components/org-switcher.tsx (Client Component)
│   └── features/dashboard/components/nav-links.tsx (Client Component - usePathname)
└── app/(dashboard)/page.tsx (Server Component - parallel data fetch)
    ├── features/dashboard/components/dashboard-header.tsx (Server Component)
    │   └── features/dashboard/components/timeframe-select.tsx (Client Component - URL state)
    ├── features/dashboard/components/metric-stat-cards.tsx (Server Component)
    └── features/dashboard/components/dashboard-grid.tsx (Server Component)
        ├── features/dashboard/components/recent-feedback-table.tsx (Server Component)
        │   └── features/dashboard/components/status-dropdown.tsx (Client Component - Server Action)
        └── features/dashboard/components/category-breakdown-chart.tsx (Client Component - SVG Donut)
```

- **Server Components:**
  - `layout.tsx`: Invokes Data Access Layer (`requireAdminSession()`). If unauthorized, redirects.
  - `page.tsx`: Fetches KPI metrics, recent posts, and category aggregates in parallel.
  - `metric-stat-cards.tsx`: Renders high-performance server HTML for the 4 stat cards.
  - `recent-feedback-table.tsx`: Renders the table markup with zero hydration overhead.
- **Client Components (Strict Leaf Interactivity):**
  - `<TimeframeSelect />`: Updates query param `?range=30d`.
  - `<StatusDropdown />`: Select pill allowing the admin to change a post's status with an immediate optimistic UI update.
  - `<CategoryBreakdownChart />`: Renders animated SVG donut and hover tooltips.

---

## 3. Security & Data Access Layer (DAL)

In `features/auth/dal.ts`:
```typescript
export async function requireAdminSession(requiredOrgSlug?: string) {
  const session = await verifySession();
  if (!session || !session.userId) {
    redirect('/login');
  }

  const membership = await getOrganizationMembershipQuery(session.userId, requiredOrgSlug);
  if (!membership || membership.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin privilege required.');
  }

  return { user: session, organization: membership.organization };
}
```

---

## 4. Server Actions & Mutations

1. **`updatePostStatusAction(postId: string, newStatus: PostStatus): Promise<ActionResponse<Post>>`**
   - Verifies admin rights via `requireAdminSession()`.
   - Updates `posts.status`.
   - Triggers `revalidatePath('/dashboard')` and `revalidatePath('/roadmap')`.

---

## 5. UI Implementation & daisyUI Tokens

- **Sidebar Container:**
  - `w-64 bg-base-100 border-r border-base-200 flex flex-col justify-between p-4 min-h-screen`
- **KPI Stat Cards:**
  - `stat bg-base-100 border border-base-200 rounded-xl p-5 shadow-sm`
  - Title: `stat-title text-sm text-base-content/60 font-medium`
  - Value: `stat-value text-3xl font-bold text-base-content`
  - Delta: `badge badge-success badge-soft badge-sm gap-1`
- **Recent Feedback Table:**
  - daisyUI `table w-full` inside `card bg-base-100 border border-base-200 rounded-xl p-4 shadow-sm`
- **Category Donut Container:**
  - `card bg-base-100 border border-base-200 rounded-xl p-5 shadow-sm`

---

## 6. Skeletons & Error Handling

- **`loading.tsx`:** Provides exact skeleton layouts for the 4 stat cards, table rows, and circular donut skeleton.
- **`error.tsx`:** Standard error boundary with retry and back to dashboard link.
