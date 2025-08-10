import Decimal, { DecimalSource } from "break_eternity.js";

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

export function calculateProgress(currency: Decimal, goal: Decimal) {
  return currency.dividedBy(goal).max(0).min(1);
}

export function calculateProgressInPercentage(
  currency: Decimal,
  goal: Decimal
) {
  return +calculateProgress(currency, goal).multiply(100);
}

export function getTimeSince(date: number) {
  return Date.now() - date;
}

export function checkElapsedTime(time: number | null): time is number {
  return time !== null && isFinite(time) && time > 0;
}

export function toPastSense(str: string) {
  if (str.endsWith("e")) return str + "d";
  return str + "ed";
}

export function handleDecimalInputOnBlur(
  target: HTMLInputElement,
  maxValue: DecimalSource = "1ee6"
): string {
  const DEFAULT_VALUE = "0";
  const CONVERT_NUMBER_TO_EXPONENTIAL_AT = 1e16;

  function isValid(num: number) {
    return !isNaN(num) && num >= 0;
  }

  function isExponential(numStr: string) {
    return numStr.toLowerCase().includes("e");
  }

  const value = target.value.replace(/\s/g, "");
  let processedValue: string;

  if (value.endsWith("%")) {
    const numStr = value.slice(0, -1);

    if (isExponential(numStr)) {
      processedValue = DEFAULT_VALUE;
    } else {
      const num = Number(numStr);

      if (!isValid(num)) {
        processedValue = DEFAULT_VALUE;
      } else if (num > 100) {
        processedValue = "100%";
      } else {
        const fixed = Number(num.toFixed(4));
        if (fixed === 0) {
          processedValue = "0";
        } else {
          processedValue = fixed + "%";
        }
      }
    }
  } else {
    const num = Number(value);
    if (!isValid(num)) {
      processedValue = DEFAULT_VALUE;
    } else if (
      !isExponential(value) &&
      num < CONVERT_NUMBER_TO_EXPONENTIAL_AT
    ) {
      processedValue = String(Math.floor(num));
    } else {
      const decimal = new Decimal(value).floor();
      if (decimal.greaterThan(maxValue)) {
        processedValue = "1e1000000";
      } else if (decimal.equals(0) || decimal.isNan()) {
        processedValue = DEFAULT_VALUE;
      } else {
        const mantissa = decimal.mantissa;
        const exponent = decimal.exponent;
        processedValue = Number(mantissa.toFixed(8)) + "e" + exponent;
      }
    }
  }

  target.value = processedValue;
  return processedValue;
}

export function handleDecimalInputOnChange(target: HTMLInputElement) {
  const MAX_LENGTH = 25;

  let value = target.value;

  if (value.length > MAX_LENGTH) {
    value = value.slice(0, MAX_LENGTH);
  }

  target.value = value;
  target.size = Math.max(value.length, 1);

  return value;
}
