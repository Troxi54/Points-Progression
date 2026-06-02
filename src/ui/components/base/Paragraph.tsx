import type { ComponentPropsWithRef } from "react";
import cn from "@core/utils/tailwind";

type Props = ComponentPropsWithRef<"p">;

function Paragraph({ className, ...props }: Props) {
  return <p className={cn("my-[1em] text-center", className)} {...props} />;
}

export default Paragraph;
