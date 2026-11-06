import type { CachedPlayer, CachedPlayerLike } from "@game/player/cached/types";
import type { MergedPlayer } from "@game/player/merged/types";
import type { PartialPlayer, PlayerLike } from "@game/player/types";
import type { CachedResetLayer } from "../cachedData";
import type { ResetLayerId } from "../ids";
import type { ResetLayerPlayerData } from "../playerData";
import { copyObject, mergeObjects } from "@core/utils/object";
import { fixGameTime } from "@core/utils/gameTime";
import { parseCachedPlayerLike, parsePlayerLike } from "@game/player/utils";
import { getDefaultCachedResetLayer } from "../cachedData";
import { getDefaultResetLayerPlayerData } from "../playerData";
import { getResetLayerPlayerDataProp } from "./get";

export function setFixedResetLayerDates(
  mergedPlayer: MergedPlayer,
  currentGameTime: number,
) {
  const container = mergedPlayer.player.resetLayers;

  for (const data of Object.values(container)) {
    if (!data) continue;

    data.startedDate = fixGameTime(
      mergedPlayer,
      data.startedDate,
      currentGameTime,
    );
  }
}

export function setResetLayerPlayerData(
  playerLike: PlayerLike,
  resetLayerId: ResetLayerId,
  data: Partial<ResetLayerPlayerData>,
): PartialPlayer {
  const player = parsePlayerLike(playerLike);

  const resetLayerContainer = player.resetLayers;
  const newContainer = resetLayerContainer
    ? copyObject(resetLayerContainer)
    : {};

  let existingData = newContainer[resetLayerId];
  if (!existingData) {
    existingData = newContainer[resetLayerId] =
      getDefaultResetLayerPlayerData();
  }

  const newData = mergeObjects(existingData, data);
  newContainer[resetLayerId] = newData;

  return {
    resetLayers: newContainer,
  };
}

export function setResetLayerCachedPlayerData(
  cachedPlayerLike: CachedPlayerLike,
  resetLayerId: ResetLayerId,
  data: Partial<CachedResetLayer>,
): Partial<CachedPlayer> {
  const cachedPlayer = parseCachedPlayerLike(cachedPlayerLike);

  const resetLayerContainer = cachedPlayer.resetLayers;
  const newContainer = resetLayerContainer
    ? copyObject(resetLayerContainer)
    : {};

  let existingData = newContainer[resetLayerId];
  if (!existingData) {
    existingData = newContainer[resetLayerId] = getDefaultCachedResetLayer();
  }

  const newData = mergeObjects(existingData, data);
  newContainer[resetLayerId] = newData;

  return {
    resetLayers: newContainer,
  };
}

export function setResetLayerAuto(
  playerLike: PlayerLike,
  resetLayerId: ResetLayerId,
  value: ResetLayerPlayerData["autoEnabled"],
): PartialPlayer | undefined {
  const player = parsePlayerLike(playerLike);

  if (
    getResetLayerPlayerDataProp(player, resetLayerId, "autoEnabled") === value
  )
    return;

  return setResetLayerPlayerData(player, resetLayerId, {
    autoEnabled: value,
  });
}

export function toggleResetLayerAuto(
  playerLike: PlayerLike,
  resetLayerId: ResetLayerId,
) {
  const player = parsePlayerLike(playerLike);

  return setResetLayerPlayerData(player, resetLayerId, {
    autoEnabled: !getResetLayerPlayerDataProp(
      player,
      resetLayerId,
      "autoEnabled",
    ),
  });
}
