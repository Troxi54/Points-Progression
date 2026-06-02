import type { ComponentPropsWithRef } from "react";
import cn from "@core/utils/tailwind";

interface Props extends ComponentPropsWithRef<"span"> {
  block?: boolean;
}

function Text({ block, className, ...props }: Props) {
  return (
    <span
      className={cn("my-[1em] text-center", block && "block", className)}
      {...props}
    />
  );
}

export default Text;
