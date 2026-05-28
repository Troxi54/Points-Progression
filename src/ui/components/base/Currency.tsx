import type { ClassName } from "@core/types/react";
import type { Ref } from "react";
import type { CurrencyComponentProps } from "./CurrencyContent";
import CurrencyContent from "./CurrencyContent";
import Paragraph from "./Paragraph";

interface Props extends CurrencyComponentProps {
  containerClassName?: ClassName;
  ref?: Ref<HTMLDivElement>;
}

function CurrencyComponent(props: Props) {
  return (
    <div className={props.containerClassName} ref={props.ref}>
      <Paragraph>
        <CurrencyContent {...props} />
      </Paragraph>
    </div>
  );
}

export default CurrencyComponent;
