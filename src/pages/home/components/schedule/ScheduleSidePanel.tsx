import { useState, useEffect } from 'react';
import { ScheduleItem, ScheduleType } from '@/mocks/scheduleItems';
import { UserHR } from '../../page';

const TYPES: ScheduleType[] = ['휴가', '반차', '회의', '출장', '기타'];

const typeStyles: Record<ScheduleType, { bg: string; text: string; icon: string }> = {
  '휴가': { bg: 'bg-teal-50', text: 'text-teal-700', icon: 'ri-sun-line' },
  '반차': { bg: 'bg-teal-50', text: 'text-teal-600', icon: 'ri-time-line' },
  '회의': { bg: 'bg-amber-50', text: 'text-amber-700', icon: 'ri-team-line' },
  '출장': { bg: 'bg-orange-50', text: 'text-orange-700', icon: 'ri-flight-takeoff-line' },
  '기타': { bg: 'bg-slate-50', text: 'text-slate-600', icon: 'ri-calendar-line' },
};

interface FormState {
  title: string;
  date: string;
  type: ScheduleType;
  description: string;
  startTime: string;
  endTime: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  date: '2026-06-01',
  type: '회의',
  description: '',
  startTime: '',
  endTime: '',
};

export interface AddTrigger {
  date: string;
  seq: number;
}

interface ScheduleSidePanelProps {
  items: ScheduleItem[];
  selectedDay: number | null;
  addTrigger: AddTrigger | null;
  onAdd: (item: Omit<ScheduleItem, 'id'>) => void;
  onUpdate: (item: ScheduleItem) => void;
  onDelete: (id: number) => void;
  userHR: UserHR
}

interface ScheduleCardProps {
  item: ScheduleItem;
  deleteConfirm: number | null;
  onEdit: (item: ScheduleItem) => void;
  onDelete: (id: number) => void;
}

