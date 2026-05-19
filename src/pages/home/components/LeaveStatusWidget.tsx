import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useApiFetch } from '@/hooks/useApiFetch';
import DataErrorOverlay from '@/components/base/DataErrorOverlay';

interface LeaveStatusWidgetProps {
  onNavigate?: () => void;
}

interface LeaveStatusData {
  totalDays: number;
  remaining: number;
  breakdown: { label: string; value: string; icon: string; color: string }[];
}

const COLORS = ['#14B8A6', '#E2E8F0'];

function LeaveStatusSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-widget border border-slate-100 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-4 w-20 bg-slate-100 rounded animate-pulse" />
          <div className="h-3 w-14 bg-slate-100 rounded animate-pulse" />
        </div>
        <div className="h-6 w-20 bg-slate-100 rounded-full animate-pulse" />
      </div>
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 rounded-full bg-slate-100 animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <div className="h-3 w-8 bg-slate-100 rounded animate-pulse" />
            <div className="h-3 w-8 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 animate-pulse" />
          <div className="flex justify-between">
            <div className="h-2.5 w-10 bg-slate-100 rounded animate-pulse" />
            <div className="h-2.5 w-10 bg-slate-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
      <div className="pt-3 border-t border-slate-100 space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div className="w-5 h-5 bg-slate-100 rounded animate-pulse" />
            <div className="h-3 w-20 bg-slate-100 rounded animate-pulse flex-1" />
            <div className="h-3 w-8 bg-slate-100 rounded animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LeaveStatusWidget({ onNavigate }: LeaveStatusWidgetProps) {
  const { data, loading, error } = useApiFetch<LeaveStatusData>('/api/leave/status', {
    totalDays: 0,
    remaining: 0,
    breakdown: [
      { label: '연차 잔여일', value: '0일', icon: 'ri-calendar-2-line', color: 'text-teal-500' },
      { label: '병가 잔여일', value: '0일', icon: 'ri-heart-pulse-line', color: 'text-emerald-500' },
      { label: '승인 대기 중', value: '0건', icon: 'ri-time-line', color: 'text-slate-400' },
    ],
  });

  if (loading) {
    return <LeaveStatusSkeleton />;
  }

  const { totalDays, remaining, breakdown } = data;
  const used = totalDays - remaining;
  const pct = Math.round((remaining / totalDays) * 100);

  const donutData = [
    { name: 'Remaining', value: remaining },
    { name: 'Used', value: used },
  ];

  return (
    <div className="bg-white rounded-xl shadow-widget border border-slate-100 p-5 relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[13px] font-semibold text-slate-800">내 휴가 현황</p>
          <p className="text-[11px] text-slate-500 mt-0.5">2026년 연차</p>
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-teal-50 text-teal-600 border border-teal-100 rounded-full px-2.5 py-1">
          <i className="ri-heart-line text-[10px]" />
          선호: 긴 연휴
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* Donut chart */}
        <div className="relative w-24 h-24 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={28}
                outerRadius={44}
                startAngle={90}
                endAngle={-270}
                dataKey="value"
                strokeWidth={0}
              >
                {donutData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[17px] font-bold text-navy-900 leading-none">{remaining}</span>
            <span className="text-[9px] text-slate-500 font-medium mt-0.5">잔여일</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1">
          <div className="flex justify-between text-[12px] mb-1.5">
            <span className="text-slate-500">잔여</span>
            <span className="font-semibold text-teal-600">{pct}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mb-3">
            <div
              className="bg-gradient-to-r from-teal-400 to-teal-500 h-1.5 rounded-full transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500">
            <span>{remaining}일 잔여</span>
            <span>총 {totalDays}일</span>
          </div>
        </div>
      </div>

      {/* Breakdown */}
      <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
        {breakdown.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5">
            <div className={`w-5 h-5 flex items-center justify-center ${item.color}`}>
              <i className={`${item.icon} text-sm`} />
            </div>
            <span className="text-[12px] text-slate-600 flex-1">{item.label}</span>
            <span className="text-[12px] font-semibold text-slate-800">{item.value}</span>
          </div>
        ))}
      </div>

      {onNavigate && (
        <button
          onClick={onNavigate}
          className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-teal-100 bg-teal-50 text-[12px] font-medium text-teal-600 hover:bg-teal-100 cursor-pointer transition-colors whitespace-nowrap"
        >
          <i className="ri-calendar-event-line text-sm" />
          내 휴가 & 일정 보기
          <i className="ri-arrow-right-line text-xs" />
        </button>
      )}

      {error && (
        <DataErrorOverlay
          message="휴가 데이터를 불러올 수 없습니다"
          subMessage={error}
        />
      )}
    </div>
  );
}