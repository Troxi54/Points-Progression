import { ClassNameProps } from "@/core/types/react";

type Props = {
  name: string;
  src?: string;
} & ClassNameProps;

function Image({ name, src, className }: Props) {
  return <img src={src} className={className} alt={name} draggable={false} />;
}

export default Image;
