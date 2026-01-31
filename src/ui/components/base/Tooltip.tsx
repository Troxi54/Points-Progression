import { ChildrenProps } from "@/core/types/react";

function Tooltip({ children }: ChildrenProps) {
  return (
    <>
      <div className="tooltip-trigger"></div>
      <div className="tooltip">{children}</div>
    </>
  );
}

export default Tooltip;
