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
        "bg-input-bg text-input-text focus:text-input-text-focus h-[1em] w-[5em] min-w-[1em] rounded-xl px-[0.35em] py-[0.75em] text-center font-mono text-[1.25em] transition-colors duration-150 outline-none [-webkit-text-fill-color:currentColor]",
        autoSize && "field-sizing-content supports-field-sizing:w-[unset]",
        className,
      )}
      {...props}
    />
  );
}

export default Input;
