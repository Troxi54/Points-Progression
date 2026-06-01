import cn from "@core/utils/tailwind";
import Button, { ButtonProps } from "./Button";

interface Props extends ButtonProps {
  active?: boolean;
}

function UnderlineButton({ className, active, ...props }: Props) {
  return (
    <Button
      className={cn(
        "overflow-hidden",
        "after:content-[''] after:transition-[scale,opacity] after:duration-300 after:absolute after:w-full after:h-[0.25em] after:bottom-0 after:scale-y-0 after:opacity-0 after:origin-bottom",
        active && "after:scale-y-100 after:opacity-100 after:bg-white",
        className,
      )}
      {...props}
    />
  );
}

export default UnderlineButton;
