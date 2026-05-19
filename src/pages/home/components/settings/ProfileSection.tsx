import { useState } from 'react';
import { useApiFetch } from '@/hooks/useApiFetch';

/* =================================================================
   [API 연동 가이드] 내 프로필 데이터
   1. 아래 fallbackProfile를 제거하고 useApiFetch 주석을 해제하세요.
   2. 엔드포인트 URL을 첫 번째 인자에 입력하세요.
      예: useApiFetch<ProfileData>('/api/user/profile', fallbackProfile)
   ================================================================= */
interface ProfileData {
  name: string;
  department: string;
  position: string;
  email: string;
  phone: string;
  language: string;
}

const fallbackProfile: ProfileData = {
  name: 'A 직원',
  department: '인사팀',
  position: 'HR 담당자',
  email: 'employee.a@company.com',
  phone: '010-1234-5678',
  language: '한국어',
};

const FIELDS: { key: keyof ProfileData; label: string; type: string }[] = [
  { key: 'name', label: '이름', type: 'text' },
  { key: 'department', label: '부서', type: 'text' },
  { key: 'position', label: '직책', type: 'text' },
  { key: 'email', label: '이메일', type: 'email' },
  { key: 'phone', label: '전화번호', type: 'tel' },
  { key: 'language', label: '사용 언어', type: 'text' },
];

export default function ProfileSection() {
  // const { data: profileData, setData: setProfileData } = useApiFetch<ProfileData>('', fallbackProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>(fallbackProfile);
  const [draft, setDraft] = useState<ProfileData>(fallbackProfile);
  const [saved, setSaved] = useState(false);

  /* [API 연동 가이드] 프로필 저장
     1. 아래 handleSave의 setProfile 호출 전에
        fetch('/api/user/profile', { method: 'PUT', body: JSON.stringify(draft) })
        를 호출하세요.
     2. 성공 응답을 받은 후 setProfile(draft) 로 로컬 상태를 갱신하세요.
  */
  const handleSave = () => {
    setProfile(draft);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleCancel = () => {
    setDraft(profile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-800">내 프로필</h2>
          <p className="text-[12px] text-slate-500 mt-0.5">기본 정보와 연락처를 관리합니다</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors whitespace-nowrap"
          >
            <i className="ri-edit-line text-sm" />
            수정
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={handleCancel}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-[12px] font-medium text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors whitespace-nowrap"
            >
              취소
            </button>
            <button
              onClick={handleSave}
              className="px-3 py-1.5 rounded-lg bg-teal-500 text-white text-[12px] font-medium hover:bg-teal-600 cursor-pointer transition-colors whitespace-nowrap"
            >
              저장
            </button>
          </div>
        )}
      </div>

      {/* Avatar card */}
      <div className="flex items-center gap-5 p-5 bg-slate-50 rounded-xl border border-slate-100">
        <div className="relative flex-shrink-0">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">EA</span>
          </div>
          <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-teal-500 border-2 border-white" />
        </div>
        <div>
          <p className="text-[15px] font-semibold text-slate-800">{profile.name}</p>
          <p className="text-[12px] text-slate-500 mt-0.5">{profile.department} · {profile.position}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{profile.email}</p>
        </div>
        {isEditing && (
          <button className="ml-auto text-[12px] text-teal-600 font-medium hover:text-teal-700 cursor-pointer transition-colors whitespace-nowrap">
            <i className="ri-camera-line mr-1" />
            사진 변경
          </button>
        )}
      </div>

      {/* Form grid */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <p className="text-[12px] font-semibold text-slate-600">기본 정보</p>
        </div>
        <div className="p-4 grid grid-cols-2 gap-4">
          {FIELDS.map((field) => (
            <div key={field.key}>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                {field.label}
              </label>
              {isEditing ? (
                <input
                  type={field.type}
                  value={draft[field.key]}
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, [field.key]: e.target.value }))
                  }
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                />
              ) : (
                <p className="text-[13px] text-slate-700 py-2 px-3 bg-slate-50 rounded-lg border border-slate-100">
                  {profile[field.key]}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Leave preference summary */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <p className="text-[12px] font-semibold text-slate-600">소속 & 권한</p>
        </div>
        <div className="p-4 space-y-3">
          {[
            { label: '소속 회사', value: 'Acme Corporation', icon: 'ri-building-line' },
            { label: '직원 번호', value: 'EMP-2024-0381', icon: 'ri-id-card-line' },
            { label: '입사일', value: '2024년 3월 11일', icon: 'ri-calendar-check-line' },
            { label: '권한 레벨', value: 'HR 일반', icon: 'ri-shield-user-line' },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <div className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-100 flex-shrink-0">
                <i className={`${item.icon} text-sm text-slate-500`} />
              </div>
              <span className="text-[12px] text-slate-500 flex-1">{item.label}</span>
              <span className="text-[12px] font-medium text-slate-700">{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-100 rounded-lg">
          <i className="ri-check-line text-teal-500 text-sm" />
          <span className="text-[12px] text-teal-700 font-medium">프로필이 저장되었습니다.</span>
        </div>
      )}
    </div>
  );
}