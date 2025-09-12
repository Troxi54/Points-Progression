import Decimal from "break_eternity.js";

export function calculateTimeForRequirement(
  currency: Decimal,
  currencyGain: Decimal,
  requirement: Decimal
) {
  return requirement
    .minus(currency)
    .dividedBy(currencyGain)
    .multiply(1000)
    .max(0);
}

export function getCurrentTime() {
  return Date.now();
}

export function getTimeSince(date: number) {
  return getCurrentTime() - date;
}

export function checkElapsedTime(time: number | null): time is number {
  return time !== null && isFinite(time) && time > 0;
}
