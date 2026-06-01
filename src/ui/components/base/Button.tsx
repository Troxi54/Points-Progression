import cn from "@core/utils/tailwind";
import { Slot } from "@radix-ui/react-slot";
import { cva, VariantProps } from "class-variance-authority";
import { ComponentProps } from "react";

export interface ButtonProps
  extends ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const buttonVariants = cva(
  "flex place-content-center items-center flex-col px-[1.2em] py-[0.6em] text-[1em] bg-button-bg transition-[border-color] duration-250 ease-[ease] cursor-pointer font-medium",
  {
    variants: {
      variant: {
        default:
          "border-[0.2em] border-transparent hover:border-button-border-hover",
        menu: "relative flex-row bg-menu-button-bg hover:bg-menu-button-bg-hover rounded-[0.375em] transition-[background-color] duration-100 ease-linear",
        "menu-danger":
          "relative flex-row rounded-[0.375em] transition-[background-color] duration-100 ease-linear bg-danger-menu-button-bg hover:bg-danger-menu-button-bg-hover text-danger-menu-button-text",
        tab: "relative rounded-[0.75em] transition-[background-color] duration-100 ease-linear bg-tab-button-bg hover:bg-tab-button-bg-hover",
        link: "flex-row transition-[background-color] rounded-[0.375em] px-[1.2em] py-[0.5em] gap-[0.5em] box-border [&_img]:h-[1em]",
        "menu-toggle":
          "p-0 h-full aspect-square border-none rounded-[0.5em] transition-[background-color] duration-100 ease-linear bg-open-menu-button-bg hover:bg-open-menu-button-bg-hover",
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
