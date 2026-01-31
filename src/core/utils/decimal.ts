import { DecimalSoftcapMode } from "@/core/types/decimal";
import Decimal, { DecimalSource } from "break_eternity.js";

const usuallyUsedDecimals: Record<number, Decimal> = {
  0: new Decimal(0),
  1: new Decimal(1),
};

export default function createDecimal(value: DecimalSource): Decimal {
  if (isDecimal(value)) return value;

  const foundValue = usuallyUsedDecimals[+value];

  if (foundValue !== undefined) return foundValue;

  return new Decimal(value);
}

export function isDecimal(value: unknown): value is Decimal {
  return value instanceof Decimal;
}

export function toPercentage(value: DecimalSource): string {
  return createDecimal(value).multiply(100) + "%";
}

export function decimalSoftcap(
  value: DecimalSource,
  start: DecimalSource,
  power: DecimalSource,
  mode: DecimalSoftcapMode = "pow",
): Decimal {
  const decimal = createDecimal(value);
  if (decimal.lte(start)) return decimal;

  start = createDecimal(start);
  power = createDecimal(power);

  if (mode === "multiplier") {
    return start.add(decimal.sub(start).multiply(power));
  }
  return start.multiply(decimal.dividedBy(start).pow(power));
}

export function decimalIsGreaterByOoM(
  value: DecimalSource,
  other: DecimalSource,
  OoM: DecimalSource,
): boolean {
  const valueOoM = createDecimal(value).log10().floor();
  const otherOoM = createDecimal(other).log10().floor();

  return valueOoM.minus(otherOoM).greaterThanOrEqualTo(OoM);
}
