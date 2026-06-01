import cn from "@core/utils/tailwind";
import { ComponentProps } from "react";

type Props = ComponentProps<"span">;

function Spoiler({ className, ...props }: Props) {
  return (
    <span
      className={cn(
        "bg-spoiler-bg hover:text-foreground text-transparent transition-colors duration-250 ease-[ease] hover:bg-transparent",
        className,
      )}
      {...props}
    />
  );
}

export default Spoiler;
