import React from "react";
import clsx from "clsx";
import { Radio } from "./Radio";

type RadioOption = {
  label: React.ReactNode;
  value: string;
};

type RadioGroupProps = {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
};

export const RadioGroup: React.FC<RadioGroupProps> = ({
  name,
  options,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={clsx("space-y-2", className)}>
      {options.map((option) => (
        <Radio
          key={option.value}
          name={name}
          label={option.label}
          value={option.value}
          checkedValue={value}
          onChange={onChange}
        />
      ))}
    </div>
  );
};

export default RadioGroup;
