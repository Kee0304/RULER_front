import { useState } from 'react';
import Sidebar from '@/components/feature/Sidebar';
import TopBar from '@/pages/home/components/TopBar';
import ChatInterface from '@/pages/home/components/ChatInterface';
import LeaveStatusWidget from '@/pages/home/components/LeaveStatusWidget';
import MiniCalendar from '@/pages/home/components/MiniCalendar';
import RAGSearchWidget from '@/pages/home/components/RAGSearchWidget';
import LeaveSchedulePage from '@/pages/home/components/LeaveSchedulePage';
import SettingsPage from '@/pages/home/components/SettingsPage';
import StatCard from '@/components/base/StatCard';
import { StatCardItem } from '@/components/base/StatCardItem';
import { useApiFetch } from '@/hooks/useApiFetch';

interface UserInfo {
  name: string;
  department: string;
  initials: string;
}

const defaultUserInfo: UserInfo = {
  name: 'A 직원',
  department: '인사팀',
  initials: 'EA',
};

/*
import { apiFetch } from '@/hooks/useApiFetch';
async function fetchUserInfo(): Promise<UserInfo> {
  const res = await apiFetch<UserInfo>('/api/user/info');
  return res;
}
*/

interface DashboardContentProps {
  onNavigateToLeave: () => void;
  userInfo: UserInfo;
}

function DashboardContent({ onNavigateToLeave, userInfo }: DashboardContentProps) {
  const { data: dashboardStats, loading } = useApiFetch<StatCardItem[]>('/api/dashboard/stats', [
    { label: '연차 잔여', value: '0일', sub: '총 0일 중', icon: 'ri-calendar-2-line', color: 'text-teal-500', bg: 'bg-teal-50' },
    { label: '색인 문서', value: '0개', sub: '전체 0개 중', icon: 'ri-file-text-line', color: 'text-amber-500', bg: 'bg-amber-50' },
    { label: '승인 대기', value: '0건', sub: '현재 없음', icon: 'ri-time-line', color: 'text-rose-500', bg: 'bg-rose-50' },
    { label: '오늘 AI 질의', value: '0회', sub: 'RAG 기반 응답', icon: 'ri-robot-2-line', color: 'text-orange-500', bg: 'bg-orange-50' },
  ]);

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Stats row */}
      <StatCard items={dashboardStats} loading={loading} />

      {/* Main split content */}
      <div className="flex gap-4 flex-1 min-h-0">
        {/* Left – Chat (60%) */}
        <div className="flex-[3] min-h-0">
          <ChatInterface userInfo={userInfo} />
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
  const [userInfo] = useState<UserInfo>(defaultUserInfo);
  // 추후 API 연동
  // useEffect(() => {
  //   fetchUserInfo().then(setUserInfo).catch(console.error);
  // }, []);

  const navigateToLeave = () => setActiveTab('leave');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <DashboardContent onNavigateToLeave={navigateToLeave} userInfo={userInfo} />;
      case 'leave':
        return <LeaveSchedulePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardContent onNavigateToLeave={navigateToLeave} userInfo={userInfo} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F0F4F8] overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar activeTab={activeTab} userInfo={userInfo} />

        {/* Content */}
        <main className="flex-1 overflow-hidden p-5">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}