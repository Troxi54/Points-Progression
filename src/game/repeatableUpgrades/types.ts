import { DimensionId } from "@/game/dimensions/types";
import { BooleanGetter, ValueGetter } from "@/game/player/types";
import { MergedPlayer } from "@/game/player/merged/types";
import { CurrencyId } from "@/game/currencies/types";
import { CachedRepeatableUpgrade } from "@/game/player/cached/types";
import Decimal from "break_eternity.js";
import RepeatableUpgrade from "@/ui/components/base/RepeatableUpgrade";

export type RepeatableUpgradeIds = {
  normal: "point" | "ampliflux" | "vermyte" | "core";
  sliph: "dertoint" | "amplivoid";
};

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
  T extends RepeatableUpgradeId = RepeatableUpgradeId
> = `repeatableUpgrade_${T}`;

export type CachedRepeatableUpgradeSelector<
  T extends RepeatableUpgradeId = RepeatableUpgradeId,
  O extends keyof CachedRepeatableUpgrade = keyof CachedRepeatableUpgrade
> = `cachedRepeatableUpgrade_${T}_${O}`;
