interface DataErrorOverlayProps {
  message: string;
  subMessage?: string;
}

export default function DataErrorOverlay({ message, subMessage }: DataErrorOverlayProps) {
  return (
    <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center gap-2 rounded-xl pointer-events-none">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-50">
        <i className="ri-error-warning-line text-red-500 text-lg" />
      </div>
      <p className="text-[12px] text-slate-600 font-medium">{message}</p>
      {subMessage && <p className="text-[11px] text-slate-400 max-w-[80%] text-center">{subMessage}</p>}
    </div>
  );
}