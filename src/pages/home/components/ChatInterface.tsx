import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { type ChatMessage } from '@/mocks/chatMessages';
import { apiFetch } from '@/hooks/useApiFetch';

interface ChatSession {
  id: number;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}

interface ChatInterfaceProps {
  userInfo?: { name: string; department: string; initials: string };
}

const DEMO_SESSIONS: ChatSession[] = [
  {
    id: 1,
    title: '내가 현재 연차가 11일 남았는데 6월 이후로 언제 쓰면 좋을 거 같아?',
    messages: [
      {
        id: 101,
        sender: 'user',
        text: '내가 현재 연차가 11일 남았는데 6월 이후로 언제 쓰면 좋을 거 같아?',
        time: '10:30',
      },
      {
        id: 102,
        sender: 'ai',
        text: '6월 이후 남은 11일 연차를 효율적으로 사용하시려면, 9월 초나 10월 중순을 추천드립니다. 특히 추석 연휴(10월 1~3일 예상)와 연계하면 최대 5일의 긴 휴가를 만들 수 있어요. 또한 8월 중순은 업무 비수기인 경우가 많아 팀에 부담을 덜 줄 수 있습니다. 구체적인 날짜는 부서 일정을 확인 후 결정하시는 것이 좋습니다.',
        time: '10:31',
        sources: ['연차 관리 지침 v2.1', '휴가 추천 시스템 가이드'],
      },
    ],
    updatedAt: '2026-05-19T10:31:00Z',
  },
  {
    id: 2,
    title: '새 채팅',
    messages: [],
    updatedAt: new Date().toISOString(),
  },
];

function AiAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy-700 to-navy-900 border border-teal-500/30 flex items-center justify-center flex-shrink-0">
      <i className="ri-robot-2-line text-teal-400 text-sm" />
    </div>
  );
}

