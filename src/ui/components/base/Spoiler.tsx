import cn from "@core/utils/tailwind";
import { ComponentProps } from "react";

type Props = ComponentProps<"span">;

function Spoiler({ className, ...props }: Props) {
  return (
    <span
      className={cn(
        "text-transparent bg-spoiler-bg transition-colors duration-250 ease-[ease] hover:text-foreground hover:bg-transparent",
        className,
      )}
      {...props}
    />
  );
}

export default Spoiler;
