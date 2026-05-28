import type { ClassNameProps } from "@core/types/react";
import type { DecimalSource } from "break_eternity.js";
import cn from "@core/utils/tailwind";

interface Props extends ClassNameProps {
  level: DecimalSource;
}

function NexusSign({ level, className }: Props) {
  const levelNumber = +level;

  return (
    <span
      className={cn(className)}
      style={{
        color: `var(--nexus-milestone-${levelNumber})`,
      }}
    >
      (N{levelNumber})
    </span>
  );
}

export default NexusSign;
