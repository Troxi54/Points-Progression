import Decimal from "break_eternity.js";
import { RepeatableUpgrade } from "./types";
import createDecimal from "@/core/utils/decimal";

export default function getDefaultRepeatableUpgrade(): RepeatableUpgrade {
  return {
    condition: true,
    startCost: createDecimal(10),
    costScaling: createDecimal(2),
    currency: "points",
    spendCurrency: true,
    effectFormula: (lvl) => Decimal.pow(1.5, lvl),
    affects: "points",
    maxLevel: Decimal.dInf,
    autobuy: false
  };
}
