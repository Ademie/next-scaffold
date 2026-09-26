import { db, FeedbackPost } from '@/lib/db';

export interface GetFeedbackParams {
  query?: string;
  sort?: 'popular' | 'newest' | 'voted';
  category?: string;
}

export async function getFeedbackPostsQuery({
  query = '',
  sort = 'popular',
  category = 'all',
}: GetFeedbackParams): Promise<FeedbackPost[]> {
  // Explicit caching decision (Section 3 of AGENTS.md):
  // Feedback feed is revalidated via Server Action mutations
  let items = [...db.posts];

  // Search filter
  if (query.trim()) {
    const q = query.toLowerCase();
    items = items.filter(
      (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }

  // Category filter
  if (category && category !== 'all') {
    items = items.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  // Sorting
  if (sort === 'popular') {
    items.sort((a, b) => b.upvoteCount - a.upvoteCount);
  } else if (sort === 'newest') {
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else if (sort === 'voted') {
    items.sort((a, b) => b.upvoteCount - a.upvoteCount);
  }

  return items;
}

export async function getFeedbackPostByIdQuery(id: string): Promise<FeedbackPost | null> {
  const post = db.posts.find((p) => p.id === id);
  return post || null;
}

export async function getCommentsByPostIdQuery(postId: string) {
  return db.comments.filter((c) => c.postId === postId);
}

