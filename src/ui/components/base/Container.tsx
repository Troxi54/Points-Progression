import cn from "@core/utils/tailwind";
import { ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<"div">;

function Container({ className, ...props }: Props) {
  return (
    <div className={cn("flex place-items-center", className)} {...props} />
  );
}

export default Container;
