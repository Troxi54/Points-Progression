import Decimal, { DecimalSource } from "break_eternity.js";
import createDecimal from "./decimal";

export function calculateBulk(
  value: DecimalSource,
  requirement: DecimalSource,
  requirementScaling: DecimalSource
): Decimal {
  value = createDecimal(value);

  if (value.lessThan(requirement)) return createDecimal(0);

  return value.dividedBy(requirement).log(requirementScaling).floor().plus(1);
}