function MessageBubble({ msg, userInfo }: { msg: ChatMessage; userInfo?: { initials: string } }) {
  const isUser = msg.sender === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && <AiAvatar />}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
          {userInfo?.initials ?? 'EA'}
        </div>
      )}
      <div className={`max-w-[76%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div
          className={`rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
            isUser
              ? 'bg-navy-900 text-white rounded-tr-sm'
              : 'bg-slate-50 border border-slate-100 text-slate-700 rounded-tl-sm'
          }`}
        >
          {msg.text}
        </div>
        {msg.sources && msg.sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-0.5">
            {msg.sources.map((src, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 text-[10px] text-teal-600 bg-teal-50 border border-teal-100 rounded-full px-2 py-0.5 font-medium"
              >
                <i className="ri-link text-[9px]" />
                {src}
              </span>
            ))}
          </div>
        )}
        <span className="text-[10px] text-slate-400 px-1">{msg.time}</span>
      </div>
    </div>
  );
}

function ChatSkeleton() {
  return (
    <div className="space-y-5">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse flex-shrink-0" />
        <div className="max-w-[76%] space-y-1.5">
          <div className="rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-100 px-4 py-3">
            <div className="h-3 w-48 bg-slate-100 rounded animate-pulse mb-1.5" />
            <div className="h-3 w-36 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="h-2.5 w-8 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
      <div className="flex gap-3 flex-row-reverse">
        <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse flex-shrink-0" />
        <div className="max-w-[76%] space-y-1.5 items-end flex flex-col">
          <div className="rounded-2xl rounded-tr-sm bg-slate-100 px-4 py-3">
            <div className="h-3 w-40 bg-slate-200 rounded animate-pulse" />
          </div>
          <div className="h-2.5 w-8 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse flex-shrink-0" />
        <div className="max-w-[76%] space-y-1.5">
          <div className="rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-100 px-4 py-3">
            <div className="h-3 w-56 bg-slate-100 rounded animate-pulse mb-1.5" />
            <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
          </div>
          <div className="h-2.5 w-8 bg-slate-100 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}

function formatSessionTime(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return '방금';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;
  return `${d.getMonth() + 1}월 ${d.getDate()}일`;
}

export default function ChatInterface({ userInfo }: ChatInterfaceProps) {
  const [sessions, setSessions] = useState<ChatSession[]>(DEMO_SESSIONS);
  const [selectedSessionId, setSelectedSessionId] = useState<number>(2);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('chat');
  const [input, setInput] = useState('');
  const [sendLoading, setSendLoading] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedSession = useMemo(
    () => sessions.find((s) => s.id === selectedSessionId) || null,
    [sessions, selectedSessionId]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedSession?.messages, sendLoading]);

  const createNewSession = useCallback(() => {
    const newId = Date.now();
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.messages.length > 0);
      return [
        ...filtered,
        { id: newId, title: '새 채팅', messages: [], updatedAt: new Date().toISOString() },
      ];
    });
    setSelectedSessionId(newId);
    setMobileView('chat');
  }, []);

  const handleSelectSession = (id: number) => {
    setSelectedSessionId(id);
    setMobileView('chat');
  };

  const handleBackToList = () => {
    setSessions((prev) => prev.filter((s) => s.messages.length > 0));
    setSelectedSessionId(null as unknown as number);
    setMobileView('list');
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || !selectedSession || sendLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== selectedSessionId) return s;
        const updatedMessages = [...s.messages, userMsg];
        const isFirstQuestion = updatedMessages.filter((m) => m.sender === 'user').length === 1;
        return {
          ...s,
          title:
            s.title === '새 채팅' && isFirstQuestion
              ? trimmed.slice(0, 18) + (trimmed.length > 18 ? '...' : '')
              : s.title,
          messages: updatedMessages,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    setInput('');
    setSendError(null);
    setSendLoading(true);

    const apiMessages = selectedSession.messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));
    apiMessages.push({ role: 'user', content: trimmed });

    try {
      const res = await apiFetch<{
        message?: { role?: string; content?: string; sources?: string[] };
        content?: string;
        sources?: string[];
      }>('/api/chat', {
        method: 'POST',
        body: { messages: apiMessages },
      });

      const aiText = res.message?.content || res.content || '응답을 받지 못했습니다.';
      const aiSources = res.message?.sources || res.sources;

      const aiReply: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: aiSources,
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== selectedSessionId) return s;
          return {
            ...s,
            messages: [...s.messages, aiReply],
            updatedAt: new Date().toISOString(),
          };
        })
      );
    } catch (err: any) {
      setSendError(err.message || '메시지 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setSendLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`;
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden shadow-widget border border-slate-100">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Chat list */}
        <div
          className={`flex flex-col border-r border-slate-100 bg-white lg:w-64 xl:w-72 lg:flex-shrink-0 ${
            mobileView === 'list' ? 'flex-1 lg:flex-none' : 'hidden lg:flex'
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
            <p className="text-[13px] font-semibold text-slate-800">채팅 목록</p>
            <button
              onClick={createNewSession}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors"
              title="새 채팅"
            >
              <i className="ri-add-line text-base" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
            {sessions.map((session) => {
              const isActive = session.id === selectedSessionId;
              const lastMsg = session.messages[session.messages.length - 1];
              return (
                <button
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={`w-full text-left rounded-lg px-3 py-2.5 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-slate-50 border border-slate-100'
                      : 'hover:bg-slate-50/60 border border-transparent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-[12px] font-medium truncate flex-1 ${
                        isActive ? 'text-slate-800' : 'text-slate-700'
                      }`}
                    >
                      {session.title}
                    </p>
                    <span className="text-[10px] text-slate-400 flex-shrink-0 mt-0.5">
                      {formatSessionTime(session.updatedAt)}
                    </span>
                  </div>
                  {lastMsg && (
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {lastMsg.sender === 'user' ? '나: ' : 'AI: '}
                      {lastMsg.text}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat content */}
        <div
          className={`flex flex-col flex-1 min-w-0 ${
            mobileView === 'chat' ? 'flex-1' : 'hidden lg:flex'
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-white flex-shrink-0">
            <button
              onClick={handleBackToList}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-50 cursor-pointer transition-colors flex-shrink-0"
            >
              <i className="ri-arrow-left-line text-base" />
            </button>

            <div className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center flex-shrink-0">
              <i className="ri-robot-2-line text-teal-400 text-base" />
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-800 truncate">
                법무 & 인사 AI 어시스턴트
              </p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 inline-block" />
                <span className="text-[11px] text-teal-600 font-medium">온라인 · RAG 기반</span>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
                <i className="ri-search-line text-sm" />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
                <i className="ri-more-2-fill text-sm" />
              </button>
            </div>
          </div>

          {/* Context banner */}
          <div className="px-5 py-2.5 bg-teal-50 border-b border-teal-100 flex items-center gap-2 flex-shrink-0">
            <i className="ri-shield-check-line text-teal-500 text-xs" />
            <span className="text-[11px] text-teal-700 font-medium">
              사내 RAG 기반 · 모든 답변은 내부 문서를 참조합니다
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 relative min-h-0">
            {(selectedSession?.messages || []).map((msg) => (
              <MessageBubble key={msg.id} msg={msg} userInfo={userInfo} />
            ))}

            {sendLoading && (
              <div className="flex gap-3">
                <AiAvatar />
                <div className="bg-slate-50 border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="typing-dot w-2 h-2 rounded-full bg-slate-400 inline-block" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-slate-400 inline-block" />
                  <span className="typing-dot w-2 h-2 rounded-full bg-slate-400 inline-block" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Send error banner */}
          {sendError && (
            <div className="px-4 py-2.5 bg-red-50 border-t border-red-100 flex items-center gap-2 flex-shrink-0">
              <i className="ri-error-warning-line text-red-500 text-xs" />
              <span className="text-[11px] text-red-600 font-medium flex-1">{sendError}</span>
              <button
                onClick={() => setSendError(null)}
                className="text-[11px] text-red-500 hover:text-red-700 font-medium cursor-pointer whitespace-nowrap"
              >
                닫기
              </button>
            </div>
          )}

          {/* Input area */}
          <div className="px-4 py-3 border-t border-slate-100 bg-white flex-shrink-0">
            <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
              <button
                title="문서 첨부"
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-teal-500 cursor-pointer transition-colors flex-shrink-0 mb-0.5"
              >
                <i className="ri-attachment-2 text-base" />
              </button>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={
                  selectedSession
                    ? '인사 정책, 휴가 신청, 법무 문서 등에 대해 질문하세요...'
                    : '채팅을 선택해주세요'
                }
                rows={1}
                disabled={!selectedSession || sendLoading}
                className="flex-1 bg-transparent text-[13px] text-slate-700 placeholder-slate-400 resize-none outline-none leading-relaxed min-h-[24px] max-h-[120px] disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || !selectedSession || sendLoading}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-navy-900 text-white hover:bg-navy-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all flex-shrink-0 mb-0.5"
              >
                <i className="ri-send-plane-fill text-sm" />
              </button>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">
              Enter로 전송 · Shift+Enter로 줄바꿈 · 답변은 내부 문서 참조
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}