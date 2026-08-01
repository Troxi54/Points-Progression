import cn from "@core/utils/tailwind";
import { ComponentProps, useId } from "react";
import ChevronDown from "./icons/ChevronDown";

type Value = string;

export interface SelectOption<T extends Value> {
  value: T;
  label: string;
}

interface SelectProps<T extends Value> extends Omit<
  ComponentProps<"select">,
  "children"
> {
  label?: string;
  options: SelectOption<T>[];
}

function Select<T extends Value>({
  label,
  options,
  className = "",
  id,
  disabled,
  ...props
}: SelectProps<T>) {
  const defaultId = useId();
  const selectId = id || defaultId;

  return (
    <div className={cn("flex flex-col gap-[0.4em]", className)}>
      {label && (
        <label
          htmlFor={selectId}
          className={`text-center text-[1em] font-medium`}
        >
          {label}
        </label>
      )}

      <div className="relative w-full">
        <div className="pointer-events-none absolute top-1/2 right-[0.425em] -translate-y-1/2">
          <ChevronDown className="w-[1.5em]" />
        </div>
        <select
          id={selectId}
          disabled={disabled}
          className={cn(
            "bg-menu-button-bg w-full cursor-pointer appearance-none rounded-[0.375em] px-[0.85em] py-[0.5em] text-[1em] font-semibold transition-[background-color] duration-100 ease-linear outline-none",
          )}
          {...props}
        >
          {options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default Select;
