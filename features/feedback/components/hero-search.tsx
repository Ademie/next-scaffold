'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Search, Plus } from 'lucide-react';
import { useTransition } from 'react';

export function HeroSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const currentQuery = searchParams.get('q') || '';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('q', value);
    } else {
      params.delete('q');
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const openSubmitModal = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('modal', 'submit-feedback');
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full max-w-2xl mx-auto my-6">
      <div className="relative flex-1">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40 pointer-events-none" />
        <input
          type="text"
          defaultValue={currentQuery}
          onChange={handleSearchChange}
          placeholder="Search feedback..."
          className="input input-bordered w-full pl-10 pr-4 bg-base-100 border-base-200 focus:border-primary shadow-sm rounded-xl text-sm"
        />
      </div>

      <button
        onClick={openSubmitModal}
        className="btn btn-primary gap-2 shadow-sm rounded-xl font-medium"
      >
        <Plus className="w-4 h-4" />
        Submit feedback
      </button>
    </div>
  );
}
