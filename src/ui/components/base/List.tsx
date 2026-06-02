import type { ComponentProps } from "react";
import cn from "@core/utils/tailwind";

type Props = ComponentProps<"ul">;

function List({ className, ...props }: Props) {
  return (
    <ul
      className={cn(
        "flex list-inside list-disc flex-col justify-center",
        className,
      )}
      {...props}
    />
  );
}

export default List;
