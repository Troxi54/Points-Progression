import { ComponentProps } from "react";

type Props = ComponentProps<"sup">;

function Pow({ ...props }: Props) {
  return <sup {...props} />;
}

export default Pow;
