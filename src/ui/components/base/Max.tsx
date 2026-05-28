import type { FormatArgsProps } from "./FormatArgs";
import FormatArgs from "./FormatArgs";

function Max(props: FormatArgsProps) {
  return <FormatArgs {...props} prefix="max" />;
}

export default Max;
