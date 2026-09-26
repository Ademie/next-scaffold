import { ArrowUpRight } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
}

function MetricCard({ title, value, change }: MetricCardProps) {
  return (
    <div className="card bg-base-100 border border-base-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between text-xs text-base-content/60 font-medium mb-2">
        <span>{title}</span>
      </div>
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold text-base-content tracking-tight">
          {value}
        </span>
        <div className="flex items-center gap-0.5 text-xs font-bold text-success bg-success/10 px-2 py-0.5 rounded-full">
          <ArrowUpRight className="w-3 h-3" />
          <span>{change}</span>
        </div>
      </div>
    </div>
  );
}

export function MetricCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard title="Total feedback" value="248" change="12%" />
      <MetricCard title="New this week" value="62" change="28%" />
      <MetricCard title="Upvotes" value="1.4k" change="20%" />
      <MetricCard title="Comments" value="312" change="16%" />
    </div>
  );
}
