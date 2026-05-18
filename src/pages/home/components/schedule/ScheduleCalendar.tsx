import { ScheduleItem, ScheduleType } from '@/mocks/scheduleItems';

const DAYS_OF_WEEK = ['일', '월', '화', '수', '목', '금', '토'];
const JUNE_OFFSET = 1;
const JUNE_DAYS = 30;
const PUBLIC_HOLIDAY_DAY = 6;
const RECOMMENDED_DAY = 7;

const typeColorMap: Record<ScheduleType, string> = {
  '휴가': 'bg-teal-100 text-teal-700',
  '반차': 'bg-teal-50 text-teal-600',
  '회의': 'bg-amber-100 text-amber-700',
  '출장': 'bg-orange-100 text-orange-700',
  '기타': 'bg-slate-100 text-slate-600',
};

interface ScheduleCalendarProps {
  items: ScheduleItem[];
  selectedDay: number | null;
  onSelectDay: (day: number) => void;
  onDoubleClickDay: (day: number) => void;
}

export default function ScheduleCalendar({
  items,
  selectedDay,
  onSelectDay,
  onDoubleClickDay,
}: ScheduleCalendarProps) {
  const cells: (number | null)[] = [
    ...Array(JUNE_OFFSET).fill(null),
    ...Array.from({ length: JUNE_DAYS }, (_, i) => i + 1),
  ];

  const getItems = (day: number) => {
    const date = `2026-06-${String(day).padStart(2, '0')}`;
    return items.filter((item) => item.date === date);
  };

  const getDayIndex = (day: number) => (JUNE_OFFSET + day - 1) % 7;

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <div>
          <p className="text-[14px] font-semibold text-slate-800">2026년 6월 일정</p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            날짜 클릭 → 일정 확인 &nbsp;·&nbsp; 더블클릭 → 빠른 추가
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {(['휴가', '회의', '출장', '기타'] as ScheduleType[]).map((t) => (
              <span key={t} className="flex items-center gap-1 text-[10px] text-slate-500">
                <span className={`w-2 h-2 rounded inline-block ${typeColorMap[t].split(' ')[0]}`} />
                {t}
              </span>
            ))}
          </div>
          <div className="flex gap-1">
            <button className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 cursor-pointer transition-colors">
              <i className="ri-arrow-left-s-line text-base" />
            </button>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 cursor-pointer transition-colors">
              <i className="ri-arrow-right-s-line text-base" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-100 pb-1 mb-1 flex-shrink-0">
        {DAYS_OF_WEEK.map((d, i) => (
          <div
            key={d}
            className={`text-center text-[11px] font-semibold py-1 ${
              i === 0 ? 'text-red-400' : i === 6 ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 flex-1" style={{ gridAutoRows: '1fr' }}>
        {cells.map((day, idx) => {
          if (!day) return <div key={`e-${idx}`} />;
          const dayItems = getItems(day);
          const isSelected = selectedDay === day;
          const isHoliday = day === PUBLIC_HOLIDAY_DAY;
          const isRec = day === RECOMMENDED_DAY;
          const di = getDayIndex(day);
          const isWeekend = di === 0 || di === 6;

          return (
            <div
              key={day}
              onClick={() => onSelectDay(day)}
              onDoubleClick={() => onDoubleClickDay(day)}
              className={`rounded-lg p-1 cursor-pointer transition-all border
                ${isSelected
                  ? 'bg-navy-900/5 border-navy-900/15'
                  : 'border-transparent hover:bg-slate-50 hover:border-slate-200'
                }
              `}
            >
              <div
                className={`w-6 h-6 flex items-center justify-center rounded-full text-[12px] font-medium mb-0.5 transition-all
                  ${isHoliday
                    ? 'bg-amber-100 text-amber-700'
                    : isRec
                    ? 'animate-recommended text-teal-700 font-bold'
                    : isSelected
                    ? 'bg-navy-900 text-white'
                    : isWeekend
                    ? 'text-slate-400'
                    : 'text-slate-700'
                  }
                `}
              >
                {day}
              </div>
              <div className="space-y-0.5">
                {dayItems.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className={`text-[9px] truncate rounded px-1 py-0.5 leading-tight ${typeColorMap[item.type]}`}
                  >
                    {item.title}
                  </div>
                ))}
                {dayItems.length > 2 && (
                  <div className="text-[9px] text-slate-400 px-1">+{dayItems.length - 2}개</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}