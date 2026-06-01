import cn from "@core/utils/tailwind";
import { ComponentProps } from "react";

type Props = ComponentProps<"span">;

function Stat({ className, ...props }: Props) {
  return (
    <span
      className={cn("bg-formula-stat-bg p-[0.1em]", className)}
      {...props}
    />
  );
}

export default Stat;
