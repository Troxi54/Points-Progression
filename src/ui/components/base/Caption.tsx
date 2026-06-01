import cn from "@core/utils/tailwind";
import { ComponentProps } from "react";

interface Props extends ComponentProps<"span"> {
  muted?: boolean;
}

function Caption({ className, muted, ...props }: Props) {
  return (
    <span
      className={cn(
        "text-[0.75em]",
        muted ? "text-text-muted" : "text-menu-caption",
        className,
      )}
      {...props}
    />
  );
}

export default Caption;
