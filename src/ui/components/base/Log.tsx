import { ChildrenProps } from "@/core/types/react";
import { ReactNode } from "react";

interface Props extends ChildrenProps {
  base?: ReactNode;
}

function Log({ base, children }: Props) {
  const fullBase = base ?? 10;

  return (
    <>
      log<sub>{fullBase}</sub>({children})
    </>
  );
}

export default Log;
