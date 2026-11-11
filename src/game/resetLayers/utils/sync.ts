import type { CachedPlayer } from "@game/player/cached/types";
import { objectKeys } from "@core/utils/object";
import { getDefaultCachedResetLayer } from "../cachedData";
import { resetLayerConfigsById } from "../data";

export function syncCachedResetLayers(cachedPlayer: CachedPlayer) {
  const { resetLayers } = cachedPlayer;

  for (const key of objectKeys(resetLayerConfigsById)) {
    if (resetLayers[key]) continue;

    resetLayers[key] = getDefaultCachedResetLayer();
  }
}
