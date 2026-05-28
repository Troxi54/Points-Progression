import type { FormatArgsProps } from "./FormatArgs";
import FormatArgs from "./FormatArgs";

function Min(props: FormatArgsProps) {
  return <FormatArgs {...props} prefix="min" />;
}

export default Min;
