import type { DecimalSource } from "break_eternity.js";
import type { NumberNotation } from "./numberNotation";

export type Unit = string;

export interface FormatNumberGroup {
  scaling: DecimalSource;
  units: Unit[];
}

export type FormatNumberGroupContainer = Partial<
  Record<NumberNotation, FormatNumberGroup[]>
>;

export interface FormatNumberOptions {
  precision: number | "auto";
  scientificPrecision: number;
  minScientific: DecimalSource | "auto";
  autoSigFigs: number;
  autoDefaultPrecision: number;
  precisionBeforeUnit: number | "auto";
}

export type PartialFormatNumberOptions = Partial<FormatNumberOptions>;

export type FormatNumberType = "default" | "integer" | "integerComma";
