interface Props {
  selectedRange: [number, number];
  onChange: (min: number, max: number) => void;
  ranges: { label: string; min: number; max: number }[];
}

const RangeFilter: React.FC<Props> = ({ selectedRange, onChange, ranges }) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">Khoảng giá</label>
      <div className="space-y-2">
        {ranges.map((range) => (
          <button
            key={range.label}
            onClick={() => onChange(range.min, range.max)}
            className={`w-full text-left px-3 py-1 rounded border ${
              selectedRange[0] === range.min && selectedRange[1] === range.max
                ? "bg-blue-500 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RangeFilter;
