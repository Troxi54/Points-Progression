import type { MergedPlayer } from "@game/player/merged/types";
import type { Player } from "@game/player/types";
import { getCurrentTime } from "@core/utils/time";
import { getPlayerState } from "@game/player/store";
import { serializePlayer } from "./compress";
import playerPersistenceConfig from "./config";

function savePlayerStringToLocalStorage(str: string) {
  localStorage.setItem(playerPersistenceConfig.localStorageName, str);
}

export function savePlayerFromString(str: string) {
  savePlayerStringToLocalStorage(str);
}

export function savePlayer(player: Player = getPlayerState().player) {
  const serialized = serializePlayer(player);
  savePlayerFromString(serialized);
}

export function canAutoSave(
  mergedPlayer: MergedPlayer,
  currentTime: number = getCurrentTime(),
) {
  const { player, cachedPlayer } = mergedPlayer;
  if (!player.autosave) return false;

  const timeSinceLastSave = currentTime - cachedPlayer.lastSave;

  return timeSinceLastSave >= playerPersistenceConfig.autoSaveInterval;
}
