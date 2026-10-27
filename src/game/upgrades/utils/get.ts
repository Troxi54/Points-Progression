import type { CurrencyId } from "@game/currencies/types";
import type { DimensionId } from "@game/dimensions/types";
import type {
  UpgradeConfig,
  UpgradeContainerConfig,
  UpgradeContainerId,
} from "@game/upgrades/types";
import { upgrades } from "../data";

export function getUpgradeCurrency(
  upgradeConfig: UpgradeConfig,
  containerData: UpgradeContainerConfig,
): CurrencyId {
  return upgradeConfig.currency ?? containerData.currency ?? "points";
}

export function getUpgradeContainerDimensionId(
  upgradeContainerConfig: UpgradeContainerConfig,
): DimensionId {
  return upgradeContainerConfig.dimensionId ?? "normal";
}

export function getUpgradeContainerConfig(id: UpgradeContainerId) {
  return upgrades[id];
}

export function getUpgradeConfig(
  containerId: UpgradeContainerId,
  upgradeNumber: number,
) {
  const containerConfig = getUpgradeContainerConfig(containerId);
  const index = upgradeNumber - 1;

  return containerConfig.upgrades[index];
}
