import type { DecimalSource } from "break_eternity.js";
import type { PartialFormatNumberOptions } from "./types";
import createDecimal from "@core/utils/decimal";
import { mergeObjects } from "@core/utils/object";
import Decimal from "break_eternity.js";
import { formatNumber } from "./number";

const pad = (value: Decimal | number): string => {
  const num = value instanceof Decimal ? value.toNumber() : value;
  return num < 10 ? `0${num}` : `${num}`;
};

interface Unit {
  name: string;
  value: Decimal;
}

const formatUnit = (value: Unit) => value.value.floor();

export function formatTime(
  milliseconds: DecimalSource,
  formatOptions?: PartialFormatNumberOptions,
): string {
  const ms = createDecimal(milliseconds);

  const units: Unit[] = [
    { name: "y", value: ms.dividedBy(1000 * 60 * 60 * 24 * 365) },
    { name: "d", value: ms.dividedBy(1000 * 60 * 60 * 24).mod(365) },
    { name: "h", value: ms.dividedBy(1000 * 60 * 60).mod(24) },
    { name: "m", value: ms.dividedBy(1000 * 60).mod(60) },
    { name: "s", value: ms.dividedBy(1000).mod(60) },
  ];

  if (units[0].value.greaterThanOrEqualTo(1000)) {
    return `${formatNumber(formatUnit(units[0]), formatOptions)}y`;
  }

  if (units[0].value.greaterThanOrEqualTo(10)) {
    return `${formatUnit(units[0])}y`;
  }

  if (units[0].value.greaterThanOrEqualTo(1)) {
    return `${formatUnit(units[0])}y. ${formatUnit(units[1])}d. ${formatUnit(
      units[2],
    )}h`;
  }

  if (ms.lessThan(1000)) {
    if (ms.lessThan(1)) {
      return `${formatNumber(ms, formatOptions)}ms`;
    }

    return `${formatNumber(ms, mergeObjects({ autoSigFigs: -1 }, formatOptions))}ms`;
  }

  if (
    units[3].value.lessThan(1) &&
    units[2].value.lessThan(1) &&
    units[1].value.lessThan(1) &&
    units[0].value.lessThan(1)
  ) {
    return `${ms.dividedBy(1000).toFixed(3)}s`;
  }

  const parts: string[] = [];
  let firstFound = false;

  for (let i = 0; i < units.length; i++) {
    const val = units[i].value.floor();
    if (!firstFound && val.equals(0)) continue;
    const strVal = !firstFound ? val.toString() : pad(val);
    parts.push(`${strVal}${units[i].name}`);
    firstFound = true;
  }

  return parts.join(". ");
}

export function formatLeftTime(
  milliseconds: DecimalSource,
  formatOptions?: PartialFormatNumberOptions,
): string {
  milliseconds = createDecimal(milliseconds);
  if (milliseconds.lessThanOrEqualTo(0)) return "Ready";
  if (milliseconds.greaterThanOrEqualTo("e25") || milliseconds.isNan())
    return "Never";
  return formatTime(milliseconds, formatOptions);
}

export function formatBestRunTime(
  milliseconds: DecimalSource | null,
  formatOptions?: PartialFormatNumberOptions,
): string {
  if (!milliseconds) return "No";
  return formatTime(milliseconds, formatOptions);
}
