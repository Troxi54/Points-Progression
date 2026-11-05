import type { CurrencyId } from "@game/currencies/types";
import type { DimensionId } from "@game/dimensions/ids";
import type { CachedRepeatableUpgrade } from "./cachedData";
import type { MergedPlayer } from "@game/player/merged/types";
import type { BooleanGetter, ValueGetter } from "@game/player/types";
import type Decimal from "break_eternity.js";
import type { RepeatableUpgradeId, RepeatableUpgradeIds } from "./ids";

export interface RepeatableUpgradeConfig {
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

export type PartialRepeatableUpgradeConfig = Partial<RepeatableUpgradeConfig>;

export interface FullRepeatableUpgradeConfig extends RepeatableUpgradeConfig {
  dimensionId: DimensionId;
}

export type RepeatableUpgradeContainerConfig = {
  [T in DimensionId]: Record<
    RepeatableUpgradeIds[T],
    FullRepeatableUpgradeConfig
  >;
};

export type PartialRepeatableUpgradeContainerConfig = {
  [T in DimensionId]: Record<
    RepeatableUpgradeIds[T],
    PartialRepeatableUpgradeConfig
  >;
};

export type FlatRepeatableUpgradeContainerConfig = Record<
  RepeatableUpgradeId,
  FullRepeatableUpgradeConfig
>;

export type RepeatableUpgradeSelector<
  T extends RepeatableUpgradeId = RepeatableUpgradeId,
> = `repeatableUpgrade_${T}`;

export type CachedRepeatableUpgradeSelector<
  T extends RepeatableUpgradeId = RepeatableUpgradeId,
  O extends keyof CachedRepeatableUpgrade = keyof CachedRepeatableUpgrade,
> = `cachedRepeatableUpgrade_${T}_${O}`;
