export default function TableSkeleton({ rows = 6 }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-panel">
      <div className="grid grid-cols-6 gap-3 border-b border-slate-200 bg-slate-50 p-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="skeleton h-4 animate-shimmer rounded" />
        ))}
      </div>
      <div className="space-y-2 p-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="grid grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((__, c) => (
              <div key={c} className="skeleton h-4 animate-shimmer rounded" />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
