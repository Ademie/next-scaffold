import { db, FeedbackPost } from '@/lib/db';

export interface RoadmapData {
  planned: FeedbackPost[];
  inProgress: FeedbackPost[];
  completed: FeedbackPost[];
  counts: {
    planned: number;
    inProgress: number;
    completed: number;
  };
}

export async function getRoadmapBoardQuery(): Promise<RoadmapData> {
  const publicPosts = db.posts.filter((p) => p.isPublicRoadmap);

  const planned = publicPosts.filter((p) => p.status === 'PLANNED');
  const inProgress = publicPosts.filter((p) => p.status === 'IN_PROGRESS');
  const completed = publicPosts.filter((p) => p.status === 'COMPLETED');

  return {
    planned,
    inProgress,
    completed,
    counts: {
      planned: planned.length,
      inProgress: inProgress.length,
      completed: completed.length,
    },
  };
}
