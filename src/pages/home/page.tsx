import { useState } from 'react';
import Sidebar from '@/components/feature/Sidebar';
import TopBar from '@/pages/home/components/TopBar';
import ChatInterface from '@/pages/home/components/ChatInterface';
import LeaveStatusWidget from '@/pages/home/components/LeaveStatusWidget';
import MiniCalendar from '@/pages/home/components/MiniCalendar';
import RAGSearchWidget from '@/pages/home/components/RAGSearchWidget';
import LeaveSchedulePage from '@/pages/home/components/LeaveSchedulePage';
import SettingsPage from '@/pages/home/components/SettingsPage';

interface DashboardContentProps {
  onNavigateToLeave: () => void;
}

function DashboardContent({ onNavigateToLeave }: DashboardContentProps) {
  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3 flex-shrink-0">
        {[
          { label: '연차 잔여일', value: '4.5일', icon: 'ri-calendar-2-line', color: 'text-teal-500', bg: 'bg-teal-50' },
          { label: '색인 완료 문서', value: '4개', icon: 'ri-file-text-line', color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: '승인 대기 중', value: '0건', icon: 'ri-time-line', color: 'text-slate-500', bg: 'bg-slate-100' },
          { label: '오늘 AI 질의수', value: '12회', icon: 'ri-robot-2-line', color: 'text-navy-900', bg: 'bg-navy-900/5' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-100 shadow-widget px-4 py-3 flex items-center gap-3">
            <div className={`w-9 h-9 flex items-center justify-center rounded-xl ${stat.bg} flex-shrink-0`}>
              <i className={`${stat.icon} text-base ${stat.color}`} />
            </div>
            <div>
              <p className="text-[18px] font-bold text-slate-800 leading-none">{stat.value}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main split content */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left – Chat (60%) */}
        <div className="flex-[3] min-h-0">
          <ChatInterface />
        </div>

        {/* Right – Widgets (40%) */}
        <div className="flex-[2] overflow-y-auto space-y-4 pb-1 pr-0.5">
          <LeaveStatusWidget onNavigate={onNavigateToLeave} />
          <MiniCalendar onNavigate={onNavigateToLeave} />
          <RAGSearchWidget />
        </div>
      </div>
    </div>
  );
}

function PlaceholderPage({ title, icon }: { title: string; icon: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center gap-4">
      <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-slate-100">
        <i className={`${icon} text-3xl text-slate-400`} />
      </div>
      <div>
        <p className="text-[16px] font-semibold text-slate-700">{title}</p>
        <p className="text-[13px] text-slate-400 mt-1">해당 섹션은 콘텐츠 준비 중입니다.</p>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('chat');

  const navigateToLeave = () => setActiveTab('leave');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <DashboardContent onNavigateToLeave={navigateToLeave} />;
      case 'leave':
        return <LeaveSchedulePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardContent onNavigateToLeave={navigateToLeave} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F0F4F8] overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar activeTab={activeTab} />

        {/* Content */}
        <main className="flex-1 overflow-hidden p-5">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}