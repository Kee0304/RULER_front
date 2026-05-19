interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
}

export default function ErrorModal({ isOpen, onClose, message }: ErrorModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-lg border border-red-100 p-6 w-full max-w-sm mx-4">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-50">
            <i className="ri-error-warning-line text-red-500 text-2xl" />
          </div>
          <div>
            <p className="text-[15px] font-semibold text-slate-800">요청 실패</p>
            <p className="text-[13px] text-slate-500 mt-1">{message}</p>
          </div>
          <button
            onClick={onClose}
            className="mt-2 w-full py-2.5 rounded-lg bg-navy-900 text-white text-[13px] font-medium hover:bg-navy-800 cursor-pointer transition-colors whitespace-nowrap"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}