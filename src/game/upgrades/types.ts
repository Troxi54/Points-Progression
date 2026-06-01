import type { CurrencyId } from "@game/currencies/types";
import type { DimensionId } from "@game/dimensions/types";
import type { MergedPlayer } from "@game/player/merged/types";
import type { BooleanGetter } from "@game/player/types";
import type { PlayerSelectorFn } from "@ui/hooks/usePlayer/types";
import type { DecimalSource } from "break_eternity.js";
import type Decimal from "break_eternity.js";

export type UpgradeContainerId =
  | "reset"
  | "tier"
  | "vermyros"
  | "nullith"
  | "dertoint"
  | "mallirt"
  | "level"
  | "xagyros";

export type UpgradeId<
  C extends UpgradeContainerId = UpgradeContainerId,
  N extends number = number,
> = `${C}_${N}`;

export interface UpgradeData {
  id: UpgradeId;
  previousUpgradeId?: UpgradeId;
  /**
   * Note: this function should return selections for the `usePlayer` hook
   * to re-render the upgrade's component. Subscribe only to properties that affect
   * the visual state (for example, ones used in `description` or `show`, if those
   * are functions).
   *
   * You don't need to include properties used in `takesCurrency`, since it's only
   * evaluated when purchasing the upgrade - the purchase logic already uses the
   * latest player state via `getState()`.
   */
  playerSelector?: PlayerSelectorFn;
  name?: string | "auto";
  description: string | ((state: MergedPlayer) => string);
  cost: DecimalSource;
  currency?: CurrencyId;
  spendCurrency?: BooleanGetter;
  forceShow?: BooleanGetter;
}

export interface BuiltUpgradeData extends UpgradeData {
  cost: Decimal;
}

export interface UpgradeDataContainer {
  id: UpgradeContainerId;
  dimensionId?: DimensionId;
  name?: string | "auto" | ((state: MergedPlayer) => string);
  playerSelector?: PlayerSelectorFn;
  spendCurrency?: BooleanGetter;
  currency?: CurrencyId;
  forceShow?: BooleanGetter;
  upgrades: UpgradeData[];
}

export interface BuiltUpgradeDataContainer extends UpgradeDataContainer {
  upgrades: BuiltUpgradeData[];
}

export type UpgradeCollection = Partial<Record<UpgradeContainerId, number[]>>;

export type UpgradesFlags<T extends UpgradeCollection> = {
  [K in keyof T as T[K] extends readonly (infer N)[]
    ? N extends number
      ? `${K & string}_${N}`
      : never
    : never]: boolean;
};
