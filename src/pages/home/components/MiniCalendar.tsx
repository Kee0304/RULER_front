import { useState } from 'react';

const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];

// June 2026: starts on Monday (offset 1 from Sunday)
const JUNE_2026_OFFSET = 1;
const JUNE_2026_DAYS = 30;

const PUBLIC_HOLIDAY = 6;
const RECOMMENDED = 7;

interface DayInfo {
  day: number;
  isHoliday: boolean;
  isRecommended: boolean;
  isWeekend: boolean;
  isToday: boolean;
}

function buildCalendarDays(): (DayInfo | null)[] {
  const cells: (DayInfo | null)[] = [];
  for (let i = 0; i < JUNE_2026_OFFSET; i++) cells.push(null);
  for (let d = 1; d <= JUNE_2026_DAYS; d++) {
    const dayIndex = (JUNE_2026_OFFSET + d - 1) % 7;
    cells.push({
      day: d,
      isHoliday: d === PUBLIC_HOLIDAY,
      isRecommended: d === RECOMMENDED,
      isWeekend: dayIndex === 0 || dayIndex === 6,
      isToday: false,
    });
  }
  return cells;
}

interface MiniCalendarProps {
  onNavigate?: () => void;
}

export default function MiniCalendar({ onNavigate }: MiniCalendarProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(RECOMMENDED);
  const cells = buildCalendarDays();

  return (
    <div className="bg-white rounded-xl shadow-widget border border-slate-100 p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[13px] font-semibold text-slate-800">휴가 캘린더</p>
          <p className="text-[11px] text-slate-500 mt-0.5">2026년 6월</p>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
            <i className="ri-arrow-left-s-line text-base" />
          </button>
          <span className="text-[12px] font-semibold text-slate-700 px-1">2026년 6월</span>
          <button className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
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
          <div key={d} className="text-center text-[10px] font-semibold text-slate-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((cell, idx) => {
          if (!cell) return <div key={`empty-${idx}`} />;
          const isSelected = selectedDay === cell.day;

          return (
            <div key={cell.day} className="flex items-center justify-center py-0.5">
              <button
                onClick={() => setSelectedDay(cell.day)}
                className={`w-7 h-7 rounded-full text-[12px] font-medium flex items-center justify-center cursor-pointer transition-all relative
                  ${cell.isRecommended
                    ? 'animate-recommended text-teal-700 font-bold ring-1 ring-teal-400'
                    : cell.isHoliday
                    ? 'bg-amber-100 text-amber-700 font-semibold ring-1 ring-amber-300'
                    : isSelected
                    ? 'bg-navy-900 text-white'
                    : cell.isWeekend
                    ? 'text-slate-400 hover:bg-slate-50'
                    : 'text-slate-700 hover:bg-slate-50'
                  }
                `}
              >
                {cell.day}
                {cell.isRecommended && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-teal-400 rounded-full border border-white" />
                )}
                {cell.isHoliday && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full border border-white" />
                )}
              </button>
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
            6월 7일 (공휴일 6일 다음 날) — 4일 연속 휴가
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