'use client';

import { useOptimistic, useTransition } from 'react';
import { ArrowUp } from 'lucide-react';
import { toggleUpvoteAction } from '../actions';

interface LargeUpvoteWidgetProps {
  postId: string;
  initialCount: number;
  initialUpvoted?: boolean;
}

export function LargeUpvoteWidget({ postId, initialCount, initialUpvoted = false }: LargeUpvoteWidgetProps) {
  const [isPending, startTransition] = useTransition();

  const [optimisticState, setOptimisticState] = useOptimistic(
    { count: initialCount, upvoted: initialUpvoted },
    (prev: { count: number; upvoted: boolean }) => ({
      count: prev.upvoted ? prev.count - 1 : prev.count + 1,
      upvoted: !prev.upvoted,
    })
  );

  const handleToggle = () => {
    startTransition(async () => {
      setOptimisticState((prev: { count: number; upvoted: boolean }) => ({
        count: prev.upvoted ? prev.count - 1 : prev.count + 1,
        upvoted: !prev.upvoted,
      }));
      try {
        await toggleUpvoteAction(postId);
      } catch (err) {
        console.error('Failed to toggle vote:', err);
      }
    });
  };

  return (
    <div className="card bg-base-100 border border-base-200/90 rounded-2xl p-4 flex flex-col items-center justify-center min-w-[110px] shadow-xs">
      <ArrowUp className={`w-5 h-5 mb-1 ${optimisticState.upvoted ? 'text-primary' : 'text-base-content/70'}`} />
      <span className="text-2xl font-bold tracking-tight text-base-content mb-2">
        {optimisticState.count}
      </span>
      <button
        onClick={handleToggle}
        disabled={isPending}
        className={`btn btn-sm w-full font-semibold rounded-lg transition-colors ${
          optimisticState.upvoted
            ? 'btn-primary'
            : 'btn-neutral'
        }`}
      >
        {optimisticState.upvoted ? 'Upvoted' : 'Upvote'}
      </button>
    </div>
  );
}
