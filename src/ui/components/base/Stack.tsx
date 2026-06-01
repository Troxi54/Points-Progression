import cn from "@core/utils/tailwind";
import Container, { ContainerProps } from "./Container";

interface Props extends ContainerProps {
  col?: boolean;
}

function Stack({ className, col, ...props }: Props) {
  return (
    <Container
      className={cn("gap-[1em] items-center", col && "flex-col", className)}
      {...props}
    />
  );
}

export default Stack;
