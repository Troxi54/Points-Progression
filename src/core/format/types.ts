import { DecimalSource } from "break_eternity.js";

export type Unit = string;

export interface FormatNumberGroup {
  scaling: DecimalSource;
  units: Unit[];
}

export type FormatNumberGroupContainer = FormatNumberGroup[];

export interface FormatNumberOptions {
  precision: number | "auto";
  exponentialPrecision: number;
  minExponential: DecimalSource | "auto";
  autoSigFigs: number;
  autoDefaultPrecision: number;
  precisionBeforeUnit: number | "auto";
}

export type FormatNumberType = "default" | "integer" | "integerComma";
