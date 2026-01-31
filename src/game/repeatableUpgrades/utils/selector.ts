import { PlayerLike } from "@/game/player/types";
import { CachedPlayerLike } from "@/game/player/cached/types";
import { parseCachedPlayerLike, parsePlayerLike } from "@/game/player/utils";
import {
  CachedRepeatableUpgradeSelector,
  RepeatableUpgradeId,
  RepeatableUpgradeSelector
} from "@/game/repeatableUpgrades/types";
import Decimal from "break_eternity.js";
import { getRepeatableUpgradeLevel } from "./get";
import { CachedRepeatableUpgrade } from "@/game/player/cached/types";
import { getCachedRepeatableUpgradeProp } from "./get";
import { objectFromEntries } from "@/core/utils/object";

export function getRepeatableUpgradeLevelSelection<
  T extends RepeatableUpgradeId[]
>(
  playerLike: PlayerLike,
  repeatableUpgradeIds: T
): {
  [K in RepeatableUpgradeSelector<T[number]>]: Decimal;
} {
  const player = parsePlayerLike(playerLike);

  return objectFromEntries(
    repeatableUpgradeIds.map((id) => {
      const key: RepeatableUpgradeSelector<T[number]> =
        `repeatableUpgrade_${id}`;
      const value = getRepeatableUpgradeLevel(player, id);
      return [key, value];
    })
  ) as ReturnType<typeof getRepeatableUpgradeLevelSelection>;
}

export function getCachedRepeatableUpgradePropsSelection<
  O extends RepeatableUpgradeId,
  T extends readonly (keyof CachedRepeatableUpgrade)[]
>(
  cachedPlayerLike: CachedPlayerLike,
  repeatableUpgradeId: O,
  propertyNames: T
): {
  [K in T[number] as CachedRepeatableUpgradeSelector<
    O,
    K
  >]: CachedRepeatableUpgrade[K];
} {
  const cachedPlayer = parseCachedPlayerLike(cachedPlayerLike);

  return objectFromEntries(
    propertyNames.map((name) => {
      type keyType = T[number];

      const key: CachedRepeatableUpgradeSelector<O, keyType> =
        `cachedRepeatableUpgrade_${repeatableUpgradeId}_${name}`;
      const value = getCachedRepeatableUpgradeProp<keyType>(
        cachedPlayer,
        repeatableUpgradeId,
        name
      );

      return [key, value];
    })
  ) as ReturnType<typeof getCachedRepeatableUpgradePropsSelection>;
}
