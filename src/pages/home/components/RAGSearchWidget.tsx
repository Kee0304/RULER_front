import { ragDocuments } from '@/mocks/ragDocuments';

const statusConfig: Record<string, { label: string; className: string; dot: string }> = {
  Indexed: {
    label: '색인완료',
    className: 'text-teal-600 bg-teal-50 border-teal-100',
    dot: 'bg-teal-400',
  },
  Updated: {
    label: '갱신됨',
    className: 'text-amber-600 bg-amber-50 border-amber-100',
    dot: 'bg-amber-400',
  },
  Processing: {
    label: '처리중',
    className: 'text-sky-600 bg-sky-50 border-sky-100',
    dot: 'bg-sky-400',
  },
  Pending: {
    label: '대기중',
    className: 'text-slate-500 bg-slate-50 border-slate-200',
    dot: 'bg-slate-300',
  },
};

const categoryColors: Record<string, string> = {
  HR: 'text-teal-600 bg-teal-50',
  '법무': 'text-amber-600 bg-amber-50',
  '일반': 'text-slate-600 bg-slate-100',
};

export default function RAGSearchWidget() {
  const indexed = ragDocuments.filter((d) => d.status === 'Indexed').length;
  const total = ragDocuments.length;

  return (
    <div className="bg-white rounded-xl shadow-widget border border-slate-100 p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-[13px] font-semibold text-slate-800">지식 베이스</p>
          <p className="text-[11px] text-slate-500 mt-0.5">사내 RAG 검색 현황</p>
        </div>
        <button className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">
          <i className="ri-refresh-line text-sm" />
        </button>
      </div>

      {/* Summary bar */}
      <div className="flex items-center gap-3 mb-3 bg-slate-50 rounded-lg px-3 py-2">
        <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
          <i className="ri-database-2-line text-teal-500 text-base" />
        </div>
        <div className="flex-1">
          <p className="text-[11px] text-slate-600 font-medium">전체 {total}개 중 {indexed}개 색인 완료</p>
          <div className="w-full bg-slate-200 rounded-full h-1 mt-1">
            <div
              className="bg-teal-400 h-1 rounded-full"
              style={{ width: `${(indexed / total) * 100}%` }}
            />
          </div>
        </div>
        <span className="text-[12px] font-bold text-teal-600">{Math.round((indexed / total) * 100)}%</span>
      </div>

      {/* Document list */}
      <div className="space-y-2">
        {ragDocuments.map((doc) => {
          const status = statusConfig[doc.status];
          return (
            <div
              key={doc.id}
              className="flex items-center gap-3 p-2.5 rounded-lg border border-slate-100 hover:border-teal-100 hover:bg-teal-50/30 transition-all cursor-pointer group"
            >
              <div className="w-7 h-7 flex items-center justify-center flex-shrink-0">
                <i className={`${doc.icon} text-base text-slate-500 group-hover:text-teal-500 transition-colors`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-slate-700 truncate">{doc.name}</p>
                <p className="text-[10px] text-slate-400">{doc.date} · {doc.size}</p>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.className}`}>
                  {status.label}
                </span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${categoryColors[doc.category] ?? 'text-slate-500 bg-slate-100'}`}>
                  {doc.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 inline-block" />
          <span className="text-[11px] text-slate-500">마지막 동기화: 5분 전</span>
        </div>
        <button className="text-[11px] text-teal-600 font-medium hover:text-teal-700 cursor-pointer transition-colors">
          모든 문서 보기
        </button>
      </div>
    </div>
  );
}