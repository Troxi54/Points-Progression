import { useState, type ComponentProps } from "react";
import cn from "@core/utils/tailwind";

type Props = ComponentProps<"span">;

function Spoiler({ className, onClick, onKeyDown, ...props }: Props) {
  const [revealed, setRevealed] = useState(false);

  return (
    <span
      className={cn(
        "rounded-[0.25em] transition-colors duration-250",
        !revealed &&
          "bg-spoiler-bg hover:bg-spoiler-bg-hover cursor-pointer text-transparent duration-150",
        revealed && "text-foreground bg-spoiler-reveal-bg",
        className,
      )}
      role={revealed ? undefined : "button"}
      tabIndex={revealed ? undefined : 0}
      onClick={(event) => {
        if (!revealed) setRevealed(true);
        onClick?.(event);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);

        if (event.defaultPrevented || revealed) return;
        if (event.key !== "Enter" && event.key !== " ") return;

        event.preventDefault();
        setRevealed(true);
      }}
      {...props}
    />
  );
}

export default Spoiler;
