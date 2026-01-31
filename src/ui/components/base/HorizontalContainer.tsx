import { ChildrenProps, ClassNameProps } from "@/core/types/react";
import cn from "@/core/utils/tailwind";

type Props = ChildrenProps & ClassNameProps;

function HorizontalContainer({ children, className }: Props) {
  return (
    <div className={cn("horizontal-container", className)}>{children}</div>
  );
}

export default HorizontalContainer;
