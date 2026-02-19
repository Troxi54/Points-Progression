import { BooleanGetter } from "@/game/player/types";
import { MergedPlayer } from "@/game/player/merged/types";
import { CurrencyId } from "@/game/currencies/types";
import Decimal, { DecimalSource } from "break_eternity.js";
import { DimensionId } from "@/game/dimensions/types";
import { UsePlayerFn } from "@ui/hooks/usePlayer/types";

export type UpgradeContainerId =
  | "reset"
  | "tier"
  | "vermyros"
  | "nullith"
  | "dertoint"
  | "mallirt"
  | "level";

export type UpgradeId<
  C extends UpgradeContainerId = UpgradeContainerId,
  N extends number = number,
> = `${C}_${N}`;

/**
 * Note: The `usePlayer` function should return selectors for the `usePlayer` hook
 * to re-render the upgrade's component. Subscribe only to properties that affect
 * the visual state (for example, ones used in `description` or `show`, if those
 * are functions).
 *
 * You don't need to include properties used in `takesCurrency`, since it's only
 * evaluated when purchasing the upgrade - the purchase logic already uses the
 * latest player state via `getState()`.
 */

export interface UpgradeData {
  id: UpgradeId;
  previousUpgradeId?: UpgradeId;
  usePlayer?: UsePlayerFn;
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
  usePlayer?: UsePlayerFn;
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
