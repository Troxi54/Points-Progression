import type { CurrencyId } from "@game/currencies/types";
import type { DimensionId } from "@game/dimensions/types";
import type { CachedRepeatableUpgrade } from "@game/player/cached/types";
import type { MergedPlayer } from "@game/player/merged/types";
import type { BooleanGetter, ValueGetter } from "@game/player/types";
import type Decimal from "break_eternity.js";

export interface RepeatableUpgradeIds {
  normal: "point" | "ampliflux" | "vermyte" | "core" | "beneflux" | "nullith";
  sliph: "dertoint" | "amplivoid";
}

export type RepeatableUpgradeId =
  RepeatableUpgradeIds[keyof RepeatableUpgradeIds];

export interface RepeatableUpgrade {
  condition: BooleanGetter;
  startCost: Decimal;
  costScaling: Decimal;
  currency: CurrencyId;
  spendCurrency: BooleanGetter;
  effectFormula: (level: Decimal, mergedPlayer: MergedPlayer) => Decimal;
  affects: string;
  maxLevel: ValueGetter<Decimal>;
  autobuy: BooleanGetter;
}

export type PartialRepeatableUpgrade = Partial<RepeatableUpgrade>;

export interface FullRepeatableUpgrade extends RepeatableUpgrade {
  dimensionId: DimensionId;
}

export type RepeatableUpgradeContainer = {
  [T in DimensionId]: Record<RepeatableUpgradeIds[T], FullRepeatableUpgrade>;
};

export type PartialRepeatableUpgradeContainer = {
  [T in DimensionId]: Record<RepeatableUpgradeIds[T], PartialRepeatableUpgrade>;
};

export type FlatRepeatableUpgradeContainer = Record<
  RepeatableUpgradeId,
  FullRepeatableUpgrade
>;

export type RepeatableUpgradeSelector<
  T extends RepeatableUpgradeId = RepeatableUpgradeId,
> = `repeatableUpgrade_${T}`;

export type CachedRepeatableUpgradeSelector<
  T extends RepeatableUpgradeId = RepeatableUpgradeId,
  O extends keyof CachedRepeatableUpgrade = keyof CachedRepeatableUpgrade,
> = `cachedRepeatableUpgrade_${T}_${O}`;
