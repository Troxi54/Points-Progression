import Decimal from "break_eternity.js";

export function calculateProgress(currency: Decimal, goal: Decimal) {
  return currency.dividedBy(goal).max(0).min(1);
}

export function calculateProgressInPercentage(
  currency: Decimal,
  goal: Decimal
) {
  return +calculateProgress(currency, goal).multiply(100);
}
