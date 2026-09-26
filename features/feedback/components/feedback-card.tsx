import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { FeedbackPost, PostStatus } from '@/lib/db';
import { UpvoteButton } from './upvote-button';

interface FeedbackCardProps {
  post: FeedbackPost;
}

function getStatusBadge(status: PostStatus) {
  switch (status) {
    case 'PLANNED':
      return <span className="badge badge-info badge-sm font-semibold rounded-md">Planned</span>;
    case 'IN_PROGRESS':
      return <span className="badge badge-warning badge-sm font-semibold rounded-md">In Progress</span>;
    case 'UNDER_REVIEW':
      return <span className="badge badge-secondary badge-sm font-semibold rounded-md">Under Review</span>;
    case 'COMPLETED':
      return <span className="badge badge-success badge-sm font-semibold rounded-md">Completed</span>;
    case 'CLOSED':
      return <span className="badge badge-ghost badge-sm font-semibold rounded-md">Closed</span>;
  }
}

function formatRelativeTime(dateString: string) {
  const diffDays = Math.max(1, Math.round((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24)));
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  const diffWeeks = Math.round(diffDays / 7);
  return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
}

export function FeedbackCard({ post }: FeedbackCardProps) {
  return (
    <div className="card bg-base-100 border border-base-200/90 hover:border-primary/40 rounded-2xl p-4 sm:p-5 transition-all shadow-xs flex flex-row items-start gap-4">
      {/* Upvote Button (Client Island) */}
      <UpvoteButton postId={post.id} initialCount={post.upvoteCount} />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 mb-1.5">
          <Link
            href={`/posts/${post.id}`}
            className="text-base font-semibold text-base-content hover:text-primary transition-colors line-clamp-1"
          >
            {post.title}
          </Link>

          {/* Status Badge */}
          <div className="shrink-0">{getStatusBadge(post.status)}</div>
        </div>

        <p className="text-sm text-base-content/70 line-clamp-2 mb-3 leading-relaxed">
          {post.content}
        </p>

        {/* Card Footer Metadata */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-base-content/60">
          <span className="badge badge-neutral badge-outline badge-sm rounded-md uppercase tracking-wider font-bold text-[10px]">
            {post.category}
          </span>

          <Link
            href={`/posts/${post.id}#comments`}
            className="flex items-center gap-1.5 hover:text-base-content transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{post.commentCount} comments</span>
          </Link>

          <span>•</span>
          <span>{formatRelativeTime(post.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
