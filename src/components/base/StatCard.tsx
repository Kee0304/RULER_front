import StatCardSkeleton from '@/components/base/StatCardSkeleton';
import { UserHR } from '@/pages/home/page';
import { useEffect, useState } from 'react';

export default function StatCard({ userHR }: {userHR:UserHR}) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState(
    [
      { label: '연차 잔여', value: '0일', sub: '총 0일 중', icon: 'ri-calendar-2-line', color: 'text-teal-500', bg: 'bg-teal-50' },
      { label: '색인 문서', value: '0개', sub: '전체 0개 중', icon: 'ri-file-text-line', color: 'text-amber-500', bg: 'bg-amber-50' },
      { label: '승인 대기', value: '0건', sub: '현재 없음', icon: 'ri-time-line', color: 'text-rose-500', bg: 'bg-rose-50' },
      { label: '오늘 AI 질의', value: '0회', sub: 'RAG 기반 응답', icon: 'ri-robot-2-line', color: 'text-orange-500', bg: 'bg-orange-50' },
    ]
  )

  useEffect(() => {
    if (userHR) {
      setItems(
        [
          { label: '연차 잔여', value: userHR.leave.remaining+'일', sub: '총 '+userHR.leave.total+'일 중', icon: 'ri-calendar-2-line', color: 'text-teal-500', bg: 'bg-teal-50' },
          { label: '색인 문서', value: '0개', sub: '전체 0개 중', icon: 'ri-file-text-line', color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: '승인 대기', value: '0건', sub: '현재 없음', icon: 'ri-time-line', color: 'text-rose-500', bg: 'bg-rose-50' },
          { label: '오늘 AI 질의', value: '0회', sub: 'RAG 기반 응답', icon: 'ri-robot-2-line', color: 'text-orange-500', bg: 'bg-orange-50' },
        ]
      )
      setLoading(false);
    }
  },[userHR])

  return (
    (
    !loading &&
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
    )
  );
}