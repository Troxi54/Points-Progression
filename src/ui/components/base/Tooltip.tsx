import cn from "@core/utils/tailwind";
import { ComponentProps } from "react";

type Props = ComponentProps<"div">;

function Tooltip({ className, ...props }: Props) {
  return (
    <>
      <div className="peer absolute right-0 top-0 bg-transparent size-full rounded-tr-[0.375em] rounded-[inherit]"></div>
      <div
        className={cn(
          "absolute top-4/5 left-1/2 text-[0.7em] p-[0.4em] bg-tooltip-bg pointer-events-none w-85/100 -translate-x-1/2 opacity-0 transition-[transform_opacity] duration-200 ease-[ease] z-1 peer-hover:opacity-100 peer-hover:translate-y-[1em] text-foreground",
          className,
        )}
        {...props}
      />
    </>
  );
}

export default Tooltip;
