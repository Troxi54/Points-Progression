import Decimal from "break_eternity.js";

export function calculateProgress(
  currencyValue: Decimal,
  goal: Decimal
): number {
  return currencyValue.dividedBy(goal).clamp(0, 1).toNumber();
}

export function calculateProgressInPercentage(
  currencyValue: Decimal,
  goal: Decimal
): number {
  return calculateProgress(currencyValue, goal) * 100;
}
