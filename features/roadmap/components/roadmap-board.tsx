import { RoadmapData } from '../queries';
import { RoadmapColumn } from './roadmap-column';

interface RoadmapBoardProps {
  data: RoadmapData;
}

export function RoadmapBoard({ data }: RoadmapBoardProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
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
  );
}
