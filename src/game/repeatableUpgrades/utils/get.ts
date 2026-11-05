import type { CachedPlayerLike } from "@game/player/cached/types";
import type { PlayerLike } from "@game/player/types";
import type Decimal from "break_eternity.js";
import type { CachedRepeatableUpgrade } from "../cachedData";
import type { RepeatableUpgradeId } from "../ids";
import { parseCachedPlayerLike, parsePlayerLike } from "@game/player/utils";
import { flatRepeatableUpgrades } from "@game/repeatableUpgrades/data";
import { getDefaultCachedRepeatableUpgrade } from "../cachedData";
import { getDefaultRepeatableUpgradeLevel } from "../default";

export function getRepeatableUpgradeConfig(
  repeatableUpgradeId: RepeatableUpgradeId,
) {
  return flatRepeatableUpgrades[repeatableUpgradeId];
}

export function getRepeatableUpgradeLevel(
  playerLike: PlayerLike,
  repeatableUpgradeId: RepeatableUpgradeId,
): Decimal {
  const player = parsePlayerLike(playerLike);
  return (
    player?.repeatableUpgrades?.[repeatableUpgradeId] ??
    getDefaultRepeatableUpgradeLevel()
  );
}

export function getCachedRepeatableUpgradeProp<
  T extends keyof CachedRepeatableUpgrade,
>(
  cachedPlayerLike: CachedPlayerLike,
  repeatableUpgradeId: RepeatableUpgradeId,
  propertyName: T,
): CachedRepeatableUpgrade[T] {
  const cachedPlayer = parseCachedPlayerLike(cachedPlayerLike);
  const container = cachedPlayer?.repeatableUpgrades?.[repeatableUpgradeId];

  const source = container ?? getDefaultCachedRepeatableUpgrade();

  return source[propertyName];
}

export function getCachedRepeatableUpgradeProps<
  T extends readonly (keyof CachedRepeatableUpgrade)[],
>(
  cachedPlayerLike: CachedPlayerLike,
  repeatableUpgradeId: RepeatableUpgradeId,
  propertyNames: T,
): {
  [K in T[number]]: CachedRepeatableUpgrade[K];
} {
  const cachedPlayer = parseCachedPlayerLike(cachedPlayerLike);
  const container = cachedPlayer?.repeatableUpgrades?.[repeatableUpgradeId];
  const defaultUpgrade = getDefaultCachedRepeatableUpgrade();

  const source = container ?? defaultUpgrade;

  return Object.fromEntries(
    propertyNames.map((name) => [name, source[name]]),
  ) as {
    [K in T[number]]: CachedRepeatableUpgrade[K];
  };
}
