import type { FormatNumberGroupContainer, Unit } from "./types";
import { arrayLastItem } from "@core/utils/array";
import createDecimal from "@core/utils/decimal";
import Decimal from "break_eternity.js";

const formatUnits: FormatNumberGroupContainer = [
  {
    scaling: "1e3",
    units: ["", "k", "M", "B"],
  },
  {
    scaling: "1e6",
    units: [
      "T",
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
    ],
  },
  {
    scaling: "1e9",
    units: ["i"],
  },
] as const;

export default formatUnits;

export const allFormatUnitsLog: [Unit, Decimal][] = [];

let exponentialNotationStartsAtLog = createDecimal(0);

function buildAllFormatUnits() {
  let startsAt = createDecimal(1);
  for (const group of formatUnits) {
    for (const unit of group.units) {
      const { units } = group;

      const isFirstUnit = group === formatUnits[0] && unit === units[0];
      if (!isFirstUnit) {
        allFormatUnitsLog.push([unit, startsAt.log10()]);
      }

      startsAt = startsAt.multiply(group.scaling);

      const isLastUnit =
        group === arrayLastItem(formatUnits) && unit === arrayLastItem(units);
      if (isLastUnit) {
        exponentialNotationStartsAtLog = startsAt.log10();
      }
    }
  }
}

buildAllFormatUnits();
export const formatExponentialNotationStartsAtLog =
  exponentialNotationStartsAtLog;

const firstUnitGroup = formatUnits[0];
const firstUnitGroupSize = Decimal.pow(
  firstUnitGroup.scaling,
  firstUnitGroup.units.length + 1,
);

export const exponentialNotationSettingStartsWorkingAt = firstUnitGroupSize;
