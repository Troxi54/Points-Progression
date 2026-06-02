import type { ComponentProps } from "react";
import cn from "@core/utils/tailwind";

type Props = ComponentProps<"span">;

function Spoiler({ className, ...props }: Props) {
  return (
    <span
      className={cn(
        "bg-spoiler-bg hover:text-foreground text-transparent transition-colors duration-250 hover:bg-transparent",
        className,
      )}
      {...props}
    />
  );
}

export default Spoiler;
