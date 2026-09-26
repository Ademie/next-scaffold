'use client';

import { useState } from 'react';
import { RoadmapData } from '../queries';
import { RoadmapColumn } from './roadmap-column';

interface RoadmapBoardProps {
  data: RoadmapData;
}

export function RoadmapBoard({ data }: RoadmapBoardProps) {
  const [mobileColumn, setMobileColumn] = useState<'planned' | 'inProgress' | 'completed'>('planned');

  return (
    <div>
      {/* Mobile Column Tabs (Visible only on small screens) */}
      <div className="md:hidden flex items-center p-1 bg-base-200/60 rounded-xl mb-6 border border-base-200">
        <button
          onClick={() => setMobileColumn('planned')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            mobileColumn === 'planned'
              ? 'bg-base-100 text-base-content shadow-xs'
              : 'text-base-content/60'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-info" />
          <span>Planned</span>
          <span className="badge badge-xs badge-ghost font-normal">{data.counts.planned}</span>
        </button>

        <button
          onClick={() => setMobileColumn('inProgress')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            mobileColumn === 'inProgress'
              ? 'bg-base-100 text-base-content shadow-xs'
              : 'text-base-content/60'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-warning" />
          <span>In Progress</span>
          <span className="badge badge-xs badge-ghost font-normal">{data.counts.inProgress}</span>
        </button>

        <button
          onClick={() => setMobileColumn('completed')}
          className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
            mobileColumn === 'completed'
              ? 'bg-base-100 text-base-content shadow-xs'
              : 'text-base-content/60'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-success" />
          <span>Completed</span>
          <span className="badge badge-xs badge-ghost font-normal">{data.counts.completed}</span>
        </button>
      </div>

      {/* Mobile Active Column View */}
      <div className="md:hidden">
        {mobileColumn === 'planned' && (
          <RoadmapColumn
            title="Planned"
            count={data.counts.planned}
            colorDotClass="bg-info"
            posts={data.planned}
          />
        )}
        {mobileColumn === 'inProgress' && (
          <RoadmapColumn
            title="In Progress"
            count={data.counts.inProgress}
            colorDotClass="bg-warning"
            posts={data.inProgress}
          />
        )}
        {mobileColumn === 'completed' && (
          <RoadmapColumn
            title="Completed"
            count={data.counts.completed}
            colorDotClass="bg-success"
            posts={data.completed}
          />
        )}
      </div>

      {/* Desktop 3-Column Grid */}
      <div className="hidden md:grid md:grid-cols-3 gap-6 items-start">
        <RoadmapColumn
          title="Planned"
          count={data.counts.planned}
          colorDotClass="bg-info"
          posts={data.planned}
        />
        <RoadmapColumn
          title="In Progress"
          count={data.counts.inProgress}
          colorDotClass="bg-warning"
          posts={data.inProgress}
        />
        <RoadmapColumn
          title="Completed"
          count={data.counts.completed}
          colorDotClass="bg-success"
          posts={data.completed}
        />
      </div>
    </div>
  );
}
