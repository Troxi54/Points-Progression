import type { ContainerProps } from "./Container";
import cn from "@core/utils/tailwind";
import Container from "./Container";

interface Props extends ContainerProps {
  col?: boolean;
}

function Stack({ className, col, ...props }: Props) {
  return (
    <Container
      className={cn("items-center gap-[1em]", col && "flex-col", className)}
      {...props}
    />
  );
}

export default Stack;
