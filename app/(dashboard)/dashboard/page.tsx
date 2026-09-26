import type { Metadata } from 'next';
import { ChevronDown } from 'lucide-react';
import { MetricCards } from '@/features/dashboard/components/metric-cards';
import { RecentFeedbackTable } from '@/features/dashboard/components/recent-feedback-table';
import { CategoryDonut } from '@/features/dashboard/components/category-donut';

export const metadata: Metadata = {
  title: 'Overview Dashboard',
  description: "Here's what's happening with your product.",
};

export default function DashboardOverviewPage() {
  return (
    <main className="p-6 sm:p-8 max-w-6xl w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight mb-1">
            Overview
          </h1>
          <p className="text-sm text-base-content/60">
            Here&apos;s what&apos;s happening with your product.
          </p>
        </div>

        {/* Date Filter Dropdown */}
        <div className="flex items-center gap-2">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-sm btn-ghost border border-base-200 gap-2 font-normal text-xs rounded-xl"
            >
              <span>Last 7 days</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-10 w-40 p-1.5 shadow-lg border border-base-200 text-xs"
            >
              <li>
                <button className="active">Last 7 days</button>
              </li>
              <li>
                <button>Last 30 days</button>
              </li>
              <li>
                <button>All time</button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <MetricCards />

      {/* Recent Feedback & Donut Chart Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <RecentFeedbackTable />
        </div>
        <div className="lg:col-span-1">
          <CategoryDonut />
        </div>
      </div>
    </main>
  );
}
