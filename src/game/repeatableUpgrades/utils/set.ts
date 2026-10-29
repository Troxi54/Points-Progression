import type {
  CachedPlayerLike,
  CachedRepeatableUpgrade,
  PartialCachedPlayer,
} from "@game/player/cached/types";
import type { PartialPlayer, PlayerLike } from "@game/player/types";
import type Decimal from "break_eternity.js";
import type { RepeatableUpgradeId } from "../types";
import { copyObject, mergeObjects } from "@core/utils/object";
import { parseCachedPlayerLike, parsePlayerLike } from "@game/player/utils";

export function setRepeatableUpgradeLevel(
  playerLike: PlayerLike,
  repeatableUpgradeId: RepeatableUpgradeId,
  level: Decimal,
): PartialPlayer | undefined {
  const player = parsePlayerLike(playerLike);
  if (!player) return;

  const container = player.repeatableUpgrades;
  if (!container) return;

  const newContainer = copyObject(container);
  newContainer[repeatableUpgradeId] = level;

  return { repeatableUpgrades: newContainer };
}

export function setCachedRepeatableUpgrade(
  cachedPlayerLike: CachedPlayerLike,
  repeatableUpgradeId: RepeatableUpgradeId,
  cachedRepeatableUpgrade: Partial<CachedRepeatableUpgrade>,
): PartialCachedPlayer | undefined {
  const cachedPlayer = parseCachedPlayerLike(cachedPlayerLike);

  const container = cachedPlayer?.repeatableUpgrades;
  if (!container) return;

  const newContainer = copyObject(container);

  const oldUpgrade = container[repeatableUpgradeId];
  const newUpgrade = mergeObjects(oldUpgrade, cachedRepeatableUpgrade);
  newContainer[repeatableUpgradeId] = newUpgrade;

  return {
    repeatableUpgrades: newContainer,
  };
}
