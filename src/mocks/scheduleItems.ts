export type ScheduleType = '휴가' | '반차' | '회의' | '출장' | '기타';

export interface ScheduleItem {
  id: number;
  title: string;
  date: string;
  type: ScheduleType;
  description: string;
  startTime?: string;
  endTime?: string;
}

export const scheduleItems: ScheduleItem[] = [
  {
    id: 1,
    title: '현충일',
    date: '2026-06-06',
    type: '기타',
    description: '법정 공휴일',
  },
  {
    id: 2,
    title: 'AI 추천 휴가',
    date: '2026-06-07',
    type: '휴가',
    description: '현충일 연계 4일 연속 휴가 (AI 추천)',
  },
  {
    id: 3,
    title: '팀 주간 회의',
    date: '2026-06-08',
    type: '회의',
    description: '매주 월요일 팀 스탠드업 미팅',
    startTime: '10:00',
    endTime: '11:00',
  },
  {
    id: 4,
    title: '부산 출장',
    date: '2026-06-15',
    type: '출장',
    description: '파트너사 계약 협의 미팅',
    startTime: '09:00',
    endTime: '18:00',
  },
  {
    id: 5,
    title: '오후 반차',
    date: '2026-06-19',
    type: '반차',
    description: '개인 사유',
    startTime: '14:00',
    endTime: '18:00',
  },
  {
    id: 6,
    title: '하반기 전략 회의',
    date: '2026-06-25',
    type: '회의',
    description: '2026 하반기 사업 계획 수립',
    startTime: '14:00',
    endTime: '17:00',
  },
  {
    id: 7,
    title: '정기 건강검진',
    date: '2026-06-29',
    type: '기타',
    description: '사내 정기 건강검진',
    startTime: '09:00',
    endTime: '12:00',
  },
];