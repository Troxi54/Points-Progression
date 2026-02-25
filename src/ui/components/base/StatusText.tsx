import { ClassName } from "@/core/types/react";
import { isFunction } from "@/core/utils/function";
import cn from "@core/utils/tailwind";
import { ReactNode } from "react";

interface Props {
  active: boolean;
  customNode?: ReactNode | ((active: boolean) => ReactNode);
  className?: ClassName;
  customEnabledClassName?: ClassName;
  customDisabledClassName?: ClassName;
}

function StatusText({
  active,
  customNode,
  className,
  customEnabledClassName,
  customDisabledClassName,
}: Props) {
  const custom = isFunction(customNode) ? customNode(active) : customNode;
  const node = custom === undefined ? (active ? "ON" : "OFF") : custom;

  const enabledClassName = customEnabledClassName ?? "text-enabled";
  const disabledClassName = customDisabledClassName ?? "text-disabled";

  return (
    <span
      className={cn(
        `font-semibold transition-colors`,
        className,
        active ? enabledClassName : disabledClassName,
      )}
    >
      {node}
    </span>
  );
}

export default StatusText;
