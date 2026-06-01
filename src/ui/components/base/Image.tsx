import { ComponentProps } from "react";

type Props = ComponentProps<"img">;

function Image({ ...props }: Props) {
  return <img draggable={false} {...props} />;
}

export default Image;
