import { ChildrenProps, ClassNameProps } from "@/core/types/react";
import cn from "@/core/utils/tailwind";

interface Props extends ChildrenProps, ClassNameProps {
  name: string;
  link: string;
}

function LinkButton({ children, className, name, link }: Props) {
  return (
    <a
      className={cn("link-button", className)}
      href={link}
      target="_blank"
      title={name}
    >
      {children}
    </a>
  );
}

export default LinkButton;
