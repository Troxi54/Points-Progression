import type { ComponentProps } from "react";
import cn from "@core/utils/tailwind";
import Container from "../base/Container";

type Props = ComponentProps<"section">;

function Layer({ className, ...props }: Props) {
  return (
    <Container asChild>
      <section
        className={cn(
          "layer bg-layer-bg relative w-full flex-col items-center gap-4 overflow-visible py-4",
          "before:to-layer-bg before:absolute before:-top-6 before:h-6 before:w-full before:bg-linear-to-b before:from-transparent before:content-['']",
          "before:after-transparent after:to-layer-bg after:absolute after:-bottom-6 after:h-6 after:w-full after:bg-linear-to-t after:content-['']",
          className,
        )}
        {...props}
      />
    </Container>
  );
}

export default Layer;
