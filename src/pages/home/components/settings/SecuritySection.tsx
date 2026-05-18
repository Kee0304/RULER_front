import { useState } from 'react';
import ToggleSwitch from '@/components/base/ToggleSwitch';

type PwKey = 'current' | 'next' | 'confirm';

const PW_LABELS: Record<PwKey, string> = {
  current: '현재 비밀번호',
  next: '새 비밀번호',
  confirm: '새 비밀번호 확인',
};

const SESSIONS = [
  {
    id: 1,
    device: 'Chrome · Windows 11',
    location: '서울특별시, 대한민국',
    time: '현재 세션',
    current: true,
    icon: 'ri-computer-line',
  },
  {
    id: 2,
    device: 'Safari · iPhone 15 Pro',
    location: '서울특별시, 대한민국',
    time: '2시간 전',
    current: false,
    icon: 'ri-smartphone-line',
  },
  {
    id: 3,
    device: 'Chrome · MacBook Pro',
    location: '경기도 성남시, 대한민국',
    time: '어제 오후 9:22',
    current: false,
    icon: 'ri-macbook-line',
  },
];

export default function SecuritySection() {
  const [twoFA, setTwoFA] = useState(false);
  const [sessions, setSessions] = useState(SESSIONS);
  const [pwForm, setPwForm] = useState<Record<PwKey, string>>({
    current: '',
    next: '',
    confirm: '',
  });
  const [showPw, setShowPw] = useState<Record<PwKey, boolean>>({
    current: false,
    next: false,
    confirm: false,
  });
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  const handlePwSave = () => {
    if (!pwForm.current.trim()) {
      setPwError('현재 비밀번호를 입력해주세요.');
      return;
    }
    if (pwForm.next.length < 8) {
      setPwError('새 비밀번호는 8자 이상이어야 합니다.');
      return;
    }
    if (pwForm.next !== pwForm.confirm) {
      setPwError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    setPwError('');
    setPwForm({ current: '', next: '', confirm: '' });
    setPwSaved(true);
    setTimeout(() => setPwSaved(false), 2500);
  };

  const terminateSession = (id: number) => {
    setSessions((prev) => prev.filter((s) => s.id === 1 || s.id !== id));
  };

  const terminateAll = () => {
    setSessions((prev) => prev.filter((s) => s.current));
  };

  const pwStrength = (() => {
    const pw = pwForm.next;
    if (!pw) return null;
    if (pw.length < 6) return { label: '약함', color: 'bg-red-400', width: '30%' };
    if (pw.length < 10) return { label: '보통', color: 'bg-amber-400', width: '60%' };
    return { label: '강함', color: 'bg-teal-400', width: '100%' };
  })();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-[15px] font-semibold text-slate-800">보안</h2>
        <p className="text-[12px] text-slate-500 mt-0.5">계정 보안 및 로그인 세션을 관리합니다</p>
      </div>

      {/* 비밀번호 변경 */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-lock-password-line text-sm text-teal-500" />
          </div>
          <p className="text-[12px] font-semibold text-slate-600">비밀번호 변경</p>
        </div>
        <div className="p-4 space-y-3">
          {(['current', 'next', 'confirm'] as PwKey[]).map((key) => (
            <div key={key}>
              <label className="text-[11px] font-semibold text-slate-500 block mb-1.5">
                {PW_LABELS[key]}
              </label>
              <div className="relative">
                <input
                  type={showPw[key] ? 'text' : 'password'}
                  value={pwForm[key]}
                  onChange={(e) => setPwForm((f) => ({ ...f, [key]: e.target.value }))}
                  placeholder="••••••••"
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] text-slate-700 pr-10 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((p) => ({ ...p, [key]: !p[key] }))}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                >
                  <i className={`${showPw[key] ? 'ri-eye-off-line' : 'ri-eye-line'} text-sm`} />
                </button>
              </div>
              {key === 'next' && pwStrength && (
                <div className="mt-2">
                  <div className="w-full bg-slate-100 rounded-full h-1">
                    <div
                      className={`h-1 rounded-full transition-all ${pwStrength.color}`}
                      style={{ width: pwStrength.width }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    비밀번호 강도: <span className="font-medium">{pwStrength.label}</span>
                  </p>
                </div>
              )}
            </div>
          ))}

          {pwError && (
            <div className="flex items-center gap-2 p-2.5 bg-red-50 border border-red-100 rounded-lg">
              <i className="ri-error-warning-line text-red-400 text-sm" />
              <span className="text-[11px] text-red-600">{pwError}</span>
            </div>
          )}
          {pwSaved && (
            <div className="flex items-center gap-2 p-2.5 bg-teal-50 border border-teal-100 rounded-lg">
              <i className="ri-check-line text-teal-500 text-sm" />
              <span className="text-[11px] text-teal-700 font-medium">비밀번호가 성공적으로 변경되었습니다.</span>
            </div>
          )}

          <button
            onClick={handlePwSave}
            className="w-full py-2.5 rounded-lg bg-navy-900 text-white text-[13px] font-medium hover:bg-navy-800 cursor-pointer transition-colors whitespace-nowrap"
          >
            비밀번호 변경
          </button>
        </div>
      </div>

      {/* 2단계 인증 */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-shield-check-line text-sm text-teal-500" />
          </div>
          <p className="text-[12px] font-semibold text-slate-600">2단계 인증 (2FA)</p>
        </div>
        <div className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-[13px] font-medium text-slate-700">인증 앱을 이용한 2FA</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Google Authenticator 또는 Authy와 연동하여 보안을 강화합니다
              </p>
            </div>
            <ToggleSwitch checked={twoFA} onChange={setTwoFA} />
          </div>
          {twoFA && (
            <div className="mt-3 p-3 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2">
              <i className="ri-information-line text-amber-500 text-sm mt-0.5 flex-shrink-0" />
              <p className="text-[11px] text-amber-700">
                인증 앱 연동을 완료하려면 IT 보안팀 또는 관리자에게 문의하세요.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 활성 세션 */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 flex items-center justify-center">
              <i className="ri-computer-line text-sm text-teal-500" />
            </div>
            <p className="text-[12px] font-semibold text-slate-600">
              활성 세션 ({sessions.length}개)
            </p>
          </div>
          {sessions.length > 1 && (
            <button
              onClick={terminateAll}
              className="text-[11px] text-red-500 font-medium hover:text-red-600 cursor-pointer transition-colors whitespace-nowrap"
            >
              다른 세션 모두 종료
            </button>
          )}
        </div>
        <div className="divide-y divide-slate-100">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                <i className={`${s.icon} text-base text-slate-500`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[12px] font-medium text-slate-700">{s.device}</p>
                  {s.current && (
                    <span className="text-[10px] font-semibold bg-teal-50 text-teal-600 border border-teal-100 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                      현재 세션
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {s.location} · {s.time}
                </p>
              </div>
              {!s.current && (
                <button
                  onClick={() => terminateSession(s.id)}
                  className="text-[11px] text-slate-400 hover:text-red-500 cursor-pointer transition-colors whitespace-nowrap"
                >
                  종료
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 계정 삭제 위험 구역 */}
      <div className="bg-white rounded-xl border border-red-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-red-100 bg-red-50/50 flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-error-warning-line text-sm text-red-400" />
          </div>
          <p className="text-[12px] font-semibold text-red-600">위험 구역</p>
        </div>
        <div className="p-4 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-[13px] font-medium text-slate-700">계정 비활성화</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              계정을 비활성화하면 모든 데이터에 접근이 제한됩니다. 관리자 승인이 필요합니다.
            </p>
          </div>
          <button className="flex-shrink-0 px-3 py-1.5 rounded-lg border border-red-200 text-[12px] font-medium text-red-500 hover:bg-red-50 cursor-pointer transition-colors whitespace-nowrap">
            비활성화 요청
          </button>
        </div>
      </div>
    </div>
  );
}