import type { CachedPlayer } from "@game/player/cached/types";
import { objectKeys } from "@core/utils/object";
import { getDefaultCachedResetLayer } from "../cachedData";
import { flatResetLayers } from "../data";

export function syncCachedResetLayers(cachedPlayer: CachedPlayer) {
  const { resetLayers } = cachedPlayer;

  for (const key of objectKeys(flatResetLayers)) {
    if (resetLayers[key]) continue;

    resetLayers[key] = getDefaultCachedResetLayer();
  }
}
