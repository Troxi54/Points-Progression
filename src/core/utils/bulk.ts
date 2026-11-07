import type { DecimalSource } from "break_eternity.js";
import type Decimal from "break_eternity.js";
import createDecimal from "./decimal";

export function calculateBulk(
  value: DecimalSource,
  requirement: DecimalSource,
  requirementScaling: DecimalSource,
): Decimal {
  value = createDecimal(value);

  if (value.lessThan(requirement)) return createDecimal(0);

  return value.dividedBy(requirement).log(requirementScaling).floor().plus(1);
}

export function clampBulk(
  bulk: DecimalSource,
  level: DecimalSource,
  maxLevel: DecimalSource | null | undefined,
) {
  bulk = createDecimal(bulk);

  if (!maxLevel) return bulk;

  const newLevel = createDecimal(level).plus(bulk);
  const difference = newLevel.minus(maxLevel);

  if (difference.lessThanOrEqualTo(0)) {
    return bulk;
  }

  return bulk.minus(difference).max(0);
}
