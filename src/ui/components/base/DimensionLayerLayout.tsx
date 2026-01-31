import { ChildrenProps, ClassNameProps } from "@/core/types/react";
import cn from "@/core/utils/tailwind";

type Props = ChildrenProps & ClassNameProps;

function DimensionLayerLayout({ className, children }: Props) {
  return <div className={cn("layer", className)}>{children}</div>;
}

export default DimensionLayerLayout;
