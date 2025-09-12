import Decimal, { DecimalSource } from "break_eternity.js";
import { usePlayerStore } from "@player/playerStore";
import pluralize from "pluralize";

export function format(
  num: DecimalSource,
  precision: number | "auto" = "auto"
): string {
  const { player } = usePlayerStore.getState();

  num = new Decimal(num);
  const abs = num.abs();
  const isNegative = num.lessThan(0);
  const prefix = isNegative ? "-" : "";
  function getExponential(num: Decimal, wasPrecisionAuto: boolean): string {
    if (wasPrecisionAuto || precision === "auto") precision = 2;
    let mantissa = num.mantissa;
    let exponent = Math.round(num.exponent);
    if (mantissa >= 9.999999999) {
      mantissa = 1;
      exponent++;
    }
    return `${prefix}${mantissa.toFixed(precision)}e${exponent}`;
  }
  if (num.equals(0)) return "0";
  if (abs.lessThan(1)) {
    if (precision === "auto") precision = 2;
    return num.toFixed(precision);
  }
  if (abs.greaterThanOrEqualTo(1000) && precision === 0) {
    precision = "auto";
  }
  const units = ["", "k", "M", "B", "T"];
  if (
    abs.greaterThanOrEqualTo(Decimal.pow(1000, units.length)) &&
    player.exponentialNotation
  ) {
    return getExponential(num, false);
  }
  let precisionWasAuto = false;
  if (precision === "auto") {
    precisionWasAuto = true;
    precision = +abs.dividedBy(
      Decimal.pow(1000, abs.log10().dividedBy(3).floor())
    );
    if (precision === 1) {
      precision = 3;
    } else precision = 3 - Math.floor(Math.log10(precision));
  }

  let index = abs.log10().dividedBy(3).floor();
  index = Decimal.min(units.length - 1, index);
  let divided = abs.dividedBy(Decimal.pow(1000, index));
  if (divided.greaterThanOrEqualTo(1e6)) {
    const units2 = [
      "",
      "U",
      "U+",
      "U++",
      "A",
      "A+",
      "A++",
      "C",
      "C+",
      "C++",
      "S",
      "S+",
      "S++",
      "O",
      "O+",
      "O++",
      "N",
      "N+",
      "N++",
      "D",
      "D+",
      "D++",
      "L",
      "L+",
      "L++",
      "OP",
      "OP+",
      "OP++",
      "OP*",
      "OP**",
      "OP^",
      "OP^^",
      "i"
    ];
    index = divided.log10().dividedBy(6).floor();
    index = Decimal.min(units2.length - 1, index);
    divided = divided.dividedBy(Decimal.pow(1e6, index));
    if (divided.greaterThanOrEqualTo(1e9)) {
      return getExponential(num, precisionWasAuto);
    }
    if (divided.greaterThanOrEqualTo(1000))
      return (
        prefix + (+divided.floor()).toLocaleString("en-US") + units2[+index]
      );
    return prefix + divided.toFixed(precision) + units2[+index];
  }
  if (divided.greaterThanOrEqualTo(1000))
    return prefix + (+divided.floor()).toLocaleString("en-US") + units[+index];
  return prefix + divided.toStringWithDecimalPlaces(precision) + units[+index];
}

export function formatWithPlural(
  count: DecimalSource,
  word: string,
  between: string = " "
) {
  return format(count) + between + pluralize(word, +count);
}

export function integerFormatWithPlural(
  count: DecimalSource,
  word: string,
  between: string = " "
) {
  return integerFormat(count) + between + pluralize(word, +count);
}

export function splittedFormatWithPlural(count: DecimalSource, word: string) {
  return formatWithPlural(count, word).split(/ (.+)/).filter(Boolean);
}

export function integerFormat(num: DecimalSource): string {
  num = new Decimal(num);
  const NORMAL_FORMAT_AT = 1e12;

  const isNegative = num.lessThan(0);
  let result = isNegative ? "-" : "";

  const absolute = num.abs();
  if (absolute.lessThan(NORMAL_FORMAT_AT))
    result += (+absolute.floor()).toLocaleString("en-US");
  else result += format(absolute);
  return result;
}

const pad = (value: Decimal | number): string => {
  const num = value instanceof Decimal ? value.toNumber() : value;
  return num < 10 ? `0${num}` : `${num}`;
};

interface Unit {
  name: string;
  value: Decimal;
}

const formatUnit = (value: Unit) => value.value.floor();

export function formatTime(milliseconds: DecimalSource): string {
  const ms = new Decimal(milliseconds);

  const units: Unit[] = [
    { name: "y", value: ms.dividedBy(1000 * 60 * 60 * 24 * 365) },
    { name: "d", value: ms.dividedBy(1000 * 60 * 60 * 24).mod(365) },
    { name: "h", value: ms.dividedBy(1000 * 60 * 60).mod(24) },
    { name: "m", value: ms.dividedBy(1000 * 60).mod(60) },
    { name: "s", value: ms.dividedBy(1000).mod(60) }
  ];

  if (units[0].value.greaterThanOrEqualTo(1000)) {
    return `${format(formatUnit(units[0]))}y`;
  }

  if (units[0].value.greaterThanOrEqualTo(10)) {
    return `${formatUnit(units[0])}y`;
  }

  if (units[0].value.greaterThanOrEqualTo(1)) {
    return `${formatUnit(units[0])}y. ${formatUnit(units[1])}d. ${formatUnit(
      units[2]
    )}h`;
  }

  if (ms.lessThan(1000)) {
    return `${ms.floor()}ms`;
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

export function formatLeftTime(milliseconds: DecimalSource) {
  milliseconds = new Decimal(milliseconds);
  if (milliseconds.lessThanOrEqualTo(0)) return "Ready";
  if (milliseconds.greaterThanOrEqualTo("e25") || milliseconds.isNan())
    return "Never";
  return formatTime(milliseconds);
}