function ScheduleCard({ item, deleteConfirm, onEdit, onDelete}: ScheduleCardProps) {
  const style = typeStyles[item.type];
  const month = item.date.slice(5, 7);
  const day = item.date.slice(8);

  return (
    <div className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-100 hover:border-teal-100 hover:bg-teal-50/30 transition-all group">
      <div className={`w-8 h-8 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0`}>
        <i className={`${style.icon} text-sm ${style.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-medium text-slate-700 truncate">{item.title}</p>
        <p className="text-[10px] text-slate-400 mt-0.5">
          {month}월 {day}일
          {item.startTime && ` · ${item.startTime}${item.endTime ? ` ~ ${item.endTime}` : ''}`}
        </p>
        {item.description && (
          <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.description}</p>
        )}
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button
          onClick={() => onEdit(item)}
          className="w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:text-teal-600 hover:bg-teal-50 cursor-pointer transition-colors"
          title="수정"
        >
          <i className="ri-edit-line text-xs" />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className={`w-6 h-6 flex items-center justify-center rounded cursor-pointer transition-colors
            ${deleteConfirm === item.id
              ? 'bg-red-100 text-red-500'
              : 'text-slate-400 hover:text-red-500 hover:bg-red-50'
            }`}
          title={deleteConfirm === item.id ? '한 번 더 클릭하면 삭제' : '삭제'}
        >
          <i className={`${deleteConfirm === item.id ? 'ri-check-line' : 'ri-delete-bin-line'} text-xs`} />
        </button>
      </div>
    </div>
  );
}

export default function ScheduleSidePanel({
  items,
  selectedDay,
  addTrigger,
  onAdd,
  onUpdate,
  onDelete,
  userHR
}: ScheduleSidePanelProps) {
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  useEffect(() => {
    if (addTrigger) {
      setForm({ ...EMPTY_FORM, date: addTrigger.date });
      setEditingId(null);
      setMode('add');
    }
  }, [addTrigger]);

  const selectedDateStr = selectedDay
    ? `2026-06-${String(selectedDay).padStart(2, '0')}`
    : null;

  const selectedItems = selectedDateStr
    ? items.filter((i) => i.date === selectedDateStr)
    : [];

  const allItems = [...items].sort((a, b) => a.date.localeCompare(b.date));

  const handleEdit = (item: ScheduleItem) => {
    setForm({
      title: item.title,
      date: item.date,
      type: item.type,
      description: item.description,
      startTime: item.startTime ?? '',
      endTime: item.endTime ?? '',
    });
    setEditingId(item.id);
    setMode('edit');
  };

  const handleSubmit = () => {
    if (!form.title.trim()) return;
    const payload = {
      ...form,
      startTime: form.startTime || undefined,
      endTime: form.endTime || undefined,
    };
    if (mode === 'edit' && editingId !== null) {
      onUpdate({ id: editingId, ...payload });
    } else {
      onAdd(payload);
    }
    setMode('list');
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleCancel = () => {
    setMode('list');
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    if (deleteConfirm === id) {
      onDelete(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
    }
  };

  const openAdd = () => {
    setForm({ ...EMPTY_FORM, date: selectedDateStr ?? '2026-06-01' });
    setEditingId(null);
    setMode('add');
  };

  if (mode === 'add' || mode === 'edit') {
    return (
      <div className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col h-full">
        <div className="flex items-center gap-2 mb-4 flex-shrink-0">
          <button
            onClick={handleCancel}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 cursor-pointer transition-colors"
          >
            <i className="ri-arrow-left-line text-sm" />
          </button>
          <p className="text-[13px] font-semibold text-slate-800">
            {mode === 'edit' ? '일정 수정' : '새 일정 추가'}
          </p>
        </div>

        <div className="flex-1 space-y-3 overflow-y-auto pr-0.5">
          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">제목 *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="일정 제목을 입력하세요"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">날짜</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
            />
          </div>

          <div>const now = new Date();
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">유형</label>
            <div className="flex flex-wrap gap-2">
              {TYPES.map((t) => {
                const style = typeStyles[t];
                const isActive = form.type === t;
                return (
                  <button
                    key={t}
                    onClick={() => setForm((f) => ({ ...f, type: t }))}
                    className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition-all cursor-pointer whitespace-nowrap
                      ${isActive
                        ? `${style.bg} ${style.text} ring-1 ring-current`
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">시작 시간</label>
              <input
                type="time"
                value={form.startTime}
                onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 focus:outline-none focus:border-teal-400 transition-all"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-600 block mb-1">종료 시간</label>
              <input
                type="time"
                value={form.endTime}
                onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 focus:outline-none focus:border-teal-400 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-600 block mb-1">메모</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="일정에 대한 메모를 입력하세요"
              rows={3}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 placeholder-slate-400 resize-none focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
            />
          </div>
        </div>

        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={handleCancel}
            className="flex-1 py-2.5 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors whitespace-nowrap"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!form.title.trim()}
            className="flex-1 py-2.5 rounded-lg bg-navy-900 text-white text-[13px] font-medium hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors whitespace-nowrap"
          >
            {mode === 'edit' ? '수정 완료' : '일정 추가'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <p className="text-[13px] font-semibold text-slate-800">
          {selectedDay ? `6월 ${selectedDay}일 일정` : '전체 일정'}
        </p>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 text-white text-[12px] font-medium hover:bg-teal-600 cursor-pointer transition-colors whitespace-nowrap"
        >
          <i className="ri-add-line text-sm" />
          일정 추가
        </button>
      </div>

      {selectedDay && (
        <div className="mb-3 flex-shrink-0">
          {selectedItems.length === 0 ? (
            <div className="text-center py-5 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 flex items-center justify-center mx-auto">
                <i className="ri-calendar-line text-xl text-slate-300" />
              </div>
              <p className="text-[12px] text-slate-400 mt-1">이 날짜에 일정이 없습니다</p>
              <button
                onClick={openAdd}
                className="mt-1.5 text-[11px] text-teal-600 font-medium hover:text-teal-700 cursor-pointer transition-colors"
              >
                + 일정 추가하기
              </button>
            </div>
          ) : (
            <div className="space-y-1.5">
              {selectedItems.map((item) => (
                <ScheduleCard
                  key={item.id}
                  item={item}
                  deleteConfirm={deleteConfirm}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
          <div className="border-t border-slate-100 mt-3 mb-3" />
        </div>
      )}

      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex-shrink-0">
        전체 일정 ({allItems.length}건)
      </p>

      <div className="flex-1 overflow-y-auto space-y-1.5 pr-0.5">
        {allItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-10 h-10 flex items-center justify-center mx-auto">
              <i className="ri-calendar-todo-line text-2xl text-slate-300" />
            </div>
            <p className="text-[12px] text-slate-400 mt-1">등록된 일정이 없습니다</p>
          </div>
        ) : (
          allItems.map((item) => (
            <ScheduleCard
              key={item.id}
              item={item}
              deleteConfirm={deleteConfirm}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}