import { ClassNameProps } from "@core/types/react";
import cn from "@core/utils/tailwind";
import { DecimalSource } from "break_eternity.js";

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
