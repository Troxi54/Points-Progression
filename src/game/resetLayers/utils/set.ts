import type { MergedPlayer } from "@game/player/merged/types";
import type { PlayerLike } from "@game/player/types";
import type { ResetLayerId } from "../ids";
import type { ResetLayerPlayerData } from "../playerData";
import { fixGameTime } from "@core/utils/gameTime";
import { mergeObjects } from "@core/utils/object";
import { parsePlayerLike } from "@game/player/utils";
import { getDefaultResetLayerPlayerData } from "../playerData";
import { getResetLayerPlayerData } from "./get";

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
) {
  const player = parsePlayerLike(playerLike);

  const container = player.resetLayers;
  if (!container) return;

  let existingData = container[resetLayerId];
  if (!existingData) {
    existingData = container[resetLayerId] = getDefaultResetLayerPlayerData();
  }

  container[resetLayerId] = mergeObjects(existingData, data);
}

export function setResetLayerAuto(
  playerLike: PlayerLike,
  resetLayerId: ResetLayerId,
  value: ResetLayerPlayerData["autoEnabled"],
) {
  const player = parsePlayerLike(playerLike);

  if (getResetLayerPlayerData(player, resetLayerId).autoEnabled === value)
    return;

  setResetLayerPlayerData(player, resetLayerId, {
    autoEnabled: value,
  });
}

export function toggleResetLayerAuto(
  playerLike: PlayerLike,
  resetLayerId: ResetLayerId,
) {
  const player = parsePlayerLike(playerLike);

  setResetLayerPlayerData(player, resetLayerId, {
    autoEnabled: !getResetLayerPlayerData(player, resetLayerId).autoEnabled,
  });
}
