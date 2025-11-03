import { useState, useEffect } from "react";

interface SliderProps {
  min: number;
  max: number;
  value: number[];
  onChange: (value: number[]) => void;
  formatLabel?: (value: number) => string;
}

export default function Slider({
  min,
  max,
  value,
  onChange,
  formatLabel = (v) => v.toString(),
}: SliderProps) {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (index: number, newValue: number) => {
    const newValues = [...localValue];
    newValues[index] = Math.min(max, Math.max(min, newValue));

    // Ensure min <= max
    if (index === 0 && newValues[0] > newValues[1]) {
      newValues[0] = newValues[1];
    } else if (index === 1 && newValues[1] < newValues[0]) {
      newValues[1] = newValues[0];
    }

    setLocalValue(newValues);
  };

  const handleMouseUp = () => {
    onChange(localValue);
  };

  const leftPercent = ((localValue[0] - min) / (max - min)) * 100;
  const rightPercent = 100 - ((localValue[1] - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      {/* Track */}
      <div className="relative h-2 bg-gray-200 rounded-full">
        {/* Active track */}
        <div
          className="absolute h-2 bg-green-500 rounded-full"
          style={{
            left: `${leftPercent}%`,
            right: `${rightPercent}%`,
          }}
        />
      </div>

      {/* Sliders */}
      <div className="relative h-0">
        {/* Min slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[0]}
          onChange={(e) => handleChange(0, Number(e.target.value))}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute w-full -top-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-green-600 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
        />

        {/* Max slider */}
        <input
          type="range"
          min={min}
          max={max}
          value={localValue[1]}
          onChange={(e) => handleChange(1, Number(e.target.value))}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleMouseUp}
          className="absolute w-full -top-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-green-600 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0"
        />
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between text-sm text-gray-600 pt-2">
        <span className="font-medium text-green-600">
          {formatLabel(localValue[0])}
        </span>
        <span className="text-gray-400">-</span>
        <span className="font-medium text-green-600">
          {formatLabel(localValue[1])}
        </span>
      </div>
    </div>
  );
}
