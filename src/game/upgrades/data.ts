import dertointUpgrades from "./containers/dertoint";
import levelUpgrades from "./containers/level";
import mallirtUpgrades from "./containers/mallirt";
import nullithUpgrades from "./containers/nullith";
import resetUpgrades from "./containers/reset";
import tierUpgrades from "./containers/tier";
import vermyrosUpgrades from "./containers/vermyros";
import xagyrosUpgrades from "./containers/xagyros";
import { UpgradeContainerId, UpgradeContainerConfig } from "./types";

export const upgrades: Record<UpgradeContainerId, UpgradeContainerConfig> = {
  reset: resetUpgrades,
  tier: tierUpgrades,
  vermyros: vermyrosUpgrades,
  nullith: nullithUpgrades,
  dertoint: dertointUpgrades,
  mallirt: mallirtUpgrades,
  level: levelUpgrades,
  xagyros: xagyrosUpgrades,
};
