export interface source {
  filename: string; page_count?: number; chunk_count?: number
}

export interface ChatMessage {
  id: number;
  sender: 'user' | 'ai';
  text: string;
  time: string;
  sources?: source[];
}

export const chatMessages: ChatMessage[] = [
  {
    id: 1,
    sender: 'ai',
    text: '안녕하세요, A 직원님! 저는 법무 & 인사 AI 어시스턴트입니다. 사내 정책, 휴가 관리, 인사 관련 질문, 노동법 문의 등 무엇이든 도와드릴 수 있습니다. 오늘 어떤 도움이 필요하신가요?',
    time: '오전 09:00',
  },
  {
    id: 2,
    sender: 'user',
    text: '안녕하세요! 근로계약 변경 신청 절차를 알려주실 수 있나요?',
    time: '오전 09:14',
  },
  {
    id: 3,
    sender: 'ai',
    text: '물론입니다! 근로계약 정책 제4조 3항에 따르면, 계약 변경 신청 절차는 다음과 같습니다: (1) 인트라넷 포털에서 HR-22A 양식을 작성하고, (2) 직속 관리자의 서명을 받은 후, (3) 희망 적용일로부터 최소 15 영업일 전에 인사팀에 제출해야 합니다. 급여 관련 변경 사항은 재무팀의 추가 검토가 필요합니다.',
    time: '오전 09:14',
    sources: [{ filename: '근로계약 정책 v2.pdf', page_count: 1, chunk_count: 1 }, { filename: 'HR 양식 목록', page_count: 1, chunk_count: 1 }],
  },
  {
    id: 4,
    sender: 'user',
    text: '곧 휴가를 사용하고 싶어요. 남은 연차를 가장 잘 활용하는 방법이 뭔가요?',
    time: '오전 10:32',
  },
  {
    id: 5,
    sender: 'ai',
    text: '안녕하세요, A 직원님. 현재 남은 연차는 4.5일입니다. 긴 연휴를 선호하시는 패턴을 분석한 결과, 현충일 공휴일(6월 6일, 목요일) 다음 날인 6월 7일(금요일)에 휴가를 사용하시길 추천드립니다. 이렇게 하면 4일 연속 휴가가 가능합니다. 사내 인사 규정 제12조에 따르면 반차 사용도 가능합니다.',
    time: '오전 10:32',
    sources: [{ filename: '인사 규정 2026.pdf', page_count: 1, chunk_count: 1 }, { filename: '연차 잔여 시스템', page_count: 1, chunk_count: 1 }, { filename: '2026년 공휴일 캘린더', page_count: 1, chunk_count: 1 }],
  },
];