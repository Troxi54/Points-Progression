import cn from "@core/utils/tailwind";
import { ComponentProps } from "react";

type Props = ComponentProps<"input"> & {
  autoSize?: boolean;
};

function Input({ className, autoSize, ...props }: Props) {
  return (
    <input
      type="text"
      className={cn(
        "w-[5em] min-w-[1em] h-[1em] py-[0.75em] px-[0.35em] text-[1.25em] text-center font-mono bg-input-bg text-input-text rounded-xl outline-none transition-colors duration-150 focus:text-input-text-focus [-webkit-text-fill-color:currentColor]",
        autoSize && "field-sizing-content supports-field-sizing:w-[unset]",
        className,
      )}
      {...props}
    />
  );
}

export default Input;
