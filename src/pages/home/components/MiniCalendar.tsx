import { useState, useEffect } from 'react';
import { useApiFetch } from '@/hooks/useApiFetch';
import { ScheduleItem, ScheduleType } from '@/mocks/scheduleItems';

const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

const typeColorMap: Record<ScheduleType, string> = {
  '휴가': 'bg-teal-100 text-teal-700',
  '반차': 'bg-teal-50 text-teal-600',
  '회의': 'bg-amber-100 text-amber-700',
  '출장': 'bg-orange-100 text-orange-700',
  '기타': 'bg-slate-100 text-slate-600',
};

interface MiniCalendarProps {
  onNavigate?: () => void;
}

const PUBLIC_HOLIDAY_DAY = 5;
const RECOMMENDED_DAY = 6;

function CalendarSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-widget border border-slate-100 p-5 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-4 w-20 bg-slate-100 rounded" />
          <div className="h-3 w-14 bg-slate-100 rounded" />
        </div>
        <div className="h-7 w-7 bg-slate-100 rounded-lg" />
      </div>
      <div className="flex items-center gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-100" />
            <div className="h-2.5 w-10 bg-slate-100 rounded" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {DAYS_OF_WEEK.map((d) => (
          <div key={d} className="h-4 bg-slate-100 rounded mb-1 mx-1" />
        ))}
        {Array.from({ length: 35 }).map((_, i) => (
          <div key={i} className="h-7 w-7 mx-auto bg-slate-100 rounded-full" />
        ))}
      </div>
      <div className="h-16 bg-slate-100 rounded-lg" />
      <div className="h-9 bg-slate-100 rounded-lg" />
    </div>
  );
}

export default function MiniCalendar({ onNavigate }: MiniCalendarProps) {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(RECOMMENDED_DAY);

  const displayMonth = `${currentYear}년 ${currentMonth + 1}월`;
  const monthLabel = `${currentMonth + 1}월`;
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOffset = new Date(currentYear, currentMonth, 1).getDay();

  useEffect(() => {
    if (selectedDay !== null && selectedDay > daysInMonth) {
      setSelectedDay(null);
    }
  }, [selectedDay, daysInMonth]);

  const { data: items, loading } = useApiFetch<ScheduleItem[]>('/api/schedule/items', []);

  if (loading) {
    return <CalendarSkeleton />;
  }

  const cells: (number | null)[] = [
    ...Array(firstDayOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const getItems = (day: number) => {
    const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return items.filter((item) => item.date === date);
  };

  const getDayIndex = (day: number) => (firstDayOffset + day - 1) % 7;

  const goPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-widget border border-slate-100 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[13px] font-semibold text-slate-800">휴가 캘린더</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{displayMonth}</p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={goPrevMonth}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <i className="ri-arrow-left-s-line text-base" />
          </button>
          <span className="text-[12px] font-semibold text-slate-700 px-1">{displayMonth}</span>
          <button
            onClick={goNextMonth}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors"
          >
            <i className="ri-arrow-right-s-line text-base" />
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
          <span className="text-[10px] text-slate-500">공휴일</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-teal-400 inline-block" />
          <span className="text-[10px] text-slate-500">AI 추천</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" />
          <span className="text-[10px] text-slate-500">선택됨</span>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS_OF_WEEK.map((d) => (
          <div
            key={d}
            className={`text-center text-[10px] font-semibold py-1 ${
              d === '일' ? 'text-red-500' : 'text-slate-400'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((cell, idx) => {
          if (!cell) return <div key={`empty-${idx}`} />;
          const dayItems = getItems(cell);
          const isSelected = selectedDay === cell;
          const isHoliday = cell === PUBLIC_HOLIDAY_DAY;
          const isRec = cell === RECOMMENDED_DAY;
          const di = getDayIndex(cell);
          const isWeekend = di === 0 || di === 6;

          return (
            <div key={cell} className="flex flex-col items-center py-0.5">
              <button
                onClick={() => setSelectedDay(cell)}
                className={`w-7 h-7 rounded-full text-[12px] font-medium flex items-center justify-center cursor-pointer transition-all relative
                  ${isHoliday
                    ? 'bg-amber-100 text-red-500 font-semibold ring-1 ring-amber-300'
                    : isRec
                    ? 'animate-recommended text-teal-700 font-bold'
                    : isSelected
                    ? 'bg-navy-900 text-white'
                    : di === 0
                    ? 'text-red-500 hover:bg-slate-50'
                    : isWeekend
                    ? 'text-slate-400 hover:bg-slate-50'
                    : 'text-slate-700 hover:bg-slate-50'
                  }
                `}
              >
                {cell}
                {isRec && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-teal-400 rounded-full border border-white" />
                )}
                {isHoliday && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full border border-white" />
                )}
              </button>
              {dayItems.length > 0 && (
                <div className="flex justify-center gap-0.5 mt-0.5">
                  {dayItems.slice(0, 3).map((item, i) => (
                    <span
                      key={i}
                      className={`w-1 h-1 rounded-full ${typeColorMap[item.type]?.split(' ')[0] || 'bg-slate-300'}`}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI recommendation note */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-2 bg-teal-50 rounded-lg p-2.5">
        <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
          <i className="ri-sparkling-line text-teal-500 text-sm" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-teal-700">AI 추천 휴가 슬롯</p>
          <p className="text-[10px] text-teal-600 mt-0.5">
            {monthLabel} {RECOMMENDED_DAY}일 (공휴일 {PUBLIC_HOLIDAY_DAY}일 다음 날) — 4일 연속 휴가
          </p>
        </div>
        {onNavigate && (
          <button
            onClick={onNavigate}
            className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md text-teal-500 hover:bg-teal-100 cursor-pointer transition-colors"
            title="내 휴가 & 일정으로 이동"
          >
            <i className="ri-arrow-right-line text-sm" />
          </button>
        )}
      </div>

      {onNavigate && (
        <button
          onClick={onNavigate}
          className="mt-2 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-teal-100 bg-teal-50 text-[12px] font-medium text-teal-600 hover:bg-teal-100 cursor-pointer transition-colors whitespace-nowrap"
        >
          <i className="ri-calendar-event-line text-sm" />
          일정 수정하기
          <i className="ri-arrow-right-line text-xs" />
        </button>
      )}
    </div>
  );
}