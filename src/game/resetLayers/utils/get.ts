import { ResetLayerPlayerData, PlayerLike } from "@/game/player/types";
import { CachedPlayerLike } from "@/game/player/cached/types";
import {
  parseCachedPlayerLike,
  parsePlayerLike,
  parseValueGetter
} from "@/game/player/utils";
import { objectFromEntries } from "@/core/utils/object";
import resetLayers, { flatResetLayers } from "../data";
import { getDefaultResetLayerPlayerData } from "@/game/player/default";
import { getDefaultCachedResetLayer } from "@/game/player/cached/default";
import { ResetLayerId } from "../types";
import { DimensionId } from "@/game/dimensions/types";
import { CachedResetLayer } from "@/game/player/cached/types";
import { MergedPlayer } from "@/game/player/merged/types";
import { getCurrentGameTime } from "@/core/utils/time";
import { shouldDimensionWork } from "@/game/dimensions/utils/check";
import { arrayLastIndex } from "@/core/utils/array";

export function getResetLayerData(resetLayerId: ResetLayerId) {
  return flatResetLayers[resetLayerId];
}

export function getResetLayerDimensionContainer(dimensionId: DimensionId) {
  return resetLayers[dimensionId];
}

export function getResetLayerPlayerData(
  playerLike: PlayerLike,
  resetLayerId: ResetLayerId
): ResetLayerPlayerData {
  const player = parsePlayerLike(playerLike);
  return player.resetLayers?.[resetLayerId] ?? getDefaultResetLayerPlayerData();
}

export function getResetLayerCachedPlayerData(
  cachedPlayerLike: CachedPlayerLike,
  resetLayerId: ResetLayerId
): CachedResetLayer {
  const cachedPlayer = parseCachedPlayerLike(cachedPlayerLike);
  return (
    cachedPlayer.resetLayers?.[resetLayerId] ?? getDefaultCachedResetLayer()
  );
}

export function getResetLayerPlayerDataProps<
  T extends (keyof ResetLayerPlayerData)[]
>(
  playerLike: PlayerLike,
  resetLayerId: ResetLayerId,
  props: T
): {
  [K in T[number]]: ResetLayerPlayerData[K];
} {
  const player = parsePlayerLike(playerLike);
  const defaultData = getDefaultResetLayerPlayerData();

  return objectFromEntries(
    props.map((property) => {
      const propertyName = property;

      const value =
        player.resetLayers?.[resetLayerId]?.[propertyName] ??
        defaultData[propertyName];
      return [propertyName, value];
    })
  ) as { [K in T[number]]: ResetLayerPlayerData[K] };
}

export function getResetLayerPlayerDataProp<
  T extends keyof ResetLayerPlayerData
>(
  playerLike: PlayerLike,
  resetLayerId: ResetLayerId,
  prop: T
): ResetLayerPlayerData[T] {
  const player = parsePlayerLike(playerLike);
  return (
    player.resetLayers?.[resetLayerId]?.[prop] ??
    getDefaultResetLayerPlayerData()[prop]
  );
}

export function everPerformed(
  playerLike: PlayerLike,
  resetLayerId: ResetLayerId
): boolean {
  return getResetLayerPlayerDataProps(playerLike, resetLayerId, [
    "everPerformed"
  ]).everPerformed;
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
  resetLayerId: ResetLayerId
): boolean {
  const data = getResetLayerData(resetLayerId);

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
