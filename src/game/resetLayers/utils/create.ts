import type { DimensionId } from "@game/dimensions/types";
import type {
  BuiltResetLayerConfig,
  PartialResetLayerConfig,
  PartialResetLayerContainerConfig,
  ResetLayerContainerConfig,
} from "../types";
import {
  mergeObjects,
  objectEntries,
  objectFromEntries,
} from "@core/utils/object";
import { hasUpgrade } from "@game/upgrades/utils/has";
import { applyResetLayerUpgradeReset } from "@game/upgrades/utils/reset";
import getDefaultResetLayerConfig from "../default";
import { setResetLayerPlayerData } from "./set";

export function defineResetLayer<D extends DimensionId>(
  resetLayer: PartialResetLayerConfig<D>,
): PartialResetLayerConfig<D> {
  return resetLayer;
}

export function createResetLayerConfig(
  resetLayerConfig: PartialResetLayerConfig,
  dimensionId: DimensionId,
): BuiltResetLayerConfig {
  const defaultResetLayer = getDefaultResetLayerConfig();
  const newResetLayer = mergeObjects(
    defaultResetLayer,
    resetLayerConfig,
  ) as BuiltResetLayerConfig;

  newResetLayer.dimensionId = dimensionId;

  const oldResetFn = newResetLayer.reset;

  const resetLayerId = newResetLayer.id;
  newResetLayer.reset = function (
    mergedPlayer,
    defaultMergedPlayer,
    currentTime,
    sourceMergedPlayer = mergedPlayer,
  ) {
    const existingResetValue = oldResetFn(
      mergedPlayer,
      defaultMergedPlayer,
      currentTime,
      sourceMergedPlayer,
    );

    const { player } = existingResetValue;
    let newPlayer = mergeObjects(mergedPlayer.player, player);

    const appliedData = setResetLayerPlayerData(newPlayer, resetLayerId, {
      everPerformed: true,
      startedDate: currentTime,
    });

    newPlayer = mergeObjects(newPlayer, appliedData);

    const upgrades = newPlayer.upgrades;
    if (!upgrades)
      return {
        ...existingResetValue,
        player: newPlayer,
      };

    const newUpgrades: typeof newPlayer.upgrades = {};

    for (const [containerId, upgradeContainer] of objectEntries(upgrades)) {
      if (!upgradeContainer) continue;

      const newUpgradeContainer = upgradeContainer.map((bought, index) => {
        return bought && hasUpgrade(sourceMergedPlayer, containerId, index + 1);
      });

      newUpgrades[containerId] = newUpgradeContainer;
    }

    newPlayer.upgrades = newUpgrades;
    const resetUpgrades = applyResetLayerUpgradeReset(
      newPlayer,
      sourceMergedPlayer.player,
      resetLayerId,
    );
    newPlayer = mergeObjects(newPlayer, resetUpgrades);
    newPlayer.repeatableUpgrades = mergeObjects(
      mergedPlayer.player.repeatableUpgrades,
      newPlayer.repeatableUpgrades,
    );

    return {
      ...existingResetValue,
      player: newPlayer,
    };
  };

  return newResetLayer;
}

export function createResetLayerContainer(
  container: PartialResetLayerContainerConfig,
): ResetLayerContainerConfig {
  return objectFromEntries(
    objectEntries(container).map(([dimensionId, dimensionLayers]) => {
      const newDimensionLayers = dimensionLayers.map((layer) =>
        createResetLayerConfig(layer, dimensionId),
      );
      return [dimensionId, newDimensionLayers];
    }),
  ) as ResetLayerContainerConfig;
}
