import type { ComponentProps } from "react";

type Props = ComponentProps<"a">;

function Link({ ...props }: Props) {
  return <a {...props} target="_blank" rel="noopener noreferrer" />;
}

export default Link;
