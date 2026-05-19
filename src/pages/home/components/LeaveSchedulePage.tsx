import { useState } from 'react';
import { ScheduleItem } from '@/mocks/scheduleItems';
import StatCard from '@/components/base/StatCard';
import ScheduleCalendar from '@/pages/home/components/schedule/ScheduleCalendar';
import ScheduleSidePanel, { AddTrigger } from '@/pages/home/components/schedule/ScheduleSidePanel';
import { StatCardItem } from '@/components/base/StatCardItem';
import { useApiFetch } from '@/hooks/useApiFetch';
import DataErrorOverlay from '@/components/base/DataErrorOverlay';

export default function LeaveSchedulePage() {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth()); // 0-based
  const curMonthLabel = `${currentYear}년 ${currentMonth + 1}월`;

  const { data: leaveStats, loading: statsLoading } = useApiFetch<StatCardItem[]>('/api/leave/stats', [
    { label: '연차 잔여', value: '0일', sub: '총 15일 중', icon: 'ri-calendar-2-line', color: 'text-teal-500', bg: 'bg-teal-50' },
    { label: '병가 잔여', value: '0일', sub: '총 10일 중', icon: 'ri-heart-pulse-line', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: '이번달 일정', value: '0건', sub: curMonthLabel, icon: 'ri-calendar-event-line', color: 'text-sky-500', bg: 'bg-sky-50' },
    { label: '승인 대기', value: '0건', sub: '현재 없음', icon: 'ri-time-line', color: 'text-slate-500', bg: 'bg-slate-100' },
  ]);

  const { data: scheduleItems, setData: setScheduleItems, loading: itemsLoading, error: itemsError } = useApiFetch<ScheduleItem[]>('/api/schedule/items', []);
  const [selectedDay, setSelectedDay] = useState<number | null>(7);
  const [addTrigger, setAddTrigger] = useState<AddTrigger | null>(null);

  const handleAdd = (item: Omit<ScheduleItem, 'id'>) => {
    setScheduleItems((prev) => [...prev, { ...item, id: Date.now() }]);
  };

  const handleUpdate = (updated: ScheduleItem) => {
    setScheduleItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleDelete = (id: number) => {
    setScheduleItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleDoubleClickDay = (day: number) => {
    const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDay(day);
    setAddTrigger((prev) => ({ date, seq: (prev?.seq ?? 0) + 1 }));
  };

  const goPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDay(null);
  };

  const goNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDay(null);
  };

  const isLoading = statsLoading || itemsLoading;

  if (isLoading) {
    return (
      <div className="flex flex-col h-full gap-3">
        <StatCard items={leaveStats} loading={true} />
        <div className="flex gap-4 flex-1 min-h-0">
          <div className="flex-[3] min-h-0 bg-white rounded-xl border border-slate-100 animate-pulse" />
          <div className="flex-[2] min-h-0 bg-white rounded-xl border border-slate-100 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full gap-3">
      <StatCard items={leaveStats} loading={false} />

      <div className="flex gap-4 flex-1 min-h-0">
        <div className="flex-[3] min-h-0">
          <ScheduleCalendar
            items={scheduleItems}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            onDoubleClickDay={handleDoubleClickDay}
            year={currentYear}
            month={currentMonth}
            onPrevMonth={goPrevMonth}
            onNextMonth={goNextMonth}
          />
        </div>
        <div className="flex-[2] min-h-0 relative">
          <ScheduleSidePanel
            items={scheduleItems}
            selectedDay={selectedDay}
            addTrigger={addTrigger}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
          {itemsError && (
            <DataErrorOverlay
              message="일정 데이터를 불러올 수 없습니다"
              subMessage={itemsError}
            />
          )}
        </div>
      </div>
    </div>
  );
}