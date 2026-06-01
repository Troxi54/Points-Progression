import cn from "@core/utils/tailwind";
import { ComponentPropsWithRef } from "react";

type Level = 1 | 2 | 3 | 4 | 5 | 6;

interface Props extends ComponentPropsWithRef<"h1"> {
  level: Level;
}

const levelStyles: Partial<Record<Level, string>> = {
  2: "text-[3.2em] my-[.5em]",
  3: "text-[1.5em] my-[.83em]",
};

function Heading({ level, className, ...props }: Props) {
  const Tag = `h${level}` as `h${Level}`;

  return (
    <Tag
      className={cn("text-center", levelStyles[level], className)}
      {...props}
    />
  );
}

export default Heading;
