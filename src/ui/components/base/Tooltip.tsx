import cn from "@core/utils/tailwind";
import { ComponentProps } from "react";

type Props = ComponentProps<"div">;

function Tooltip({ className, ...props }: Props) {
  return (
    <>
      <div className="peer absolute top-0 right-0 size-full rounded-[inherit] rounded-tr-[0.375em] bg-transparent"></div>
      <div
        className={cn(
          "bg-tooltip-bg text-foreground pointer-events-none absolute top-4/5 left-1/2 z-1 w-85/100 -translate-x-1/2 p-[0.4em] text-[0.7em] opacity-0 transition-[transform_opacity] duration-200 ease-[ease] peer-hover:translate-y-[1em] peer-hover:opacity-100",
          className,
        )}
        {...props}
      />
    </>
  );
}

export default Tooltip;
