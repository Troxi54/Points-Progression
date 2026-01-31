import { DimensionId } from "@/game/dimensions/types";
import getDefaultRepeatableUpgrade from "@/game/repeatableUpgrades/default";
import {
  FullRepeatableUpgrade,
  PartialRepeatableUpgrade,
  PartialRepeatableUpgradeContainer,
  RepeatableUpgradeContainer,
  RepeatableUpgradeIds
} from "@/game/repeatableUpgrades/types";
import {
  mergeObjects,
  objectEntries,
  objectFromEntries
} from "@/core/utils/object";

export function createRepeatableUpgrade(
  upgrade: PartialRepeatableUpgrade,
  dimensionId: DimensionId
): FullRepeatableUpgrade {
  const defaultUpgrade = getDefaultRepeatableUpgrade();
  const newUpgrade = mergeObjects(
    defaultUpgrade,
    upgrade
  ) as FullRepeatableUpgrade;

  newUpgrade.dimensionId = dimensionId;

  return newUpgrade;
}

export function createRepeatableUpgradeContainer(
  container: PartialRepeatableUpgradeContainer
): RepeatableUpgradeContainer {
  return objectFromEntries(
    objectEntries(container).map(([dimensionId, dimensionUpgrades]) => {
      const upgradesRecord = dimensionUpgrades as Record<
        RepeatableUpgradeIds[typeof dimensionId],
        PartialRepeatableUpgrade
      >;
      const newDimensionUpgrades = objectFromEntries(
        objectEntries(upgradesRecord).map(([upgradeId, upgrade]) => [
          upgradeId,
          createRepeatableUpgrade(upgrade, dimensionId)
        ])
      );

      return [dimensionId, newDimensionUpgrades];
    })
  );
}
