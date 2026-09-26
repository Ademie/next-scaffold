'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useTransition } from 'react';

const CATEGORIES = [
  { value: 'all', label: 'All categories' },
  { value: 'API', label: 'API' },
  { value: 'UI', label: 'UI' },
  { value: 'Integrations', label: 'Integrations' },
  { value: 'Security', label: 'Security' },
  { value: 'Mobile', label: 'Mobile' },
  { value: 'Analytics', label: 'Analytics' },
  { value: 'Productivity', label: 'Productivity' },
];

export function FeedbackTabs() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [, startTransition] = useTransition();

  const currentSort = searchParams.get('sort') || 'popular';
  const currentCategory = searchParams.get('category') || 'all';

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== 'popular' && value !== 'all') {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    startTransition(() => {
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-200 pb-3 mb-6">
      {/* Sorting Tabs */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => updateParam('sort', 'popular')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            currentSort === 'popular'
              ? 'bg-base-200 text-base-content font-semibold'
              : 'text-base-content/60 hover:text-base-content hover:bg-base-200/50'
          }`}
        >
          Popular
        </button>
        <button
          onClick={() => updateParam('sort', 'newest')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            currentSort === 'newest'
              ? 'bg-base-200 text-base-content font-semibold'
              : 'text-base-content/60 hover:text-base-content hover:bg-base-200/50'
          }`}
        >
          Newest
        </button>
        <button
          onClick={() => updateParam('sort', 'voted')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            currentSort === 'voted'
              ? 'bg-base-200 text-base-content font-semibold'
              : 'text-base-content/60 hover:text-base-content hover:bg-base-200/50'
          }`}
        >
          My votes
        </button>
      </div>

      {/* Category Dropdown Filter */}
      <div className="relative inline-block text-left">
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-sm btn-ghost border border-base-200 gap-2 font-normal text-xs rounded-lg text-base-content/80"
          >
            <span>{CATEGORIES.find((c) => c.value.toLowerCase() === currentCategory.toLowerCase())?.label || 'All categories'}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-10 w-48 p-1.5 shadow-lg border border-base-200 text-xs"
          >
            {CATEGORIES.map((cat) => (
              <li key={cat.value}>
                <button
                  onClick={() => updateParam('category', cat.value)}
                  className={currentCategory.toLowerCase() === cat.value.toLowerCase() ? 'active' : ''}
                >
                  {cat.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
