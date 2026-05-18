import { useState } from 'react';
import { scheduleItems as initialItems, ScheduleItem } from '@/mocks/scheduleItems';
import ScheduleCalendar from '@/pages/home/components/schedule/ScheduleCalendar';
import ScheduleSidePanel, { AddTrigger } from '@/pages/home/components/schedule/ScheduleSidePanel';

const TOTAL_LEAVE = 15;
const REMAINING_LEAVE = 4.5;

const stats = [
  {
    label: '연차 잔여',
    value: `${REMAINING_LEAVE}일`,
    sub: `총 ${TOTAL_LEAVE}일 중`,
    icon: 'ri-sun-line',
    color: 'text-teal-500',
    bg: 'bg-teal-50',
  },
  {
    label: '병가 잔여',
    value: '7일',
    sub: '총 10일 중',
    icon: 'ri-heart-pulse-line',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    label: '이번달 일정',
    value: '7건',
    sub: '2026년 6월',
    icon: 'ri-calendar-2-line',
    color: 'text-slate-600',
    bg: 'bg-slate-100',
  },
  {
    label: '승인 대기',
    value: '0건',
    sub: '현재 없음',
    icon: 'ri-time-line',
    color: 'text-slate-400',
    bg: 'bg-slate-50',
  },
];

export default function LeaveSchedulePage() {
  const [items, setItems] = useState<ScheduleItem[]>(initialItems);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [addTrigger, setAddTrigger] = useState<AddTrigger | null>(null);

  const handleAdd = (item: Omit<ScheduleItem, 'id'>) => {
    setItems((prev) => [...prev, { ...item, id: Date.now() }]);
  };

  const handleUpdate = (updated: ScheduleItem) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleDelete = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleDoubleClickDay = (day: number) => {
    const date = `2026-06-${String(day).padStart(2, '0')}`;
    setSelectedDay(day);
    setAddTrigger((prev) => ({ date, seq: (prev?.seq ?? 0) + 1 }));
  };

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        {stats.map((stat) => (
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
              <p className="text-[18px] font-bold text-slate-800 leading-none">{stat.value}</p>
              <p className="text-[11px] text-slate-600 mt-0.5 font-medium">{stat.label}</p>
              <p className="text-[10px] text-slate-400">{stat.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 flex-1 min-h-0">
        <div className="flex-[3] min-h-0">
          <ScheduleCalendar
            items={items}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            onDoubleClickDay={handleDoubleClickDay}
          />
        </div>
        <div className="flex-[2] min-h-0">
          <ScheduleSidePanel
            items={items}
            selectedDay={selectedDay}
            addTrigger={addTrigger}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
}