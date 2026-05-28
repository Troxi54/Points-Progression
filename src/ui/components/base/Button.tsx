import cn from "@core/utils/tailwind";
import { cva, VariantProps } from "class-variance-authority";
import { ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<"button"> &
  VariantProps<typeof buttonVariants>;

const buttonVariants = cva(
  "px-[1.2em] py-[0.6em] text-[1em] bg-button-bg transition-colors-250 cursor-pointer ",
  {
    variants: {
      variant: {
        default:
          "border-[0.2em] border-transparent hover:border-button-border-hover",
      },
    },
  },
);

function Button({ className, variant = "default", ...props }: Props) {
  return (
    <button className={cn(buttonVariants({ variant, className }))} {...props} />
  );
}

export default Button;
