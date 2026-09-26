import Image from 'next/image';
import { ArrowUp } from 'lucide-react';
import { Comment } from '@/lib/db';

interface CommentItemProps {
  comment: Comment;
}

function formatRelativeTime(dateString: string) {
  const diffDays = Math.max(1, Math.round((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60 * 24)));
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  const diffWeeks = Math.round(diffDays / 7);
  return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
}

export function CommentItem({ comment }: CommentItemProps) {
  const defaultAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80';

  return (
    <div
      className={`p-4 rounded-xl transition-colors border ${
        comment.isOfficialResponse
          ? 'bg-success/5 border-success/30'
          : 'bg-base-100 border-base-200/80'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Author Avatar */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-base-200">
          <Image
            src={comment.authorAvatar || defaultAvatar}
            alt={comment.authorName}
            fill
            sizes="32px"
            className="object-cover"
          />
        </div>

        {/* Comment Body */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-semibold text-sm text-base-content">
              {comment.authorName}
            </span>

            {comment.isOfficialResponse && (
              <span className="badge badge-success badge-soft badge-xs font-semibold text-[10px] px-2 py-0.5">
                Official response
              </span>
            )}

            <span className="text-xs text-base-content/50">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>

          <p className="text-sm text-base-content/80 leading-relaxed mb-3">
            {comment.content}
          </p>

          {/* Comment Footer: Upvotes & Reply */}
          <div className="flex items-center gap-4 text-xs font-medium text-base-content/60">
            <button
              type="button"
              className="flex items-center gap-1 hover:text-base-content transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>{comment.upvotes}</span>
            </button>

            <button
              type="button"
              className="hover:text-base-content transition-colors font-semibold"
            >
              Reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
