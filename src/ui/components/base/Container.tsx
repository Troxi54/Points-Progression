import cn from "@core/utils/tailwind";
import { Slot } from "@radix-ui/react-slot";
import { ComponentPropsWithRef } from "react";

export interface ContainerProps extends ComponentPropsWithRef<"div"> {
  asChild?: boolean;
}

function Container({ asChild, className, ...props }: ContainerProps) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp className={cn("flex place-content-center", className)} {...props} />
  );
}

export default Container;
