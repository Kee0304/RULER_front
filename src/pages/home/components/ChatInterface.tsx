import { useState, useRef, useEffect } from 'react';
import { chatMessages, type ChatMessage } from '@/mocks/chatMessages';

function AiAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy-700 to-navy-900 border border-teal-500/30 flex items-center justify-center flex-shrink-0">
      <i className="ri-robot-2-line text-teal-400 text-sm" />
    </div>
  );
}

function MessageBubble({ msg }: { msg: ChatMessage }) {
  const isUser = msg.sender === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && <AiAvatar />}
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0 text-white text-xs font-bold">
          EA
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

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const aiReply: ChatMessage = {
        id: Date.now() + 1,
        sender: 'ai',
        text: '요청을 확인했습니다. 지식 베이스를 검색 중입니다. 인사 규정 2026 및 노동법 문서를 바탕으로 공리한 답변을 제공해 드리겠습니다. 추가로 더 알고 싶으신 사항이 있으신가요?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: ['인사 규정 2026.pdf', '노동법 자주 묻는 질문'],
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 1800);
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
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-white">
        <div className="w-9 h-9 rounded-xl bg-navy-900 flex items-center justify-center flex-shrink-0">
          <i className="ri-robot-2-line text-teal-400 text-base" />
        </div>
        <div>
          <p className="text-[13px] font-semibold text-slate-800">법무 & 인사 AI 어시스턴트</p>
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
      <div className="px-5 py-2.5 bg-teal-50 border-b border-teal-100 flex items-center gap-2">
        <i className="ri-shield-check-line text-teal-500 text-xs" />
        <span className="text-[11px] text-teal-700 font-medium">사내 RAG 기반 · 모든 답변은 내부 문서를 참조합니다</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}

        {isTyping && (
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

      {/* Input area */}
      <div className="px-4 py-3 border-t border-slate-100 bg-white">
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
            placeholder="인사 정책, 휴가 신청, 법무 문서 등에 대해 질문하세요..."
            rows={1}
            className="flex-1 bg-transparent text-[13px] text-slate-700 placeholder-slate-400 resize-none outline-none leading-relaxed min-h-[24px] max-h-[120px]"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-navy-900 text-white hover:bg-navy-700 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-all flex-shrink-0 mb-0.5"
          >
            <i className="ri-send-plane-fill text-sm" />
          </button>
        </div>
        <p className="text-[10px] text-slate-400 text-center mt-2">
          Enter로 전송 · Shift+Enter로 줄바꾸 · 답변은 내부 문서 참조
        </p>
      </div>
    </div>
  );
}