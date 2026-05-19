interface ToggleSwitchProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}

export default function ToggleSwitch({ checked, onChange, disabled = false }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0
        ${checked ? 'bg-teal-500' : 'bg-slate-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
      `}
    >
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200"
        style={{ left: '2px', transform: checked ? 'translateX(20px)' : 'translateX(0)' }}
      />
    </button>
  );
}