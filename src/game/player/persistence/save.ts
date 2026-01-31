import { Player } from "@/game/player/types";
import playerPersistenceConfig from "./config";
import { getPlayerState } from "@/game/player/store/store";
import { MergedPlayer } from "@/game/player/merged/types";
import { getCurrentTime } from "@/core/utils/time";
import { serializePlayer } from "./compress";

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
  currentTime: number = getCurrentTime()
) {
  const { player, cachedPlayer } = mergedPlayer;
  if (!player.autosave) return false;

  const timeSinceLastSave = currentTime - cachedPlayer.lastSave;

  return timeSinceLastSave >= playerPersistenceConfig.autoSaveInterval;
}
