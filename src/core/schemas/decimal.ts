import createDecimal from "@core/utils/decimal";
import Decimal from "break_eternity.js";
import z from "zod";

export const DecimalSchhema = z.preprocess((value) => {
  if (typeof value === "string" || typeof value === "number") {
    return createDecimal(value);
  }

  return value;
}, z.instanceof(Decimal));
