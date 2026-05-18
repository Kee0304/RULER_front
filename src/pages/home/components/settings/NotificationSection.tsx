import { useState } from 'react';
import ToggleSwitch from '@/components/base/ToggleSwitch';

interface NotifItem {
  id: string;
  label: string;
  desc: string;
}

interface NotifGroup {
  label: string;
  icon: string;
  items: NotifItem[];
}

const notifGroups: NotifGroup[] = [
  {
    label: '일반 알림',
    icon: 'ri-notification-3-line',
    items: [
      { id: 'email', label: '이메일 알림', desc: '주요 업데이트를 이메일로 수신합니다' },
      { id: 'inapp', label: '인앱 알림', desc: '대시보드 내 실시간 알림을 표시합니다' },
    ],
  },
  {
    label: 'HR & 휴가 알림',
    icon: 'ri-calendar-event-line',
    items: [
      { id: 'leave_approval', label: '휴가 승인/거절 알림', desc: '신청한 휴가의 처리 결과를 즉시 알립니다' },
      { id: 'holiday_remind', label: '공휴일 사전 알림', desc: '공휴일 3일 전에 미리 알려드립니다' },
      { id: 'leave_low', label: '잔여 휴가 경고 알림', desc: '연차가 5일 이하 남으면 알립니다' },
    ],
  },
  {
    label: 'AI 어시스턴트 알림',
    icon: 'ri-robot-2-line',
    items: [
      { id: 'ai_suggest', label: 'AI 휴가 추천 알림', desc: '최적 휴가 슬롯이 감지되면 AI가 제안합니다' },
      { id: 'weekly_report', label: '주간 인사 리포트', desc: '매주 월요일 오전 인사 현황 리포트를 발송합니다' },
      { id: 'doc_update', label: '새 정책 문서 색인 알림', desc: '지식베이스에 새 문서가 추가되면 알립니다' },
    ],
  },
];

const initialToggles: Record<string, boolean> = {
  email: true,
  inapp: true,
  leave_approval: true,
  holiday_remind: true,
  leave_low: true,
  ai_suggest: true,
  weekly_report: false,
  doc_update: false,
};

export default function NotificationSection() {
  const [toggles, setToggles] = useState<Record<string, boolean>>(initialToggles);
  const [saved, setSaved] = useState(false);

  const toggle = (id: string, v: boolean) =>
    setToggles((prev) => ({ ...prev, [id]: v }));

  const enabledCount = Object.values(toggles).filter(Boolean).length;
  const totalCount = Object.keys(toggles).length;

  const handleSaveAll = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-800">알림 설정</h2>
          <p className="text-[12px] text-slate-500 mt-0.5">받고 싶은 알림을 개별적으로 설정하세요</p>
        </div>
        <button
          onClick={handleSaveAll}
          className="px-3 py-1.5 rounded-lg bg-teal-500 text-white text-[12px] font-medium hover:bg-teal-600 cursor-pointer transition-colors whitespace-nowrap"
        >
          변경사항 저장
        </button>
      </div>

      {/* Summary bar */}
      <div className="flex items-center gap-3 p-3.5 bg-white rounded-xl border border-slate-100">
        <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-teal-50 flex-shrink-0">
          <i className="ri-notification-3-line text-teal-500 text-base" />
        </div>
        <div className="flex-1">
          <p className="text-[12px] font-medium text-slate-700">
            전체 {totalCount}개 중 <span className="text-teal-600 font-semibold">{enabledCount}개</span> 활성화됨
          </p>
          <div className="w-full bg-slate-100 rounded-full h-1 mt-1.5">
            <div
              className="bg-teal-400 h-1 rounded-full transition-all"
              style={{ width: `${(enabledCount / totalCount) * 100}%` }}
            />
          </div>
        </div>
        <button
          onClick={() =>
            setToggles(Object.fromEntries(Object.keys(initialToggles).map((k) => [k, true])))
          }
          className="text-[11px] text-slate-500 hover:text-teal-600 cursor-pointer transition-colors whitespace-nowrap"
        >
          모두 켜기
        </button>
      </div>

      {notifGroups.map((group) => (
        <div key={group.label} className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={`${group.icon} text-sm text-teal-500`} />
            </div>
            <p className="text-[12px] font-semibold text-slate-600">{group.label}</p>
          </div>
          <div className="divide-y divide-slate-100">
            {group.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-4 py-3.5">
                <div className="flex-1">
                  <p className="text-[13px] font-medium text-slate-700">{item.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                </div>
                <ToggleSwitch
                  checked={toggles[item.id] ?? false}
                  onChange={(v) => toggle(item.id, v)}
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      {saved && (
        <div className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-100 rounded-lg">
          <i className="ri-check-line text-teal-500 text-sm" />
          <span className="text-[12px] text-teal-700 font-medium">알림 설정이 저장되었습니다.</span>
        </div>
      )}
    </div>
  );
}