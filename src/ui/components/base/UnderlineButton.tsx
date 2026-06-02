import type { ButtonProps } from "./Button";
import cn from "@core/utils/tailwind";
import Button from "./Button";

interface Props extends ButtonProps {
  active?: boolean;
}

function UnderlineButton({ className, active, ...props }: Props) {
  return (
    <Button
      className={cn(
        "overflow-hidden",
        "after:absolute after:bottom-0 after:h-[0.25em] after:w-full after:origin-bottom after:scale-y-0 after:opacity-0 after:transition-[scale,opacity] after:duration-300 after:content-['']",
        active && "after:scale-y-100 after:bg-white after:opacity-100",
        className,
      )}
      {...props}
    />
  );
}

export default UnderlineButton;
