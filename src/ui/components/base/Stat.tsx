import { ChildrenProps } from "@/core/types/react";

function Stat({ children }: ChildrenProps) {
  return <span className="bg-formula-stat-bg p-[0.1em]">{children}</span>;
}

export default Stat;
