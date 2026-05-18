interface TopBarProps {
  activeTab: string;
}

const tabTitles: Record<string, { label: string; icon: string; desc: string }> = {
  chat: { label: 'AI 채팅 어시스턴트', icon: 'ri-robot-2-line', desc: '인사 정책, 휴가, 법무 문제에 대해 무엇이든 질문하세요' },
  leave: { label: '내 휴가 & 일정', icon: 'ri-calendar-event-line', desc: '휴가 잔여일 및 개인 일정 관리' },
  settings: { label: '설정', icon: 'ri-settings-4-line', desc: '환경 설정 및 알림 구성' },
};

export default function TopBar({ activeTab }: TopBarProps) {
  const info = tabTitles[activeTab] ?? tabTitles.dashboard;
  const today = new Date().toLocaleDateString('ko-KR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <header className="h-14 bg-white border-b border-slate-100 px-6 flex items-center gap-4 flex-shrink-0">
      <div className="flex items-center gap-2 flex-1">
        <div className="w-6 h-6 flex items-center justify-center text-slate-400">
          <i className={`${info.icon} text-base`} />
        </div>
        <h1 className="text-[14px] font-semibold text-slate-800">{info.label}</h1>
        <span className="text-slate-300 text-sm">·</span>
        <span className="text-[12px] text-slate-500 hidden md:block">{info.desc}</span>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-500 bg-slate-50 border border-slate-100 rounded-lg px-3 py-1.5">
          <i className="ri-calendar-line text-xs" />
          <span>{today}</span>
        </div>

        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
          <i className="ri-notification-3-line text-base" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-teal-500 rounded-full border border-white" />
        </button>

        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
          <i className="ri-search-line text-base" />
        </button>

        <div className="flex items-center gap-2 pl-1 cursor-pointer group">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center text-white text-[11px] font-bold">
            EA
          </div>
          <div className="hidden sm:block">
            <p className="text-[12px] font-semibold text-slate-700 leading-tight group-hover:text-teal-600 transition-colors">A 직원</p>
            <p className="text-[10px] text-slate-400 leading-tight">인사팀</p>
          </div>
          <i className="ri-arrow-down-s-line text-slate-400 text-sm hidden sm:block" />
        </div>
      </div>
    </header>
  );
}