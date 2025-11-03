import React from "react";
import { type FilterConfig } from "@/config/filterConfig";
import type { FilterState } from "@/types/filter";
import { CollapsibleSection } from "@/components/ui/CollapsibleSection";
import { RadioGroup } from "@/components/ui/RadioGroup";
import Slider from "@/components/ui/Slider";
import { StarRating } from "@/components/ui/StarRating";
import Checkbox from "@/components/ui/Checkbox";

interface Props {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  config: FilterConfig[];
}

const DynamicFilterRenderer: React.FC<Props> = ({
  filters,
  setFilters,
  config,
}) => {
  return (
    <>
      {config.map((filter) => {
        const key = filter.key as keyof FilterState;
        const currentValue = filters[key];

        switch (filter.type) {
          case "checkbox":
            return (
              <CollapsibleSection key={filter.key} title={filter.label}>
                <div className="space-y-2">
                  {filter.options?.map((option) => (
                    <Checkbox
                      key={option}
                      label={option}
                      checked={
                        Array.isArray(currentValue) &&
                        (currentValue as string[]).includes(option)
                      }
                      onChange={(checked) => {
                        const prev = Array.isArray(currentValue)
                          ? currentValue
                          : [];
                        const next = checked
                          ? [...prev, option]
                          : prev.filter((item) => item !== option);

                        setFilters({ ...filters, [key]: next });
                      }}
                    />
                  ))}
                </div>
              </CollapsibleSection>
            );

          case "radio": {
            const radioOptions =
              filter.key === "rating"
                ? (filter.options || []).map((value) => ({
                    value,
                    label: (
                      <div className="flex items-center gap-1">
                        <StarRating
                          rating={parseFloat(value)}
                          showValue={false}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-100">
                          Từ {value} trở lên
                        </span>
                      </div>
                    ),
                  }))
                : (filter.options || []).map((value) => ({
                    value,
                    label: value,
                  }));

            return (
              <CollapsibleSection
                key={filter.key}
                title={filter.label}
                maxHeightPx={160}
                className="border-t"
              >
                <RadioGroup
                  name={filter.key}
                  options={radioOptions}
                  value={currentValue as string}
                  onChange={(val) => setFilters({ ...filters, [key]: val })}
                />
              </CollapsibleSection>
            );
          }

          case "slider":
            return (
              <CollapsibleSection key={filter.key} title={filter.label}>
                <Slider
                  value={
                    (currentValue || [
                      filter.min || 0,
                      filter.max || 10000000,
                    ]) as [number, number]
                  }
                  onChange={(val) => setFilters({ ...filters, [key]: val })}
                  min={filter.min ?? 0}
                  max={filter.max ?? 10000000}
                  step={filter.step ?? 100000}
                  unit={filter.unit}
                />
              </CollapsibleSection>
            );

          default:
            return null;
        }
      })}
    </>
  );
};

export default DynamicFilterRenderer;
