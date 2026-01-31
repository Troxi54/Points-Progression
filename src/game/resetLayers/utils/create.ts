import {
  mergeObjects,
  objectEntries,
  objectFromEntries
} from "@/core/utils/object";
import getDefaultResetLayerData from "../default";
import {
  FullResetLayerData,
  PartialResetLayerData,
  PartialResetLayerDataContainer,
  ResetLayerDataContainer
} from "../types";
import { DimensionId } from "@/game/dimensions/types";
import { hasUpgrade } from "@/game/upgrades/utils/has";
import { applyResetLayerPlayerData } from "./apply";

export function createResetLayerData(
  resetLayerData: PartialResetLayerData,
  dimensionId: DimensionId
): FullResetLayerData {
  const defaultResetLayer = getDefaultResetLayerData();
  const newResetLayer = mergeObjects(
    defaultResetLayer,
    resetLayerData
  ) as FullResetLayerData;

  newResetLayer.dimensionId = dimensionId;

  const oldResetFn = newResetLayer.reset;

  const resetLayerId = newResetLayer.id;
  newResetLayer.reset = function (
    mergedPlayer,
    defaultMergedPlayer,
    currentTime
  ) {
    const existingResetValue = oldResetFn(
      mergedPlayer,
      defaultMergedPlayer,
      currentTime
    );

    const { player } = existingResetValue;
    let newPlayer = mergeObjects(mergedPlayer.player, player);

    const appliedData = applyResetLayerPlayerData(newPlayer, resetLayerId, {
      everPerformed: true
    });

    newPlayer = mergeObjects(newPlayer, appliedData);

    const result = {
      ...existingResetValue,
      player: newPlayer
    };

    const upgrades = newPlayer.upgrades;
    if (!upgrades) return result;

    const newUpgrades: typeof newPlayer.upgrades = {};

    for (const [containerId, upgradeContainer] of objectEntries(upgrades)) {
      if (!upgradeContainer) continue;

      const newUpgradeContainer = upgradeContainer.map((upgrade, index) => {
        return upgrade && hasUpgrade(mergedPlayer, containerId, index + 1);
      });

      newUpgrades[containerId] = newUpgradeContainer;
    }

    newPlayer.upgrades = newUpgrades;
    newPlayer.repeatableUpgrades = mergeObjects(
      mergedPlayer.player.repeatableUpgrades,
      newPlayer.repeatableUpgrades
    );

    return result;
  };

  return newResetLayer;
}

export function createResetLayerDataContainer(
  container: PartialResetLayerDataContainer
): ResetLayerDataContainer {
  return objectFromEntries(
    objectEntries(container).map(([dimensionId, dimensionLayers]) => {
      const newDimensionLayers = dimensionLayers.map((layer) =>
        createResetLayerData(layer, dimensionId)
      );
      return [dimensionId, newDimensionLayers];
    })
  ) as ResetLayerDataContainer;
}
