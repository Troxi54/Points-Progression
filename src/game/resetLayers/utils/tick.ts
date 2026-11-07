import type { MergedPlayer } from "@game/player/merged/types";
import resetLayerConfig from "../config";
import resetLayers from "../data";
import { triggerAllResetLayers } from "./trigger";
import { updateResetLayer } from "./update";

export function tickAllResetLayers(
  mergedPlayer: MergedPlayer,
  deltaTime: number,
) {
  const { cachedPlayer } = mergedPlayer;

  let accumulator = cachedPlayer.resetsAccumulator;
  accumulator += deltaTime;

  const { maxResetsPerSecond } = resetLayerConfig;
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

  for (const dimensionResetLayers of Object.values(resetLayers)) {
    dimensionResetLayers.forEach((resetLayer) => {
      updateResetLayer(mergedPlayer, resetLayer.id);
    });
  }

  cachedPlayer.resetsAccumulator = accumulator;
}
