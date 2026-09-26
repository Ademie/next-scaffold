'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { db, FeedbackPost } from '@/lib/db';
import { getSession } from '@/lib/auth/dal';

export type ActionResponse<T> =
  | { success: true; data: T; errors?: never }
  | { success: false; errors: Record<string, string[]>; data?: never };

const createFeedbackSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
  content: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description cannot exceed 2000 characters'),
  category: z.string().min(1, 'Please select a category'),
});

export async function submitFeedbackAction(
  _prevState: ActionResponse<FeedbackPost> | null,
  formData: FormData
): Promise<ActionResponse<FeedbackPost>> {
  const session = await getSession();

  const rawData = {
    title: formData.get('title'),
    content: formData.get('content'),
    category: formData.get('category'),
  };

  const validated = createFeedbackSchema.safeParse(rawData);
  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.flatten().fieldErrors,
    };
  }

  const newPost: FeedbackPost = {
    id: `post-${Date.now()}`,
    title: validated.data.title,
    content: validated.data.content,
    category: validated.data.category,
    tags: [validated.data.category],
    status: 'UNDER_REVIEW',
    upvoteCount: 1,
    commentCount: 0,
    authorName: session?.name || 'Community Contributor',
    authorAvatar: session ? undefined : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    createdAt: new Date().toISOString(),
    isPublicRoadmap: false,
  };

  db.posts.unshift(newPost);

  revalidatePath('/feedback');
  revalidatePath('/roadmap');
  revalidatePath('/dashboard');

  return {
    success: true,
    data: newPost,
  };
}

export async function toggleUpvoteAction(
  postId: string
): Promise<ActionResponse<{ upvoted: boolean; count: number }>> {
  const post = db.posts.find((p) => p.id === postId);
  if (!post) {
    return {
      success: false,
      errors: { root: ['Post not found'] },
    };
  }

  const session = await getSession();
  const userId = session?.userId || 'anonymous-client';
  const voteKey = `${userId}:${postId}`;

  let upvoted = false;
  if (db.votes.has(voteKey)) {
    db.votes.delete(voteKey);
    post.upvoteCount = Math.max(0, post.upvoteCount - 1);
    upvoted = false;
  } else {
    db.votes.add(voteKey);
    post.upvoteCount += 1;
    upvoted = true;
  }

  revalidatePath('/feedback');
  revalidatePath('/roadmap');
  revalidatePath(`/posts/${postId}`);

  return {
    success: true,
    data: {
      upvoted,
      count: post.upvoteCount,
    },
  };
}

export async function addCommentAction(
  postId: string,
  _prevState: ActionResponse<any> | null,
  formData: FormData
): Promise<ActionResponse<any>> {
  const content = formData.get('content')?.toString() || '';
  if (!content || content.trim().length < 2) {
    return {
      success: false,
      errors: { content: ['Comment must be at least 2 characters long.'] },
    };
  }

  const session = await getSession();
  const authorName = session?.name || 'Community Member';
  const authorAvatar = session ? undefined : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';
  const isOfficialResponse = session?.role === 'ADMIN';

  const newComment = {
    id: `c-${Date.now()}`,
    postId,
    authorName: isOfficialResponse ? 'Product Team' : authorName,
    authorAvatar,
    content: content.trim(),
    createdAt: new Date().toISOString(),
    upvotes: 0,
    isOfficialResponse,
  };

  db.comments.push(newComment);

  const post = db.posts.find((p) => p.id === postId);
  if (post) {
    post.commentCount += 1;
  }

  revalidatePath(`/posts/${postId}`);
  revalidatePath('/feedback');
  revalidatePath('/roadmap');

  return {
    success: true,
    data: newComment,
  };
}

