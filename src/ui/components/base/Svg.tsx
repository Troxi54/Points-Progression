import type { ComponentProps } from "react";
import cn from "@core/utils/tailwind";

export type SvgProps = ComponentProps<"svg">;

function Svg({ className, ...props }: SvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-[1em] w-[1em]", className)}
      {...props}
    />
  );
}

export default Svg;
