import cn from "@core/utils/tailwind";
import Container from "../base/Container";
import { ComponentProps } from "react";

type Props = ComponentProps<"section">;

function Layer({ className, ...props }: Props) {
  return (
    <Container asChild>
      <section
        className={cn(
          "layer relative flex-col w-full items-center py-4 gap-4 bg-layer-bg overflow-visible",
          "before:-top-6 before:bg-linear-to-b before:content-[''] before:w-full before:absolute before:h-6 before:from-transparent before:to-layer-bg",
          "after:-bottom-6 after:bg-linear-to-t after:content-[''] after:w-full after:absolute after:h-6 before:after-transparent after:to-layer-bg",
          className,
        )}
        {...props}
      />
    </Container>
  );
}

export default Layer;
