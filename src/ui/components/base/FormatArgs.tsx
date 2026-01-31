import { Fragment, ReactNode } from "react";

export interface FormatArgsProps {
  values: ReactNode[];
  joiner?: ReactNode;
  prefix?: ReactNode;
  open?: ReactNode;
  close?: ReactNode;
}

function FormatArgs({
  values,
  joiner = ", ",
  prefix = "",
  open = "(",
  close = ")"
}: FormatArgsProps) {
  return (
    <>
      {prefix}
      {open}
      {values.map((v, i) => (
        <Fragment key={i}>
          {i > 0 && joiner}
          {v}
        </Fragment>
      ))}
      {close}
    </>
  );
}

export default FormatArgs;
