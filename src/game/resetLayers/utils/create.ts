import type { DimensionId } from "@game/dimensions/ids";
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
    oldResetFn(
      mergedPlayer,
      defaultMergedPlayer,
      currentTime,
      sourceMergedPlayer,
    );

    const { player } = mergedPlayer;

    setResetLayerPlayerData(player, resetLayerId, {
      everPerformed: true,
      startedDate: currentTime,
    });

    for (const [containerId, upgradeContainer] of objectEntries(
      player.upgrades,
    )) {
      if (!upgradeContainer) continue;

      const newUpgradeContainer = upgradeContainer.map((bought, index) => {
        return bought && hasUpgrade(sourceMergedPlayer, containerId, index + 1);
      });

      player.upgrades[containerId] = newUpgradeContainer;
    }

    applyResetLayerUpgradeReset(
      player,
      sourceMergedPlayer.player,
      resetLayerId,
    );
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
