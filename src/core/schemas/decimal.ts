import createDecimal from "@core/utils/decimal";
import * as z from "@zod/mini";
import Decimal from "break_eternity.js";

export const DecimalSchema = z.pipe(
  z.transform((value) => {
    if (typeof value === "string" || typeof value === "number") {
      return createDecimal(value);
    }

    return value;
  }),
  z.instanceof(Decimal),
);

export const DecimalWithDefaultSchema = z.catch(DecimalSchema, () =>
  createDecimal(0),
);
