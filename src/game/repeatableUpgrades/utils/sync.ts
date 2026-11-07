import type { CachedPlayer } from "@game/player/cached/types";
import { objectKeys } from "@core/utils/object";
import { getDefaultCachedRepeatableUpgrade } from "../cachedData";
import { flatRepeatableUpgrades } from "../data";

export function syncCachedRepeatableUpgrades(cachedPlayer: CachedPlayer) {
  const { repeatableUpgrades } = cachedPlayer;

  for (const key of objectKeys(flatRepeatableUpgrades)) {
    if (repeatableUpgrades[key]) continue;

    repeatableUpgrades[key] = getDefaultCachedRepeatableUpgrade();
  }
}
