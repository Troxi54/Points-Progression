import { ChildrenProps, ClassNameProps } from "@/core/types/react";
import cn from "@/core/utils/tailwind";

type Props = ChildrenProps & ClassNameProps;

function VerticalContainer({ children, className }: Props) {
  return <div className={cn("vertical-container", className)}>{children}</div>;
}

export default VerticalContainer;
