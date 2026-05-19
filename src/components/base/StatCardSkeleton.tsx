export default function StatCardSkeleton() {
  return (
    <div className="grid grid-cols-4 gap-3 flex-shrink-0">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex items-center gap-3"
        >
          <div className="w-9 h-9 rounded-xl bg-slate-100 animate-pulse flex-shrink-0" />
          <div className="flex-1 space-y-1.5">
            <div className="h-4 w-14 bg-slate-100 rounded animate-pulse" />
            <div className="h-3 w-10 bg-slate-100 rounded animate-pulse" />
            <div className="h-2.5 w-16 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}