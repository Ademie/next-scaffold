'use client';

import { useOptimistic, useTransition } from 'react';
import { ChevronUp } from 'lucide-react';
import { toggleUpvoteAction } from '../actions';

interface UpvoteButtonProps {
  postId: string;
  initialCount: number;
  initialUpvoted?: boolean;
}

export function UpvoteButton({ postId, initialCount, initialUpvoted = false }: UpvoteButtonProps) {
  const [isPending, startTransition] = useTransition();

  const [optimisticState, setOptimisticState] = useOptimistic(
    { count: initialCount, upvoted: initialUpvoted },
    (state) => ({
      count: state.upvoted ? state.count - 1 : state.count + 1,
      upvoted: !state.upvoted,
    })
  );

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    startTransition(async () => {
      setOptimisticState((prev: { count: number; upvoted: boolean }) => ({
        count: prev.upvoted ? prev.count - 1 : prev.count + 1,
        upvoted: !prev.upvoted,
      }));
      try {
        await toggleUpvoteAction(postId);
      } catch (err) {
        console.error('Failed to toggle upvote:', err);
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      aria-label={`Upvote. Current count: ${optimisticState.count}`}
      className={`flex flex-col items-center justify-center min-w-[50px] px-2 py-2 rounded-xl border transition-all text-xs font-semibold ${
        optimisticState.upvoted
          ? 'bg-primary text-primary-content border-primary shadow-sm'
          : 'bg-base-100 hover:bg-base-200/80 border-base-200 text-base-content/80 hover:text-base-content hover:border-primary/40'
      }`}
    >
      <ChevronUp className={`w-4 h-4 transition-transform ${optimisticState.upvoted ? 'scale-110' : ''}`} />
      <span className="font-bold text-sm tracking-tight">{optimisticState.count}</span>
    </button>
  );
}
