import type { DecimalSource } from "break_eternity.js";

export type Unit = string;

export interface FormatNumberGroup {
  scaling: DecimalSource;
  units: Unit[];
}

export type NumberNotation = "standard" | "legacy" | "scientific";

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
