# Execution Plan: Screen 03 — Post Detail & Discussion (`screen_post_detail.md`)

**Target Route:** `/posts/[id]` or `/p/[boardSlug]/posts/[id]`  
**Matching UI:** Top-Right screen in `ui/ux.png`  
**SRS Reference:** Section 4.2 (Discussion Threads), Section 4.3 (Dynamic SEO & OpenGraph), Section 8 (SEO & Metadata)  
**Architectural Contract:** Conforms to [`AGENTS.md`](../AGENTS.md) (Dynamic `generateMetadata`, Server Actions for comments, optimistic comment addition)

---

## 1. Visual & Layout Breakdown (From Mockup)

1. **Back Navigation & Header Bar:**
   - Link: `← Back to feedback` (or back to roadmap).
   - Global navbar with search and sign in.
2. **Post Detail Header & Hero Area:**
   - Category pill: `API` (light blue background).
   - Main title: `<h1>Better API documentation</h1>`.
   - Right-side upvote card/widget:
     - Up arrow icon.
     - Large vote count: `128`.
     - Button: `Upvote` (inverts to `Upvoted` when active).
   - Author Info:
     - User avatar image (40x40 circle, via `next/image`).
     - Author name: `John Carter`.
     - Timestamp: `2 days ago`.
3. **Post Body Content:**
   - Multi-paragraph markdown/rich text explaining the feature request:
     - *"The current API docs are hard to navigate. More examples, clear authentication steps and auto-generated references would be helpful."*
     - *"This would make it easier for new developers to get started and reduce the number of support requests we receive."*
4. **Tags Row:**
   - Badges: `API`, `Documentation`, `Developer Experience`.
5. **Discussion & Comments Section:**
   - Comment counter header: `32 comments`.
   - New comment form:
     - Current user avatar on left.
     - Text input / textarea: `"Add a comment..."`.
     - Submit button: `Post`.
   - Comment List:
     - **Standard Comment 1 (Sarah Kim, 2 days ago):**
       - Avatar, name, time.
       - Body: *"+1 This would save our team a lot of time. The current docs are still confusing even after reading the guides."*
       - Upvote comment button (`△ 12`), `Reply` action link.
     - **Standard Comment 2 (Mike Johnson, 1 day ago):**
       - Avatar, name, time.
       - Body: *"This would be a huge improvement. Please prioritize this!"*
       - Upvote comment button (`△ 7`), `Reply` action link.
     - **Official Response Comment (Product Team, 1 day ago):**
       - Special styling: Subtly tinted background or border.
       - Green badge: `Official response`.
       - Body: *"We're currently working on this and it's planned for the next release. Thanks for the feedback!"*
       - Upvote comment button (`△ 24`), `Reply` action link.

---

## 2. Server vs. Client Component Boundaries

```text
app/(public)/posts/[id]/page.tsx (Server Component)
├── components/ui/navbar.tsx (Server Component)
├── features/feedback/components/post-header.tsx (Server Component)
│   └── features/feedback/components/large-upvote-widget.tsx (Client Component - Optimistic)
├── features/feedback/components/post-content.tsx (Server Component)
└── features/feedback/components/comment-section.tsx (Server Component)
    ├── features/feedback/components/add-comment-form.tsx (Client Component - useActionState)
    └── features/feedback/components/comment-list.tsx (Server Component)
        └── features/feedback/components/comment-item.tsx (Server Component)
            └── features/feedback/components/comment-upvote.tsx (Client Component)
```

- **Server Components:**
  - `page.tsx`: Fetches post by `id`, generates dynamic metadata, renders discussion shell.
  - `post-header.tsx`, `post-content.tsx`: Pure HTML rendering of title, markdown, and author metadata.
  - `comment-list.tsx` & `comment-item.tsx`: Server-rendered comment feed.
- **Client Components (Strict Leaf Islands):**
  - `<LargeUpvoteWidget />`: Handles instant upvote toggle for the main post.
  - `<AddCommentForm />`: Form with `useActionState` and `useFormStatus`, clearing input on success and appending optimistic comment.
  - `<CommentUpvote />`: Handles vote toggle on individual comments.

---

## 3. Dynamic SEO & Metadata Contract (`generateMetadata`)

In `app/(public)/posts/[id]/page.tsx`:
```typescript
export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const post = await getFeedbackPostByIdQuery(id);
  
  if (!post) {
    return { title: 'Post Not Found | FeaturePulse' };
  }

  return {
    title: `${post.title} | FeaturePulse Roadmap`,
    description: post.content.slice(0, 160),
    openGraph: {
      title: `${post.title} — ${post.upvoteCount} Upvotes`,
      description: post.content.slice(0, 160),
      type: 'article',
      publishedTime: post.createdAt.toISOString(),
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.content.slice(0, 160),
    },
  };
}
```

---

## 4. Server Actions & Mutations

1. **`addCommentAction(prevState, formData: FormData): Promise<ActionResponse<Comment>>`**
   - Validates `content` (2-1000 chars), `postId` (UUID).
   - Validates session.
   - If author is an admin/team member, flags comment with `isOfficialResponse: true`.
   - Calls `revalidatePath('/posts/[id]')`.
2. **`toggleCommentVoteAction(commentId: string): Promise<ActionResponse<void>>`**

---

## 5. UI Implementation & daisyUI Tokens

- **Upvote Widget:**
  - `card bg-base-100 border border-base-200 p-4 rounded-xl flex flex-col items-center gap-1 shadow-sm`
  - Big number: `text-2xl font-bold text-base-content`
  - Button: `btn btn-primary btn-sm w-full`
- **Official Response Badge & Card:**
  - `badge badge-success badge-sm font-semibold gap-1` (`Official response`)
  - Container: `border-l-4 border-success bg-success/5 p-4 rounded-r-xl`
- **Comment Input:**
  - `textarea textarea-bordered w-full resize-none focus:textarea-primary`
  - Submit button: `btn btn-primary btn-sm`

---

## 6. Skeletons & Not-Found Handling

- **`not-found.tsx`:** Renders a clean 404 screen if `getFeedbackPostByIdQuery` returns null, offering a button back to `/feedback`.
- **`loading.tsx`:** Renders skeletons for title, upvote widget, author row, paragraphs, and comment avatars.
