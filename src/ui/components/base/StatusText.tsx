import { ClassName } from "@/core/types/react";
import { isFunction } from "@/core/utils/function";
import { ReactNode } from "react";

interface Props {
  active: boolean;
  customNode?: ReactNode | ((active: boolean) => ReactNode);
  customEnabledClassName?: ClassName;
  customDisabledClassName?: ClassName;
}

function StatusText({
  active,
  customNode,
  customEnabledClassName,
  customDisabledClassName
}: Props) {
  const custom = isFunction(customNode) ? customNode(active) : customNode;
  const node = custom === undefined ? (active ? "ON" : "OFF") : custom;

  const enabledClassName = customEnabledClassName ?? "text-enabled";
  const disabledClassName = customDisabledClassName ?? "text-disabled";

  return (
    <span
      className={`font-semibold transition-colors ${
        active ? enabledClassName : disabledClassName
      }`}
    >
      {node}
    </span>
  );
}

export default StatusText;
