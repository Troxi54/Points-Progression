import type { ClassName } from "@core/types/react";
import type { Ref } from "react";
import type { CurrencyComponentProps } from "./CurrencyContent";
import CurrencyContent from "./CurrencyContent";
import Paragraph from "../base/Paragraph";
import Container from "../base/Container";

interface Props extends CurrencyComponentProps {
  containerClassName?: ClassName;
  ref?: Ref<HTMLDivElement>;
}

function Currency(props: Props) {
  return (
    <Container className={props.containerClassName} ref={props.ref}>
      <Paragraph>
        <CurrencyContent {...props} />
      </Paragraph>
    </Container>
  );
}

export default Currency;
