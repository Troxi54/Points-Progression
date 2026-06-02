import type { VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import cn from "@core/utils/tailwind";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

export interface ButtonProps
  extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const buttonVariants = cva(
  "bg-button-bg flex cursor-pointer flex-col place-content-center items-center px-[1.2em] py-[0.6em] text-[1em] font-semibold transition-[border-color] duration-250",
  {
    variants: {
      variant: {
        default:
          "hover:border-button-border-hover border-[0.2em] border-transparent",
        menu: "bg-menu-button-bg hover:bg-menu-button-bg-hover relative flex-row rounded-[0.375em] transition-[background-color] duration-100 ease-linear",
        "menu-danger":
          "bg-danger-menu-button-bg hover:bg-danger-menu-button-bg-hover text-danger-menu-button-text relative flex-row rounded-[0.375em] transition-[background-color] duration-100 ease-linear",
        tab: "bg-tab-button-bg hover:bg-tab-button-bg-hover relative rounded-[0.75em] transition-[background-color] duration-100 ease-linear",
        link: "box-border flex-row gap-[0.5em] rounded-[0.375em] px-[1.2em] py-[0.5em] transition-[background-color] [&_img]:h-[1em]",
        "menu-toggle":
          "bg-open-menu-button-bg hover:bg-open-menu-button-bg-hover aspect-square h-full rounded-[0.5em] border-none p-0 transition-[background-color] duration-100 ease-linear",
      },
      size: {
        md: "text-[1em]",
        lg: "text-[1.125em]",
        xl: "text-[1.25em]",
      },
    },
  },
);

function Button({
  className,
  asChild,
  variant = "default",
  size = "md",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export default Button;
