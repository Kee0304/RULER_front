import { UserHR, UserInfo } from '@/pages/home/page';
import { useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'chat', label: 'AI 채팅 어시스턴트', icon: 'ri-robot-2-line', badge: 2 },
  { id: 'leave', label: '내 휴가 & 일정', icon: 'ri-calendar-event-line' },
  { id: 'settings', label: '설정', icon: 'ri-settings-4-line' },
];

interface SidebarProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  userInfo: UserInfo
}

export default function Sidebar({ activeTab, onTabChange, userInfo }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`relative flex flex-col h-full bg-navy-900 transition-all duration-300 ${
        collapsed ? 'w-[68px]' : 'w-64'
      } flex-shrink-0`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/8">
        <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-teal-500/20 flex-shrink-0">
          <i className="ri-scales-3-line text-teal-400 text-lg" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="text-white font-semibold text-sm leading-tight whitespace-nowrap">Legal & HR Agent</p>
            <p className="text-slate-400 text-[10px] font-medium tracking-wide whitespace-nowrap">AI 기업 어시스턴트</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-colors cursor-pointer flex-shrink-0"
        >
          <i className={`${collapsed ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'} text-sm`} />
        </button>
      </div>

      {/* Section label */}
      {!collapsed && (
        <p className="text-[10px] font-semibold tracking-widest text-slate-500 uppercase px-4 pt-5 pb-2">
          메인 메뉴
        </p>
      )}

      {/* Nav items */}
      <nav className="flex-1 px-2 py-1 space-y-0.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer whitespace-nowrap group ${
                isActive
                  ? 'bg-teal-500/15 text-teal-400'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              <div className={`w-5 h-5 flex items-center justify-center flex-shrink-0 ${isActive ? 'text-teal-400' : ''}`}>
                <i className={`${item.icon} text-base`} />
              </div>
              {!collapsed && (
                <>
                  <span className="flex-1 text-left text-[13px]">{item.label}</span>
                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {isActive && (
                <span className="absolute right-0 w-[3px] h-8 bg-teal-400 rounded-l-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="mx-4 border-t border-white/8" />

      {/* User profile */}
      <div className={`p-4 flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0 text-white font-semibold text-sm">
          EA
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13px] font-semibold truncate">{userInfo.name}</p>
            <p className="text-slate-500 text-[11px] truncate">{userInfo.department}</p>
          </div>
        )}
        {!collapsed && (
          <button className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-300 cursor-pointer transition-colors">
            <i className="ri-logout-box-r-line text-sm" />
          </button>
        )}
      </div>
    </aside>
  );
}