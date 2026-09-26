import Link from 'next/link';
import { MessageSquare, ArrowUp } from 'lucide-react';
import { FeedbackPost } from '@/lib/db';

interface RoadmapCardProps {
  post: FeedbackPost;
}

export function RoadmapCard({ post }: RoadmapCardProps) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="card bg-base-100 border border-base-200/90 hover:border-primary/40 rounded-xl p-4 transition-all shadow-xs hover:shadow-sm flex flex-col gap-2.5 group"
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-sm text-base-content group-hover:text-primary transition-colors line-clamp-1">
          {post.title}
        </h3>
      </div>

      <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
        {post.content}
      </p>

      <div className="flex items-center justify-between pt-1 text-xs text-base-content/60">
        <span className="badge badge-neutral badge-outline badge-xs rounded-md text-[10px] uppercase font-bold tracking-wider">
          {post.category}
        </span>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 font-medium">
            <ArrowUp className="w-3 h-3 text-base-content/70" />
            <span>{post.upvoteCount}</span>
          </div>

          <div className="flex items-center gap-1">
            <MessageSquare className="w-3 h-3 text-base-content/70" />
            <span>{post.commentCount}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
