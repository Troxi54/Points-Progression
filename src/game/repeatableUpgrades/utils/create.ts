import type { DimensionId } from "@game/dimensions/types";
import type {
  FullRepeatableUpgradeConfig,
  PartialRepeatableUpgradeConfig,
  PartialRepeatableUpgradeContainerConfig,
  RepeatableUpgradeContainerConfig,
  RepeatableUpgradeIds,
} from "@game/repeatableUpgrades/types";
import {
  mergeObjects,
  objectEntries,
  objectFromEntries,
} from "@core/utils/object";
import getDefaultRepeatableUpgrade from "@game/repeatableUpgrades/default";

export function createRepeatableUpgrade(
  upgrade: PartialRepeatableUpgradeConfig,
  dimensionId: DimensionId,
): FullRepeatableUpgradeConfig {
  const defaultUpgrade = getDefaultRepeatableUpgrade();
  const newUpgrade = mergeObjects(
    defaultUpgrade,
    upgrade,
  ) as FullRepeatableUpgradeConfig;

  newUpgrade.dimensionId = dimensionId;

  return newUpgrade;
}

export function createRepeatableUpgradeContainer(
  container: PartialRepeatableUpgradeContainerConfig,
): RepeatableUpgradeContainerConfig {
  return objectFromEntries(
    objectEntries(container).map(([dimensionId, dimensionUpgrades]) => {
      const upgradesRecord = dimensionUpgrades as Record<
        RepeatableUpgradeIds[typeof dimensionId],
        PartialRepeatableUpgradeConfig
      >;
      const newDimensionUpgrades = objectFromEntries(
        objectEntries(upgradesRecord).map(([upgradeId, upgrade]) => [
          upgradeId,
          createRepeatableUpgrade(upgrade, dimensionId),
        ]),
      );

      return [dimensionId, newDimensionUpgrades];
    }),
  );
}
