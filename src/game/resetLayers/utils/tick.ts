import type { MergedPlayer } from "@game/player/merged/types";
import { objectKeys } from "@core/utils/object";
import resetLayersConfig from "../config";
import resetLayerConfigs, { resetLayerConfigsById } from "../data";
import { triggerAllResetLayers } from "./trigger";
import { updateCachedResetLayer, updateOfflineResetLayer } from "./update";

export function tickResetLayerTriggers(
  mergedPlayer: MergedPlayer,
  deltaTime: number,
) {
  const { cachedPlayer } = mergedPlayer;

  let accumulator = cachedPlayer.resetsAccumulator;
  accumulator += deltaTime;

  const { maxResetsPerSecond } = resetLayersConfig;
  const minResetInterval = 1000 / maxResetsPerSecond;

  let resetsToApply = Math.floor(accumulator / minResetInterval);
  resetsToApply = Math.min(resetsToApply, maxResetsPerSecond);

  for (let i = 0; i < resetsToApply; i++) {
    triggerAllResetLayers(mergedPlayer);
  }

  if (resetsToApply >= maxResetsPerSecond) {
    accumulator = 0;
  } else {
    accumulator -= resetsToApply * minResetInterval;
  }

  for (const dimensionResetLayers of Object.values(resetLayerConfigs)) {
    dimensionResetLayers.forEach((resetLayer) => {
      updateOfflineResetLayer(mergedPlayer, resetLayer.id);
    });
  }

  cachedPlayer.resetsAccumulator = accumulator;
}

export function tickResetLayerCache(mergedPlayer: MergedPlayer) {
  for (const resetLayerId of objectKeys(resetLayerConfigsById)) {
    updateCachedResetLayer(mergedPlayer, resetLayerId);
  }
}
