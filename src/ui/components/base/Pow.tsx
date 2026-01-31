import { ChildrenProps } from "@/core/types/react";

function Pow({ children }: ChildrenProps) {
  return <sup>{children}</sup>;
}

export default Pow;
