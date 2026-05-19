import StatCardItem from '@/components/base/StatCardItem';
import StatCardSkeleton from '@/components/base/StatCardSkeleton';

interface StatCardProps {
  items: StatCardItem[];
  loading?: boolean;
}

export default function StatCard({ items, loading }: StatCardProps) {
  if (loading) {
    return <StatCardSkeleton />;
  }

  return (
    <div className="grid grid-cols-4 gap-3 flex-shrink-0">
      {items.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-slate-100 px-4 py-3 flex items-center gap-3"
        >
          <div
            className={`w-9 h-9 flex items-center justify-center rounded-xl ${stat.bg} flex-shrink-0`}
          >
            <i className={`${stat.icon} text-base ${stat.color}`} />
          </div>
          <div>
            <p className="text-[18px] font-bold text-slate-800 leading-none">
              {stat.value}
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5 font-medium">
              {stat.label}
            </p>
            {stat.sub && (
              <p className="text-[10px] text-slate-400">{stat.sub}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}