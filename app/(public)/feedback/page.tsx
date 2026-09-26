import { Suspense } from 'react';
import { Navbar } from '@/components/ui/navbar';
import { getFeedbackPostsQuery } from '@/features/feedback/queries';
import { FeedbackCard } from '@/features/feedback/components/feedback-card';
import { HeroSearch } from '@/features/feedback/components/hero-search';
import { FeedbackTabs } from '@/features/feedback/components/feedback-tabs';
import { SubmitFeedbackModal } from '@/features/feedback/components/submit-feedback-modal';

interface PageProps {
  searchParams: Promise<{
    q?: string;
    sort?: 'popular' | 'newest' | 'voted';
    category?: string;
  }>;
}

export default async function FeedbackPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const posts = await getFeedbackPostsQuery({
    query: params.q,
    sort: params.sort,
    category: params.category,
  });

  return (
    <>
      <Navbar activeTab="feedback" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-10">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary mb-2 inline-block">
            Build a better product, together
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight mb-3">
            What should we build next?
          </h1>
          <p className="text-base text-base-content/70">
            Share your ideas, vote on what matters, and see our roadmap in real time.
          </p>
        </div>

        {/* Search & Submit Action Bar */}
        <Suspense fallback={<div className="h-14 bg-base-200/50 rounded-xl my-6 animate-pulse" />}>
          <HeroSearch />
        </Suspense>

        {/* Filter & Sort Control Bar */}
        <Suspense fallback={<div className="h-10 bg-base-200/50 rounded-lg mb-6 animate-pulse" />}>
          <FeedbackTabs />
        </Suspense>

        {/* Feedback Feed */}
        <div className="flex flex-col gap-3.5">
          {posts.length > 0 ? (
            posts.map((post) => <FeedbackCard key={post.id} post={post} />)
          ) : (
            <div className="text-center py-16 border border-dashed border-base-300 rounded-2xl">
              <p className="text-base font-medium text-base-content/70 mb-1">No feedback found</p>
              <p className="text-xs text-base-content/50">
                Try searching for something else or submit the first request!
              </p>
            </div>
          )}
        </div>

        {/* Modal (Triggered by URL state ?modal=submit-feedback) */}
        <Suspense fallback={null}>
          <SubmitFeedbackModal />
        </Suspense>
      </main>
    </>
  );
}
