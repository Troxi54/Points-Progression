import { PartialPlayer, Player } from "@/game/player/types";
import playerPersistenceConfig from "./config";
import { decompressPlayerString } from "./decompress";
import { migratePlayer } from "./migrate";
import { normalizePlayer, sanitizePlayer } from "./normalize";
import gameConfig from "@/core/config/data";
import { unminifyPlayer } from "./minify";

function loadPlayerDataFromLocalStorage(): string | null {
  const data = localStorage.getItem(playerPersistenceConfig.localStorageName);
  return data;
}

export function loadPlayerFromString(str: string): Player | undefined {
  const decompressed = decompressPlayerString(str);
  if (!decompressed) return;

  let unminified: PartialPlayer;
  if (Array.isArray(decompressed)) {
    unminified = unminifyPlayer(decompressed);
  } else {
    unminified = decompressed;
  }

  const normalized = normalizePlayer(unminified);
  const migrated = migratePlayer(normalized);
  const sanitized = sanitizePlayer(migrated);

  sanitized.gameVersion = gameConfig.gameVersion;

  return sanitized;
}

export function loadPlayer(str?: string): Player | undefined {
  const sourceStr = str ?? loadPlayerDataFromLocalStorage();
  if (!sourceStr) return;

  return loadPlayerFromString(sourceStr);
}
