import type { Metadata } from 'next';
import { db } from '@/lib/db';

export const metadata: Metadata = {
  title: 'Changelog',
  description: 'See the latest updates, features, and improvements we have launched.',
};

export default function ChangelogPage() {
  const completedPosts = db.posts.filter((p) => p.status === 'COMPLETED');

  return (
    <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight mb-2">
          Changelog
        </h1>
        <p className="text-xs sm:text-sm text-base-content/70">
          See what we&apos;ve shipped and how our product is improving every week.
        </p>
      </div>

      <div className="flex flex-col gap-6 sm:gap-8">
        <div className="card bg-base-100 border border-base-200 p-5 sm:p-6 rounded-2xl shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <span className="badge badge-success badge-sm font-semibold">v2.4.0 Release</span>
            <span className="text-xs text-base-content/50">March 2026</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-base-content mb-3">
            SSO Support, Comment Voting &amp; Real-time Updates
          </h2>
          <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed mb-4">
            We are excited to deliver several highly requested enterprise capabilities from our public roadmap.
          </p>

          <div className="flex flex-col gap-2 pt-3 border-t border-base-200">
            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider">
              Completed from community requests:
            </span>
            <div className="flex flex-wrap gap-2">
              {completedPosts.map((p) => (
                <span key={p.id} className="badge badge-neutral badge-outline badge-sm text-xs">
                  {p.title}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
