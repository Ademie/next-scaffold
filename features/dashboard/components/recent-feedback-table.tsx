import Link from 'next/link';
import { db } from '@/lib/db';
import { StatusDropdown } from './status-dropdown';

export function RecentFeedbackTable() {
  const posts = db.posts.slice(0, 5);

  return (
    <div className="card bg-base-100 border border-base-200/90 rounded-2xl p-5 shadow-xs flex-1">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-bold text-base-content">
          Recent feedback
        </h2>
        <Link
          href="/feedback"
          className="text-xs font-semibold text-primary hover:underline"
        >
          View all
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full text-xs">
          <thead>
            <tr className="border-b border-base-200 text-base-content/50 uppercase text-[10px] tracking-wider font-semibold">
              <th className="pl-0">Title</th>
              <th>Status</th>
              <th className="text-right">Votes</th>
              <th className="text-right pr-0">Comments</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-base-200/60">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-base-200/30 transition-colors">
                <td className="pl-0 font-medium text-base-content max-w-[220px] truncate">
                  <Link
                    href={`/posts/${post.id}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </td>
                <td>
                  <StatusDropdown postId={post.id} currentStatus={post.status} />
                </td>
                <td className="text-right font-semibold text-base-content">
                  {post.upvoteCount}
                </td>
                <td className="text-right pr-0 text-base-content/70">
                  {post.commentCount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
