import { ClassName } from "@/core/types/react";
import CurrencyContent, { CurrencyComponentProps } from "./CurrencyContent";
import { Ref } from "react";

interface Props extends CurrencyComponentProps {
  containerClassName?: ClassName;
  ref?: Ref<HTMLDivElement>;
}

function CurrencyComponent(props: Props) {
  return (
    <div className={props.containerClassName} ref={props.ref}>
      <p>
        <CurrencyContent {...props} />
      </p>
    </div>
  );
}

export default CurrencyComponent;
