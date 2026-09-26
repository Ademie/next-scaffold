'use client';

const CATEGORIES = [
  { name: 'UI', percentage: 28, color: '#3B82F6' },
  { name: 'API', percentage: 22, color: '#10B981' },
  { name: 'Integrations', percentage: 18, color: '#8B5CF6' },
  { name: 'Security', percentage: 14, color: '#F59E0B' },
  { name: 'Mobile', percentage: 10, color: '#EF4444' },
  { name: 'Other', percentage: 8, color: '#6B7280' },
];

export function CategoryDonut() {
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  let strokeOffset = 0;

  return (
    <div className="card bg-base-100 border border-base-200/90 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
      <h2 className="text-sm font-bold text-base-content mb-4">
        Feedback by category
      </h2>

      {/* Donut Chart Display */}
      <div className="relative w-40 h-40 mx-auto my-2 flex items-center justify-center">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="18"
            className="text-base-200/40"
          />

          {CATEGORIES.map((cat) => {
            const strokeDash = (cat.percentage / 100) * circumference;
            const currentOffset = strokeOffset;
            strokeOffset -= strokeDash;

            return (
              <circle
                key={cat.name}
                cx="70"
                cy="70"
                r={radius}
                fill="transparent"
                stroke={cat.color}
                strokeWidth="18"
                strokeDasharray={`${strokeDash} ${circumference - strokeDash}`}
                strokeDashoffset={currentOffset}
                className="transition-all hover:opacity-80"
              />
            );
          })}
        </svg>

        {/* Center label */}
        <div className="absolute flex flex-col items-center">
          <span className="text-xl font-extrabold text-base-content">100%</span>
          <span className="text-[10px] text-base-content/50 uppercase font-bold tracking-wider">
            Total
          </span>
        </div>
      </div>

      {/* Legend List */}
      <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-base-200/80 text-xs">
        {CATEGORIES.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between py-0.5">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-base-content/70">{cat.name}</span>
            </div>
            <span className="font-semibold text-base-content">{cat.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
