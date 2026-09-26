import type { Metadata } from 'next';
import { getRoadmapBoardQuery } from '@/features/roadmap/queries';
import { RoadmapBoard } from '@/features/roadmap/components/roadmap-board';

export const metadata: Metadata = {
  title: 'Public Roadmap',
  description: "See what we're working on and what's coming next.",
  openGraph: {
    title: 'Public Product Roadmap | FeaturePulse',
    description: "See what we're working on and what's coming next.",
  },
};

export default async function RoadmapPage() {
  const data = await getRoadmapBoardQuery();

  return (
    <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight mb-1.5">
          Roadmap
        </h1>
        <p className="text-xs sm:text-sm text-base-content/70">
          See what we&apos;re working on and what&apos;s coming next.
        </p>
      </div>

      {/* Responsive Kanban Board */}
      <RoadmapBoard data={data} />
    </main>
  );
}
