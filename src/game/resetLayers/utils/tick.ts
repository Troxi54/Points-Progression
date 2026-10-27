import type { MergedPlayer } from "@game/player/merged/types";
import { triggerAllResetLayers } from "./trigger";
import resetLayerConfig from "../config";
import { deepCopy } from "@core/utils/object";
import resetLayers from "../data";
import { updateResetLayer } from "./update";
import { assignMergedPlayer } from "@game/player/merged/utils";

export function tickAllResetLayers(
  mergedPlayer: MergedPlayer,
  deltaTime: number,
): MergedPlayer {
  const result = deepCopy(mergedPlayer, 2) as MergedPlayer;

  const { cachedPlayer } = result;

  let accumulator = cachedPlayer.resetsAccumulator;
  accumulator += deltaTime;

  const { maxResetsPerSecond } = resetLayerConfig;
  const minResetInterval = 1000 / maxResetsPerSecond;

  let resetsToApply = Math.floor(accumulator / minResetInterval);
  resetsToApply = Math.min(resetsToApply, maxResetsPerSecond);

  for (let i = 0; i < resetsToApply; i++) {
    triggerAllResetLayers(mergedPlayer, result);
  }

  if (resetsToApply >= maxResetsPerSecond) {
    accumulator = 0;
  } else {
    accumulator -= resetsToApply * minResetInterval;
  }

  for (const dimensionResetLayers of Object.values(resetLayers)) {
    dimensionResetLayers.forEach((resetLayer) => {
      const updated = updateResetLayer(result, resetLayer.id);
      assignMergedPlayer(result, updated);
    });
  }

  cachedPlayer.resetsAccumulator = accumulator;

  return result;
}
