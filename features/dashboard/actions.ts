'use server';

import { revalidatePath } from 'next/cache';
import { db, PostStatus, FeedbackPost } from '@/lib/db';
import { requireAdminSession } from '@/lib/auth/dal';
import { ActionResponse } from '../feedback/actions';

export async function updatePostStatusAction(
  postId: string,
  newStatus: PostStatus
): Promise<ActionResponse<FeedbackPost>> {
  // DAL check
  await requireAdminSession();

  const post = db.posts.find((p) => p.id === postId);
  if (!post) {
    return {
      success: false,
      errors: { root: ['Post not found'] },
    };
  }

  post.status = newStatus;

  revalidatePath('/dashboard');
  revalidatePath('/roadmap');
  revalidatePath('/feedback');
  revalidatePath(`/posts/${postId}`);

  return {
    success: true,
    data: post,
  };
}
