import Decimal, { DecimalSource } from "break_eternity.js";
import { getPlayerState } from "@/game/player/store/store";
import {
  FormatNumberType,
  FormatNumberOptions,
  FormatNumberGroup,
  Unit,
} from "./types";
import formatUnits, {
  exponentialNotationSettingStartsWorkingAt,
} from "./units";
import createDecimal, {
  decimalIsGreaterByOoM,
  isDecimal,
} from "@/core/utils/decimal";
import UISymbols from "@/app/UISymbols";
import { isNil } from "@/core/utils/nil";
import { arrayLastItem } from "@/core/utils/array";
import { mergeObjects } from "@core/utils/object";

const ADD_COMMAS_AT = 1000;

const baseFormatOptions: FormatNumberOptions = {
  precision: "auto",
  exponentialPrecision: 2,
  minExponential: "auto",
  autoSigFigs: 0,
  autoDefaultPrecision: 3,
  precisionBeforeUnit: "auto",
};

function calculatePrecision(
  num: Decimal,
  fullNum: Decimal,
  fullOptions: FormatNumberOptions,
): number {
  if (
    fullOptions.precisionBeforeUnit !== "auto" &&
    fullNum.lessThan(formatUnits[0].scaling)
  ) {
    return fullOptions.precisionBeforeUnit;
  }

  if (fullOptions.precision === "auto") {
    const fullThousands = num.max(1).log(1000).floor();
    const divider = Decimal.pow(1000, fullThousands);
    const thousandPart = num.dividedBy(divider);

    const baseAddition = Decimal.minus(
      fullOptions.autoDefaultPrecision,
      thousandPart.max(1).log10().floor(),
    ).toNumber();
    const fullAddition = baseAddition + fullOptions.autoSigFigs;

    return fullAddition;
  }

  return fullOptions.precision;
}

function getExponential(
  num: Decimal,
  prefix: string,
  precision: number,
): string {
  const { mag, layer } = num;
  const isLayer0 = layer === 0;

  let exponent = isLayer0 ? num.exponent : Math.floor(mag);
  let mantissa = isLayer0
    ? num.mantissa
    : Decimal.pow(10, mag - exponent).toNumber();

  let fixedMantissa = mantissa.toFixed(precision);

  if (parseFloat(fixedMantissa) >= 10) {
    mantissa = 1;
    exponent += 1;
    fixedMantissa = mantissa.toFixed(precision);
  }

  const exponentSigns = "e".repeat(Math.max(layer - 1, 0));

  return `${prefix}${exponentSigns}${fixedMantissa}e${exponent}`;
}

function addCommas(num: Decimal) {
  return Number(num.floor()).toLocaleString("en-US");
}

const formatErrorResult = `${NaN}`;

function handleSpecialNumbers(value: Decimal): string | null {
  if (value.isNan()) {
    return formatErrorResult;
  }
  if (value.equals(0)) {
    return "0";
  }
  if (!value.isFinite()) {
    return UISymbols.infinity;
  }
  return null;
}

function getNextUnit(
  unitGroup: FormatNumberGroup,
  currentIndex: number,
): Unit | null {
  const { units } = unitGroup;

  const index = currentIndex + 1;
  if (index < units.length) return units[index];

  const thisGroupIndex = formatUnits.findIndex((value) => value === unitGroup);
  const nextGroup = formatUnits[thisGroupIndex + 1];

  if (nextGroup === undefined) return null;

  const nextUnits = nextGroup.units;
  const excess = index - units.length;

  return nextUnits[excess] ?? null;
}

export function formatNumber(
  value: DecimalSource,
  options?: Partial<FormatNumberOptions>,
): string {
  const { player } = getPlayerState();

  const fullOptions = mergeObjects(baseFormatOptions, options);

  if (!isDecimal(value)) {
    value = createDecimal(value);
  }

  const specialNumbersResult = handleSpecialNumbers(value);
  if (specialNumbersResult !== null) {
    return specialNumbersResult;
  }

  const isNegative = value.lessThan(0);
  const abs = value.abs();
  const prefix = isNegative ? UISymbols.minus : "";

  if (
    (player.exponentialNotation &&
      abs.greaterThanOrEqualTo(exponentialNotationSettingStartsWorkingAt)) ||
    (fullOptions.minExponential !== "auto" &&
      abs.greaterThanOrEqualTo(fullOptions.minExponential))
  ) {
    return getExponential(abs, prefix, fullOptions.exponentialPrecision);
  }

  let calculatedPrecision = calculatePrecision(abs, value, fullOptions);

  if (abs.lessThan(1)) {
    return prefix + abs.toFixed(calculatedPrecision);
  }

  let postfix: string = "";
  let divided = abs;
  let unitIndex = 0;
  let currentUnitGroup = formatUnits[0];

  for (const unitGroup of formatUnits) {
    currentUnitGroup = unitGroup;
    const unitGroupLength = unitGroup.units.length;
    const index = divided.log(unitGroup.scaling).floor();

    unitIndex = index.min(unitGroupLength).toNumber();
    const divider = Decimal.pow(unitGroup.scaling, unitIndex);

    divided = divided.dividedBy(divider);

    if (index.greaterThanOrEqualTo(unitGroupLength)) {
      if (unitGroup === arrayLastItem(formatUnits)) {
        return getExponential(abs, prefix, fullOptions.exponentialPrecision);
      }
      continue;
    }

    postfix = unitGroup.units[unitIndex];
    break;
  }

  calculatedPrecision = calculatePrecision(divided, value, fullOptions);
  let middle = divided.toFixed(calculatedPrecision);
  const floatMiddle = parseFloat(middle);
  let decimalMiddle = createDecimal(floatMiddle);

  const scalingStep = createDecimal(currentUnitGroup.scaling).toNumber();

  if (floatMiddle >= scalingStep) {
    const nextUnit = getNextUnit(currentUnitGroup, unitIndex);

    if (nextUnit === null) {
      return getExponential(abs, prefix, fullOptions.exponentialPrecision);
    }

    decimalMiddle = decimalMiddle.dividedBy(scalingStep);

    postfix = nextUnit;
    calculatedPrecision = calculatePrecision(decimalMiddle, value, fullOptions);
    middle = decimalMiddle.toFixed(calculatedPrecision);
  } else if (decimalIsGreaterByOoM(floatMiddle, divided, 1)) {
    const updatedPrecision = calculatePrecision(
      decimalMiddle,
      value,
      fullOptions,
    );
    if (updatedPrecision !== calculatedPrecision) {
      middle = divided.toFixed(updatedPrecision);
    }
  }

  if (decimalMiddle.greaterThanOrEqualTo(ADD_COMMAS_AT)) {
    middle = addCommas(decimalMiddle);
  }

  return prefix + middle + postfix;
}

export function integerCommaFormat(num: DecimalSource): string {
  num = createDecimal(num);
  const NORMAL_FORMAT_AT = 1e12;

  const isNegative = num.lessThan(0);
  let result = isNegative ? UISymbols.minus : "";

  const absolute = num.abs();
  if (absolute.lessThan(NORMAL_FORMAT_AT)) result += addCommas(absolute);
  else result += formatNumber(absolute);
  return result;
}

export function integerFormat(num: DecimalSource): string {
  return formatNumber(num, { precisionBeforeUnit: 0 });
}

export function parseNumberFormat(
  num: DecimalSource,
  formatType?: FormatNumberType,
): string {
  if (isNil(formatType) || formatType === "default") return formatNumber(num);

  return {
    integer: integerFormat(num),
    integerComma: integerCommaFormat(num),
  }[formatType];
}
