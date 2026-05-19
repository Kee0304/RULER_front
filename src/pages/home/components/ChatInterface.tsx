import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { source, type ChatMessage } from '@/mocks/chatMessages';
import { apiFetch } from '@/hooks/useApiFetch';

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
  isLocal?: boolean;
}

interface ChatInterfaceProps {
  userInfo?: { name: string; department: string; initials: string };
}

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
                {src.filename}
              </span>
            ))}
          </div>
        )}
        {msg.time && <span className="text-[10px] text-slate-400 px-1">{msg.time}</span>}
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
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('chat');
  const [input, setInput] = useState('');
  const [sendLoading, setSendLoading] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [loadingSessions, setLoadingSessions] = useState(true);

  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadedHistoryRef = useRef<Set<string>>(new Set());

  const selectedSession = useMemo(
    () => sessions.find((s) => s.id === selectedSessionId) || null,
    [sessions, selectedSessionId]
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedSession?.messages, sendLoading]);

  // Fetch sessions on mount
  useEffect(() => {
    apiFetch<{ session_id: string; user_id: string; title: string }[]>('/sessions/1')
      .then((data) => {
        const mapped: ChatSession[] = data.map((s) => ({
          id: s.session_id,
          title: s.title,
          messages: [],
          updatedAt: new Date().toISOString(),
        }));
        mapped.push({
          id: `new-${Date.now()}`,
          title: '새 채팅',
          messages: [],
          updatedAt: new Date().toISOString(),
          isLocal: true,
        });
        setSessions(mapped);
        setSelectedSessionId(mapped.find((s) => !s.isLocal)?.id || mapped[0]?.id || null);
      })
      .catch(() => {
        const newChat: ChatSession = {
          id: `new-${Date.now()}`,
          title: '새 채팅',
          messages: [],
          updatedAt: new Date().toISOString(),
          isLocal: true,
        };
        setSessions([newChat]);
        setSelectedSessionId(newChat.id);
      })
      .finally(() => setLoadingSessions(false));
  }, []);

  // Fetch history when selecting a non-local session
  useEffect(() => {
    if (!selectedSessionId || selectedSessionId.startsWith('new-')) return;
    if (loadedHistoryRef.current.has(selectedSessionId)) return;

    const session = sessions.find((s) => s.id === selectedSessionId);
    if (!session || session.messages.length > 0) return;

    loadedHistoryRef.current.add(selectedSessionId);

    apiFetch<{ session_id: string; messages: { role: string; content: string }[] }>(
      `/sessions/${selectedSessionId}/history`
    )
      .then((data) => {
        const messages: ChatMessage[] = data.messages.map((m, idx) => ({
          id: idx + 1,
          sender: m.role === 'user' ? 'user' : 'ai',
          text: m.content,
          time: '',
        }));
        setSessions((prev) =>
          prev.map((s) => (s.id === selectedSessionId ? { ...s, messages } : s))
        );
      })
      .catch(() => {
        loadedHistoryRef.current.delete(selectedSessionId);
      });
  }, [selectedSessionId, sessions]);

  const createNewSession = useCallback(() => {
    const newId = `new-${Date.now()}`;
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.messages.length > 0 || !s.isLocal);
      return [
        ...filtered,
        {
          id: newId,
          title: '새 채팅',
          messages: [],
          updatedAt: new Date().toISOString(),
          isLocal: true,
        },
      ];
    });
    setSelectedSessionId(newId);
    setMobileView('chat');
    setSendError(null);
    setAttachedFile(null);
  }, []);

  const handleSelectSession = (id: string) => {
    setSelectedSessionId(id);
    setMobileView('chat');
    setSendError(null);
    setAttachedFile(null);
  };

  const handleBackToList = () => {
    setSessions((prev) => prev.filter((s) => s.messages.length > 0 || !s.isLocal));
    setSelectedSessionId(null);
    setMobileView('list');
    setSendError(null);
    setAttachedFile(null);
  };

  const handleAttachClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setAttachedFile(file);
    }
    e.target.value = '';
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || !selectedSession || sendLoading) return;

    let currentSessionId = selectedSession.id;
    const previousMessages = selectedSession.messages;
    const originalSessionId = selectedSession.id;

    // 1. Create new session if needed
    const isNewLocalSession = selectedSession.isLocal || selectedSession.id.startsWith('new-');
    if (isNewLocalSession) {
      try {
        const newSession = await apiFetch<{
          session_id: string;
          user_id: string;
          title: string;
        }>('/sessions', { method: 'POST', body: {"user_id": "1", "title": trimmed} });

        currentSessionId = newSession.session_id;

        setSessions((prev) =>
          prev.map((s) =>
            s.id === originalSessionId
              ? { ...s, id: currentSessionId, title: newSession.title || '새 채팅', isLocal: false }
              : s
          )
        );
        setSelectedSessionId(currentSessionId);
      } catch (err: any) {
        setSendError('새 채팅 세션 생성에 실패했습니다: ' + (err.message || ''));
        return;
      }
    }

    // 2. Upload PDF if attached
    if (attachedFile) {
      const formData = new FormData();
      formData.append('file', attachedFile);
      try {
        await fetch('/upload-pdf', {
          method: 'POST',
          body: formData,
          headers: {'Content-Type': 'multipart/form-data'}
        });
        setAttachedFile(null);
      } catch (err: any) {
        setSendError(`PDF 업로드에 실패했습니다: ${err.message || ''}`);
        return;
      }
    }

    // 3. Add user message to UI
    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== currentSessionId) return s;
        const isFirstUserMessage = s.messages.filter((m) => m.sender === 'user').length === 0;
        return {
          ...s,
          messages: [...s.messages, userMsg],
          updatedAt: new Date().toISOString(),
          title: isFirstUserMessage
            ? trimmed.slice(0, 18) + (trimmed.length > 18 ? '...' : '')
            : s.title,
        };
      })
    );

    setInput('');
    setSendError(null);
    setSendLoading(true);

    // 4. Build API message history
    const apiMessages = [
      ...previousMessages.map((m) => ({
        role: m.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: m.text,
      })),
      { role: 'user' as const, content: trimmed },
    ];

    // 5. Send to API
    try {
      const res = await apiFetch<{
        answer: string;
        intent: string;
        sources: { filename: string; page_count?: number; chunk_count?: number }[];
        mock_context: Record<string, unknown>;
      }>('/ask', {
        method: 'POST',
        body: { question: trimmed, user_id: '1', session_id: currentSessionId },
      });

      const aiText = res.answer || '응답을 받지 못했습니다.';
      const aiSources = res.sources || [];

      const aiReply: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: aiSources,
      };

      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== currentSessionId) return s;
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
            {loadingSessions && (
              <div className="px-3 py-4 space-y-3">
                <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
                <div className="h-3 w-24 bg-slate-100 rounded animate-pulse" />
                <div className="h-3 w-28 bg-slate-100 rounded animate-pulse" />
              </div>
            )}
            {!loadingSessions && sessions.length === 0 && (
              <p className="text-[12px] text-slate-400 text-center py-4">채팅 내역이 없습니다</p>
            )}
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
                  <div className="flex items-start justify-between gap-2 min-w-0">
                    <p
                      className={`text-[12px] font-medium truncate flex-1 min-w-0 ${
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
                    <p className="text-[11px] text-slate-400 truncate mt-0.5 min-w-0">
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
            {selectedSession && selectedSession.messages.length === 0 && !sendLoading && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center">
                  <i className="ri-robot-2-line text-2xl text-slate-300" />
                </div>
                <p className="text-[13px] text-slate-400">
                  인사 정책, 휴가 신청, 법무 문서 등에 대해 질문하세요
                </p>
              </div>
            )}

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
            {attachedFile && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-lg mb-2">
                <i className="ri-file-pdf-line text-amber-600 text-sm" />
                <span className="text-[11px] text-amber-700 font-medium truncate flex-1 min-w-0">
                  {attachedFile.name}
                </span>
                <button
                  onClick={() => setAttachedFile(null)}
                  className="w-5 h-5 flex items-center justify-center rounded hover:bg-amber-100 cursor-pointer transition-colors flex-shrink-0"
                >
                  <i className="ri-close-line text-amber-500 text-xs" />
                </button>
              </div>
            )}
            <div className="flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-100 transition-all">
              <button
                title="문서 첨부"
                onClick={handleAttachClick}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-teal-500 cursor-pointer transition-colors flex-shrink-0 mb-0.5"
              >
                <i className="ri-attachment-2 text-base" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="hidden"
              />
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