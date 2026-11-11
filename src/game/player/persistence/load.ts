import type { PartialPlayer } from "@game/player/types";
import type { Player } from "../schemas";
import gameConfig from "@core/config/data";
import playerPersistenceConfig from "./config";
import { decompressPlayerString } from "./decompress";
import { migratePlayer } from "./migrate";
import { unminifyPlayer } from "./minify";
import { normalizePlayer, sanitizePlayer } from "./normalize";

function loadPlayerDataFromLocalStorage(): string | null {
  const data = localStorage.getItem(playerPersistenceConfig.localStorageName);
  return data;
}

export function loadPlayerFromData(player: PartialPlayer) {
  const normalized = normalizePlayer(player);
  const migrated = migratePlayer(normalized);
  const sanitized = sanitizePlayer(migrated);

  sanitized.gameVersion = gameConfig.gameVersion;

  return sanitized;
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

  return loadPlayerFromData(unminified);
}

export function loadPlayer(str?: string): Player | undefined {
  const sourceStr = str ?? loadPlayerDataFromLocalStorage();
  if (!sourceStr) return;

  return loadPlayerFromString(sourceStr);
}
