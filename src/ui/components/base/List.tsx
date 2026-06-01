import cn from "@core/utils/tailwind";
import { ComponentProps } from "react";

type Props = ComponentProps<"ul">;

function List({ className, ...props }: Props) {
  return (
    <ul
      className={cn(
        "flex flex-col justify-center list-inside list-disc",
        className,
      )}
      {...props}
    />
  );
}

export default List;
