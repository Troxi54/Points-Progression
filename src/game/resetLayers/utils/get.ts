import type { DimensionId } from "@game/dimensions/ids";
import type { CachedPlayerLike } from "@game/player/cached/types";
import type { MergedPlayer } from "@game/player/merged/types";
import type { PlayerLike } from "@game/player/types";
import type { CachedResetLayer } from "../cachedData";
import type { ResetLayerId } from "../ids";
import type { ResetLayerPlayerData } from "../playerData";
import { arrayLastIndex } from "@core/utils/array";
import { getCurrentGameTime } from "@core/utils/gameTime";
import { shouldDimensionWork } from "@game/dimensions/utils/check";

import {
  parseCachedPlayerLike,
  parsePlayerLike,
  parseValueGetter,
} from "@game/player/utils";
import { getDefaultCachedResetLayer } from "../cachedData";
import resetLayersConfig from "../config";
import resetLayerConfigs, { resetLayerConfigsById } from "../data";
import { getDefaultResetLayerPlayerData } from "../playerData";

export function getResetLayerConfig(resetLayerId: ResetLayerId) {
  return resetLayerConfigsById[resetLayerId];
}

export function getResetLayerDimensionContainer(dimensionId: DimensionId) {
  return resetLayerConfigs[dimensionId];
}

export function getResetLayerPlayerData(
  playerLike: PlayerLike,
  resetLayerId: ResetLayerId,
) {
  const player = parsePlayerLike(playerLike);
  return player.resetLayers?.[resetLayerId] ?? getDefaultResetLayerPlayerData();
}

export function getResetLayerCachedPlayerData(
  cachedPlayerLike: CachedPlayerLike,
  resetLayerId: ResetLayerId,
): CachedResetLayer {
  const cachedPlayer = parseCachedPlayerLike(cachedPlayerLike);
  return (
    cachedPlayer.resetLayers?.[resetLayerId] ?? getDefaultCachedResetLayer()
  );
}

export function everPerformed(
  playerLike: PlayerLike,
  resetLayerId: ResetLayerId,
): ResetLayerPlayerData["everPerformed"] {
  return getResetLayerPlayerData(playerLike, resetLayerId).everPerformed;
}

export function isFirstReset(
  playerLike: PlayerLike,
  resetLayerId: ResetLayerId,
): ResetLayerPlayerData["isFirstReset"] {
  return getResetLayerPlayerData(playerLike, resetLayerId).isFirstReset;
}

export function getHighestResetDuration(mergedPlayer: MergedPlayer): number {
  const { dimensionId } = mergedPlayer.player;

  let result: number | null = null;

  const container = getResetLayerDimensionContainer(dimensionId);
  for (let i = arrayLastIndex(container); i >= 0; i--) {
    const data = container[i];
    const { id } = data;

    const cachedData = getResetLayerCachedPlayerData(mergedPlayer, id);
    const { duration } = cachedData;

    if (duration !== null) {
      result = duration;
      break;
    }
  }

  return result ?? getCurrentGameTime(mergedPlayer);
}

export function canPerform(
  mergedPlayer: MergedPlayer,
  resetLayerId: ResetLayerId,
): boolean {
  const data = getResetLayerConfig(resetLayerId);

  const { dimensionId } = data;
  const dimensionWorks = shouldDimensionWork(mergedPlayer, dimensionId);

  if (!dimensionWorks) return false;

  const { canPerform } = data;
  const parsedCanPerform = parseValueGetter(canPerform, mergedPlayer);

  if (!parsedCanPerform) return false;

  const { player } = mergedPlayer;
  const { currency, goal } = data;
  const currencyValue = player[currency];

  if (!currencyValue || currencyValue.lessThan(goal)) return false;

  return true;
}

export function shouldResetLayerProgressBarLock(
  mergedPlayer: MergedPlayer,
  resetLayerId: ResetLayerId,
): boolean {
  const { player, cachedPlayer } = mergedPlayer;
  if (!player.stableProgressBars) return false;

  const dimensionId = getResetLayerConfig(resetLayerId).dimensionId;
  const container = resetLayerConfigs[dimensionId];
  const startIndex = container.findIndex((data) => data.id === resetLayerId);

  for (let i = startIndex; i < container.length; i++) {
    const data = container[i];
    const { id } = data;

    const playerData = cachedPlayer.resetLayers[id];
    if (!playerData) continue;

    const { resetsPerSecond } = playerData;

    if (resetsPerSecond >= resetLayersConfig.progressBarsStartLockingAt) {
      return true;
    }
  }

  return false;
}
