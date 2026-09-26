# Execution Plan: Screen 06 — Public Changelog (`screen_changelog.md`)

**Target Route:** `/changelog`  
**Matching UI:** Navigation item in header & sidebar in `ui/ux.png`  
**SRS Reference:** Section 4.4 (Changelog Generator), Section 8 (SEO & Metadata)  
**Architectural Contract:** Conforms to [`AGENTS.md`](../AGENTS.md) (ISR caching, Server Components, markdown rendering)

---

## 1. Visual & Layout Breakdown

1. **Header Navigation:**
   - Standard navbar (`components/ui/navbar.tsx`).
   - Active navigation item: `Changelog`.
2. **Page Header:**
   - Title: `<h1>Changelog</h1>`.
   - Subtitle: `"New features, enhancements, and product updates."`.
3. **Changelog Timeline Feed:**
   - Left vertical timeline with date markers (e.g. `March 2026`, `February 2026`).
   - Release Entries:
     - Version / Release title (e.g., `"v2.4 — SSO Support & Real-time Updates"`).
     - Published date & author badge.
     - Release notes content with markdown, screenshots, and linked completed feedback requests (`Completed`).
     - Tags: `Security`, `Performance`, `UI`.

---

## 2. Server vs. Client Component Boundaries

```text
app/(public)/changelog/page.tsx (Server Component - ISR revalidate: 300)
├── components/ui/navbar.tsx (Server Component)
└── features/changelog/components/changelog-feed.tsx (Server Component)
    └── features/changelog/components/changelog-entry.tsx (Server Component)
```

- Entire screen is 100% Server Component rendered with zero client-side JavaScript bundle overhead.
- Cached using ISR (`revalidate: 300`) to guarantee instant load times for public readers and web crawlers.

---

## 3. SEO & OpenGraph Integration

```typescript
export const metadata: Metadata = {
  title: 'Changelog & Product Updates | FeaturePulse',
  description: 'See the latest features, improvements, and updates shipped by the FeaturePulse team.',
  openGraph: {
    title: 'FeaturePulse Product Changelog',
    description: 'See what we just shipped.',
  },
};
```
