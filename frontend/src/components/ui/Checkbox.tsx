interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}

export default function Checkbox({
  label,
  checked,
  onChange,
  count,
}: CheckboxProps) {
  return (
    <label className="flex items-center justify-between gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors group">
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="w-4 h-4 accent-green-600 cursor-pointer"
        />
        <span className="text-sm group-hover:text-green-600">{label}</span>
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-400">({count})</span>
      )}
    </label>
  );
}
