import { FeedbackPost } from '@/lib/db';
import { RoadmapCard } from './roadmap-card';

interface RoadmapColumnProps {
  title: string;
  count: number;
  colorDotClass: string;
  posts: FeedbackPost[];
}

export function RoadmapColumn({ title, count, colorDotClass, posts }: RoadmapColumnProps) {
  return (
    <div className="bg-base-200/40 border border-base-200/80 rounded-2xl p-4 flex flex-col gap-3 min-h-[500px]">
      {/* Column Header */}
      <div className="flex items-center justify-between pb-2 border-b border-base-200/60">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${colorDotClass}`} />
          <h2 className="font-semibold text-sm text-base-content">{title}</h2>
        </div>
        <span className="badge badge-sm badge-ghost text-xs font-semibold px-2">
          {count}
        </span>
      </div>

      {/* Cards Stack */}
      <div className="flex flex-col gap-3">
        {posts.length > 0 ? (
          posts.map((post) => <RoadmapCard key={post.id} post={post} />)
        ) : (
          <div className="text-center py-10 text-xs text-base-content/40">
            No items in this column
          </div>
        )}
      </div>
    </div>
  );
}
