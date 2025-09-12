import { isNumberStringDecimal } from "@/utils/stringUtils";
import Decimal, { DecimalSource } from "break_eternity.js";

export function handleDecimalInputOnBlur(
  target: HTMLInputElement,
  maxValue: DecimalSource = "1ee6"
): string {
  const DEFAULT_VALUE = "0";
  const CONVERT_NUMBER_TO_EXPONENTIAL_AT = 1e16;

  function isValid(num: number) {
    return !isNaN(num) && num >= 0;
  }

  const value = target.value.replace(/\s/g, "");
  let processedValue: string;

  if (value.endsWith("%")) {
    const numStr = value.slice(0, -1);

    if (isNumberStringDecimal(numStr)) {
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
      !isNumberStringDecimal(value) &&
      num < CONVERT_NUMBER_TO_EXPONENTIAL_AT
    ) {
      processedValue = String(Math.floor(num));
    } else {
      const decimal = new Decimal(value).floor();
      if (decimal.greaterThan(maxValue)) {
        processedValue = String(maxValue);
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
