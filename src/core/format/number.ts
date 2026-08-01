import type { DecimalSource } from "break_eternity.js";
import type {
  FormatNumberGroup,
  FormatNumberOptions,
  FormatNumberType,
  NumberNotation,
  PartialFormatNumberOptions,
  Unit,
} from "./types";
import { arrayLastItem } from "@core/utils/array";
import createDecimal, {
  decimalIsGreaterByOoM,
  isDecimal,
} from "@core/utils/decimal";
import { isNil } from "@core/utils/nil";
import { mergeObjects } from "@core/utils/object";
import { getPlayerState } from "@game/player/store";
import symbols from "@ui/symbols";
import Decimal from "break_eternity.js";
import numberNotations from "./units";
import { formatConfig } from "./config";

const ADD_COMMAS_AT = 1000;

const baseFormatOptions: FormatNumberOptions = {
  precision: "auto",
  scientificPrecision: 2,
  minScientific: "auto",
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
    fullNum.lessThan(formatConfig.numberUnitsThreshold)
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

function getScientific(
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

  if (Number.parseFloat(fixedMantissa) >= 10) {
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

const formatErrorResult = `${Number.NaN}`;

function handleSpecialNumbers(value: Decimal): string | null {
  if (value.isNan()) {
    return formatErrorResult;
  }
  if (value.equals(0)) {
    return "0";
  }
  if (!value.isFinite()) {
    return symbols.infinity;
  }
  return null;
}

function getNextUnit(
  notation: NumberNotation,
  unitGroup: FormatNumberGroup,
  currentIndex: number,
): Unit | null {
  const { units } = unitGroup;

  const index = currentIndex + 1;
  if (index < units.length) return units[index];

  const notationGroups = numberNotations[notation];
  if (!notationGroups) return null;

  const thisGroupIndex = notationGroups.findIndex(
    (value) => value === unitGroup,
  );
  const nextGroup = notationGroups[thisGroupIndex + 1];

  if (nextGroup === undefined) return null;

  const nextUnits = nextGroup.units;
  const excess = index - units.length;

  return nextUnits[excess] ?? null;
}

export function formatNumber(
  value: DecimalSource,
  options?: PartialFormatNumberOptions,
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
  const prefix = isNegative ? symbols.minus : "";

  let calculatedPrecision = calculatePrecision(abs, value, fullOptions);

  if (abs.lessThan(1)) {
    if (abs.lessThan(Decimal.pow(0.1, calculatedPrecision))) {
      return getScientific(abs, prefix, fullOptions.scientificPrecision);
    }

    return prefix + abs.toFixed(calculatedPrecision);
  }

  const { numberNotation } = player;
  const isScientificNotation = numberNotation === "scientific";

  const notationGroups = numberNotations[numberNotation];

  const shouldUseScientific = isScientificNotation || !notationGroups;

  if (shouldUseScientific) {
    if (
      (isScientificNotation &&
        abs.greaterThanOrEqualTo(
          formatConfig.scientificNotationModeThreshold,
        )) ||
      (fullOptions.minScientific !== "auto" &&
        abs.greaterThanOrEqualTo(fullOptions.minScientific))
    ) {
      return getScientific(abs, prefix, fullOptions.scientificPrecision);
    }
  }

  let postfix: string = "";
  let divided = abs;
  let unitIndex = 0;
  let currentUnitGroup = notationGroups?.[0];

  if (notationGroups) {
    for (const unitGroup of notationGroups) {
      currentUnitGroup = unitGroup;
      const unitGroupLength = unitGroup.units.length;
      const index = divided.log(unitGroup.scaling).floor();

      unitIndex = index.min(unitGroupLength).toNumber();
      const divider = Decimal.pow(unitGroup.scaling, unitIndex);

      divided = divided.dividedBy(divider);

      if (index.greaterThanOrEqualTo(unitGroupLength)) {
        if (unitGroup === arrayLastItem(notationGroups)) {
          return getScientific(abs, prefix, fullOptions.scientificPrecision);
        }
        continue;
      }

      postfix = unitGroup.units[unitIndex];
      break;
    }
  }

  calculatedPrecision = calculatePrecision(divided, value, fullOptions);
  let middle = divided.toFixed(calculatedPrecision);
  const floatMiddle = Number.parseFloat(middle);
  let decimalMiddle = createDecimal(floatMiddle);

  if (notationGroups && currentUnitGroup) {
    const scalingStep = createDecimal(currentUnitGroup.scaling).toNumber();

    if (floatMiddle >= scalingStep) {
      const nextUnit = getNextUnit(numberNotation, currentUnitGroup, unitIndex);

      if (nextUnit === null) {
        return getScientific(abs, prefix, fullOptions.scientificPrecision);
      }

      decimalMiddle = decimalMiddle.dividedBy(scalingStep);

      postfix = nextUnit;
      calculatedPrecision = calculatePrecision(
        decimalMiddle,
        value,
        fullOptions,
      );
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
  let result = isNegative ? symbols.minus : "";

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
