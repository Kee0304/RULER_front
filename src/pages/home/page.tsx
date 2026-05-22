import { useEffect, useState } from 'react';
import Sidebar from '@/components/feature/Sidebar';
import TopBar from '@/pages/home/components/TopBar';
import ChatInterface from '@/pages/home/components/ChatInterface';
import LeaveStatusWidget from '@/pages/home/components/LeaveStatusWidget';
import MiniCalendar from '@/pages/home/components/MiniCalendar';
import RAGSearchWidget from '@/pages/home/components/RAGSearchWidget';
import LeaveSchedulePage from '@/pages/home/components/LeaveSchedulePage';
import SettingsPage from '@/pages/home/components/SettingsPage';
import StatCard from '@/components/base/StatCard';

export interface UserInfo {
  user_id: string;
  name: string;
  department: string;
  position: string;
  role: string;
}

interface Schedule {
  date: string;
  type: string;
  description: string;

}

export interface UserHR {
    leave: {
      total: number,
      used: number,
      remaining: number,
      pending: number
    };
  upcoming_schedules: Schedule[];
}


// 더미용
import { apiFetch } from '@/hooks/useApiFetch';
async function fetchUserInfo(): Promise<UserInfo> {
  const res = await apiFetch<UserInfo>('/mock/users/emp_003');
  return res;
}

async function fetchUserHR(): Promise<UserHR> {
  const res = await apiFetch<UserHR>('/mock/hr/emp_003');
  return res;
}


interface DashboardContentProps {
  onNavigateToLeave: () => void;
  userInfo: UserInfo;
  userHR: UserHR
}

function DashboardContent({ onNavigateToLeave, userInfo, userHR }: DashboardContentProps) {

  return (
    <div className="flex flex-col gap-3 min-h-full lg:h-full">
      <StatCard userHR={userHR} activeTab='chat'/>

      <div className="flex flex-col lg:flex-row gap-4 lg:flex-1 lg:min-h-0">
        {/* Left – Chat: 모바일은 70vh로 높이 고정(=내부 채팅 스크롤 보장) */}
        <div className="min-w-0 h-[70vh] lg:h-auto lg:flex-[4] lg:min-h-0">
          <ChatInterface userInfo={userInfo} />
        </div>

        {/* Right – Widgets: 모바일은 자연 흐름, lg에서만 내부 스크롤 */}
        <div className="w-full space-y-4 pb-1 pr-0.5 lg:w-auto lg:flex-[1] lg:min-w-[320px] lg:overflow-y-auto">
          <LeaveStatusWidget onNavigate={onNavigateToLeave} userHR={userHR}/>
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

  const [userInfo, setUserInfo] = useState<UserInfo>({user_id: "emp_00",name: "",department:"",position:"", role:""});
  const [userHR, setUserHR] = useState<UserHR>();

  useEffect(() => {
    fetchUserInfo().then(setUserInfo).catch(console.error);
    fetchUserHR().then(setUserHR).catch(console.error);
  }, []);

  const navigateToLeave = () => setActiveTab('leave');

  const renderContent = () => {
    switch (activeTab) {
      case 'chat':
        return <DashboardContent onNavigateToLeave={navigateToLeave} userInfo={userInfo} userHR={userHR} />;
      case 'leave':
        return <LeaveSchedulePage userHR={userHR} />;
      case 'settings':
        return <SettingsPage userInfo={userInfo}/>;
      default:
        return <DashboardContent onNavigateToLeave={navigateToLeave} userInfo={userInfo} userHR={userHR} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F0F4F8] overflow-hidden">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} userInfo={userInfo} />

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar activeTab={activeTab} userInfo={userInfo} />

        {/* Content — 모바일: 페이지 스크롤 / lg: 고정(내부만 스크롤) */}
        <main className="flex-1 overflow-y-auto lg:overflow-hidden p-5">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}