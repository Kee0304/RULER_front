import { useState } from 'react';
import ProfileSection from '@/pages/home/components/settings/ProfileSection';
import NotificationSection from '@/pages/home/components/settings/NotificationSection';
import AIPreferenceSection from '@/pages/home/components/settings/AIPreferenceSection';
import SecuritySection from '@/pages/home/components/settings/SecuritySection';
import { UserInfo } from '../page';

type SectionId = 'profile' | 'notification' | 'ai' | 'security';

interface NavItem {
  id: SectionId;
  label: string;
  icon: string;
  sub: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'profile',
    label: '내 프로필',
    icon: 'ri-user-3-line',
    sub: '기본 정보 · 연락처',
  },
  {
    id: 'notification',
    label: '알림 설정',
    icon: 'ri-notification-3-line',
    sub: '이메일 · 인앱 알림',
    badge: '6',
  },
  {
    id: 'ai',
    label: '개인 설정',
    icon: 'ri-equalizer-line',
    sub: 'AI · 휴가 선호도',
  },
  {
    id: 'security',
    label: '보안',
    icon: 'ri-shield-keyhole-line',
    sub: '비밀번호 · 세션',
  },
];

export default function SettingsPage({userInfo} : {userInfo:UserInfo}) {
  const [activeSection, setActiveSection] = useState<SectionId>('profile');

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection userInfo={userInfo}/>;
      case 'notification':
        return <NotificationSection />;
      case 'ai':
        return <AIPreferenceSection />;
      case 'security':
        return <SecuritySection />;
      default:
        return <ProfileSection userInfo={userInfo}/>;
    }
  };

  return (
    <div className="flex gap-5 h-full">
      {/* Left nav */}
      <aside className="w-52 flex-shrink-0 flex flex-col gap-3">
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              설정 메뉴
            </p>
          </div>
          <nav className="p-1.5 space-y-0.5">
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left cursor-pointer transition-all
                    ${
                      isActive
                        ? 'bg-teal-50 text-teal-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0
                    ${isActive ? 'bg-teal-100' : 'bg-slate-100'}`}
                  >
                    <i
                      className={`${item.icon} text-sm ${
                        isActive ? 'text-teal-600' : 'text-slate-500'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-[12px] font-semibold truncate ${
                          isActive ? 'text-teal-700' : 'text-slate-700'
                        }`}
                      >
                        {item.label}
                      </p>
                      {item.badge && (
                        <span className="w-4 h-4 rounded-full bg-teal-500 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.sub}</p>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* App info card */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-teal-500/15 flex-shrink-0">
              <i className="ri-scales-3-line text-teal-500 text-sm" />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-slate-700 truncate">Legal & HR Agent</p>
              <p className="text-[10px] text-slate-400">AI Corporate Assistant</p>
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500">버전</span>
              <span className="font-semibold text-slate-600">v2.4.1</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500">RAG 엔진</span>
              <span className="font-semibold text-teal-600">활성화</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500">색인 문서</span>
              <span className="font-semibold text-slate-600">4개</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100">
            <p className="text-[10px] text-slate-400 text-center">© 2026 Acme Corporation</p>
          </div>
        </div>
      </aside>

      {/* Content area */}
      <main className="flex-1 overflow-y-auto pb-4 min-h-0">{renderSection()}</main>
    </div>
  );
}