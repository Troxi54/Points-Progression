import type { ResetLayerId } from "@game/resetLayers/types";
import type { UpgradeContainerId } from "./types";

export type KeptUpgrades = Partial<
  Record<UpgradeContainerId, readonly number[] | "all">
>;

export interface UpgradeResetConfig {
  /** The first reset that clears this container. Null means permanent. */
  resetsOn?: ResetLayerId | null;
  /** Purchased upgrades in this container restore these upgrades on its reset. */
  keepsByUpgrade?: Partial<Record<number, KeptUpgrades>>;
}
