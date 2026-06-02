import type { ClassName } from "@core/types/react";
import type { ComponentProps, ReactNode } from "react";
import { isFunction } from "@core/utils/function";
import cn from "@core/utils/tailwind";

interface Props extends Omit<ComponentProps<"span">, "children"> {
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
  ...props
}: Props) {
  const custom = isFunction(customNode) ? customNode(active) : customNode;
  const node = custom === undefined ? (active ? "ON" : "OFF") : custom;

  const enabledClassName = customEnabledClassName ?? "text-enabled";
  const disabledClassName = customDisabledClassName ?? "text-disabled";

  return (
    <span
      className={cn(
        `transition-colors`,
        className,
        active ? enabledClassName : disabledClassName,
      )}
      {...props}
    >
      {node}
    </span>
  );
}

export default StatusText;
