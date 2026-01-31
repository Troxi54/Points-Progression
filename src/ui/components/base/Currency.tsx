import { ClassName } from "@/core/types/react";
import CurrencyContent, { CurrencyComponentProps } from "./CurrencyContent";

interface Props extends CurrencyComponentProps {
  containerClassName?: ClassName;
}

function CurrencyComponent(props: Props) {
  return (
    <div className={props.containerClassName}>
      <p>
        <CurrencyContent {...props} />
      </p>
    </div>
  );
}

export default CurrencyComponent;
