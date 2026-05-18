import { useState, ReactNode } from 'react';
import ToggleSwitch from '@/components/base/ToggleSwitch';

interface SegmentOption {
  value: string;
  label: string;
}

function SegmentControl({
  options,
  value,
  onChange,
}: {
  options: SegmentOption[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 py-1.5 px-2.5 rounded-md text-[12px] font-medium transition-all cursor-pointer whitespace-nowrap
            ${value === opt.value
              ? 'bg-white text-slate-800 shadow-sm'
              : 'text-slate-500 hover:text-slate-700'
            }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SettingRow({
  label,
  desc,
  children,
}: {
  label: string;
  desc: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-slate-700">{label}</p>
        <p className="text-[11px] text-slate-500 mt-0.5">{desc}</p>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

const LEAVE_PATTERNS = [
  { value: 'long_weekend', label: '긴 주말', desc: '공휴일 연계 4일+', icon: 'ri-sun-line' },
  { value: 'weekday', label: '주중 여유', desc: '화·수·목 위주 사용', icon: 'ri-briefcase-line' },
  { value: 'consecutive', label: '연속 휴가', desc: '5일 이상 몰아서', icon: 'ri-map-line' },
  { value: 'any', label: '상관없음', desc: '패턴 없이 자유롭게', icon: 'ri-shuffle-line' },
];

export default function AIPreferenceSection() {
  const [aiLang, setAiLang] = useState('ko');
  const [aiDetail, setAiDetail] = useState('standard');
  const [aiRag, setAiRag] = useState('all');
  const [autoAnalysis, setAutoAnalysis] = useState(true);
  const [citeSources, setCiteSources] = useState(true);
  const [leavePattern, setLeavePattern] = useState('long_weekend');
  const [leaveDefault, setLeaveDefault] = useState('annual');
  const [leaveStrategy, setLeaveStrategy] = useState('ai_optimize');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-slate-800">개인 설정</h2>
          <p className="text-[12px] text-slate-500 mt-0.5">AI 어시스턴트와 휴가 선호도를 설정합니다</p>
        </div>
        <button
          onClick={handleSave}
          className="px-3 py-1.5 rounded-lg bg-teal-500 text-white text-[12px] font-medium hover:bg-teal-600 cursor-pointer transition-colors whitespace-nowrap"
        >
          변경사항 저장
        </button>
      </div>

      {/* AI 어시스턴트 설정 */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-robot-2-line text-sm text-teal-500" />
          </div>
          <p className="text-[12px] font-semibold text-slate-600">AI 어시스턴트 설정</p>
        </div>
        <div className="divide-y divide-slate-100 px-4">
          <div className="py-4">
            <SettingRow label="응답 언어" desc="AI 어시스턴트가 사용할 언어를 선택합니다">
              <SegmentControl
                options={[
                  { value: 'ko', label: '한국어' },
                  { value: 'en', label: 'English' },
                ]}
                value={aiLang}
                onChange={setAiLang}
              />
            </SettingRow>
          </div>
          <div className="py-4">
            <SettingRow label="응답 상세도" desc="AI 답변의 길이와 자세함을 조정합니다">
              <SegmentControl
                options={[
                  { value: 'brief', label: '간결' },
                  { value: 'standard', label: '표준' },
                  { value: 'detailed', label: '상세' },
                ]}
                value={aiDetail}
                onChange={setAiDetail}
              />
            </SettingRow>
          </div>
          <div className="py-4">
            <SettingRow label="RAG 검색 범위" desc="AI가 참조할 내부 문서 범위를 설정합니다">
              <SegmentControl
                options={[
                  { value: 'all', label: '전체' },
                  { value: 'hr', label: 'HR만' },
                  { value: 'legal', label: '법무만' },
                ]}
                value={aiRag}
                onChange={setAiRag}
              />
            </SettingRow>
          </div>
          <div className="py-4">
            <SettingRow
              label="자동 휴가 패턴 분석"
              desc="AI가 내 휴가 패턴을 학습하여 최적 슬롯을 제안합니다"
            >
              <ToggleSwitch checked={autoAnalysis} onChange={setAutoAnalysis} />
            </SettingRow>
          </div>
          <div className="py-4">
            <SettingRow
              label="문서 출처 표시"
              desc="AI 답변 하단에 참조한 내부 문서를 항상 표시합니다"
            >
              <ToggleSwitch checked={citeSources} onChange={setCiteSources} />
            </SettingRow>
          </div>
        </div>
      </div>

      {/* 휴가 선호도 */}
      <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
          <div className="w-5 h-5 flex items-center justify-center">
            <i className="ri-calendar-event-line text-sm text-teal-500" />
          </div>
          <p className="text-[12px] font-semibold text-slate-600">휴가 & 일정 선호도</p>
        </div>
        <div className="divide-y divide-slate-100 px-4">
          <div className="py-4">
            <p className="text-[13px] font-medium text-slate-700 mb-1">선호 휴가 패턴</p>
            <p className="text-[11px] text-slate-500 mb-3">
              AI 추천 시 이 패턴을 우선적으로 고려합니다
            </p>
            <div className="grid grid-cols-2 gap-2">
              {LEAVE_PATTERNS.map((opt) => {
                const isActive = leavePattern === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setLeavePattern(opt.value)}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-left cursor-pointer transition-all
                      ${isActive
                        ? 'border-teal-300 bg-teal-50'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                  >
                    <div
                      className={`w-7 h-7 flex items-center justify-center rounded-lg flex-shrink-0 ${
                        isActive ? 'bg-teal-100' : 'bg-slate-100'
                      }`}
                    >
                      <i
                        className={`${opt.icon} text-sm ${
                          isActive ? 'text-teal-600' : 'text-slate-500'
                        }`}
                      />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={`text-[12px] font-semibold ${
                          isActive ? 'text-teal-700' : 'text-slate-700'
                        }`}
                      >
                        {opt.label}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{opt.desc}</p>
                    </div>
                    {isActive && (
                      <div className="ml-auto flex-shrink-0">
                        <i className="ri-check-line text-teal-500 text-sm" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="py-4">
            <SettingRow label="기본 휴가 유형" desc="일정 추가 시 기본으로 선택될 유형입니다">
              <SegmentControl
                options={[
                  { value: 'annual', label: '연차' },
                  { value: 'half', label: '반차' },
                ]}
                value={leaveDefault}
                onChange={setLeaveDefault}
              />
            </SettingRow>
          </div>
          <div className="py-4">
            <SettingRow label="연차 소진 전략" desc="남은 연차를 어떻게 활용할지 설정합니다">
              <SegmentControl
                options={[
                  { value: 'fast', label: '빠른 소진' },
                  { value: 'slow', label: '분산 사용' },
                  { value: 'ai_optimize', label: 'AI 최적화' },
                ]}
                value={leaveStrategy}
                onChange={setLeaveStrategy}
              />
            </SettingRow>
          </div>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-2 p-3 bg-teal-50 border border-teal-100 rounded-lg">
          <i className="ri-check-line text-teal-500 text-sm" />
          <span className="text-[12px] text-teal-700 font-medium">설정이 저장되었습니다.</span>
        </div>
      )}
    </div>
  );
}