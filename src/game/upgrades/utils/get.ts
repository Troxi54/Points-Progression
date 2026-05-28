import type { CurrencyId } from "@game/currencies/types";
import type { DimensionId } from "@game/dimensions/types";
import type { UpgradeData, UpgradeDataContainer } from "@game/upgrades/types";

export function getUpgradeCurrency(
  upgradeData: UpgradeData,
  containerData: UpgradeDataContainer,
): CurrencyId {
  return upgradeData.currency ?? containerData.currency ?? "points";
}

export function getUpgradeContainerDimensionId(
  upgradeContainerData: UpgradeDataContainer,
): DimensionId {
  return upgradeContainerData.dimensionId ?? "normal";
}
