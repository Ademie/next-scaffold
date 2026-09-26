'use client';

import { useTransition } from 'react';
import { PostStatus } from '@/lib/db';
import { updatePostStatusAction } from '../actions';

interface StatusDropdownProps {
  postId: string;
  currentStatus: PostStatus;
}

export function StatusDropdown({ postId, currentStatus }: StatusDropdownProps) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as PostStatus;
    startTransition(async () => {
      try {
        await updatePostStatusAction(postId, newStatus);
      } catch (err) {
        console.error('Failed to update status:', err);
      }
    });
  };

  const getBadgeClass = (status: PostStatus) => {
    switch (status) {
      case 'PLANNED':
        return 'text-info';
      case 'IN_PROGRESS':
        return 'text-warning';
      case 'UNDER_REVIEW':
        return 'text-secondary';
      case 'COMPLETED':
        return 'text-success';
      case 'CLOSED':
        return 'text-base-content/40';
    }
  };

  return (
    <select
      value={currentStatus}
      onChange={handleStatusChange}
      disabled={isPending}
      className={`select select-xs select-ghost border border-base-200 font-semibold rounded-md text-xs cursor-pointer ${getBadgeClass(
        currentStatus
      )}`}
    >
      <option value="UNDER_REVIEW">Under Review</option>
      <option value="PLANNED">Planned</option>
      <option value="IN_PROGRESS">In Progress</option>
      <option value="COMPLETED">Completed</option>
      <option value="CLOSED">Closed</option>
    </select>
  );
}
