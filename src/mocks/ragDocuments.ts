export interface RagDocument {
  id: number;
  name: string;
  status: 'Indexed' | 'Updated' | 'Processing' | 'Pending';
  date: string;
  icon: string;
  size: string;
  category: string;
}

export const ragDocuments: RagDocument[] = [
  {
    id: 1,
    name: '인사 규정 2026.pdf',
    status: 'Indexed',
    date: '2026년 5월 갱신',
    icon: 'ri-file-pdf-line',
    size: '2.4 MB',
    category: 'HR',
  },
  {
    id: 2,
    name: '노동법 자주 묻는 질문',
    status: 'Updated',
    date: '2026년 4월 갱신',
    icon: 'ri-question-answer-line',
    size: '0.8 MB',
    category: '법무',
  },
  {
    id: 3,
    name: '직원 안내서 v3.2',
    status: 'Indexed',
    date: '2026년 1월',
    icon: 'ri-book-2-line',
    size: '5.1 MB',
    category: '일반',
  },
  {
    id: 4,
    name: '휴가 & 복리후생 가이드',
    status: 'Indexed',
    date: '2026년 3월',
    icon: 'ri-calendar-check-line',
    size: '1.2 MB',
    category: 'HR',
  },
];