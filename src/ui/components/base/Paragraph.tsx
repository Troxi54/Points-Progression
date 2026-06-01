import cn from "@core/utils/tailwind";
import { ComponentPropsWithRef } from "react";

type Props = ComponentPropsWithRef<"p">;

function Paragraph({ className, ...props }: Props) {
  return <p className={cn("my-[1em] text-center", className)} {...props} />;
}

export default Paragraph;
