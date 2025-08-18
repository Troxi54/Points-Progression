import Decimal from "break_eternity.js";
import { getDefaultCachedPlayer, getDefaultPlayer } from "./defaultPlayer";
import {
  CachedPlayer,
  MergedPlayer,
  PartialMergedPlayer,
  Player
} from "./playerTypes";
import { settings } from "./settings";
import { usePlayerStore } from "./playerStore";
import { resetGame } from "../startGame";

export function resetPlayerData() {
  const { setPlayer, setCachedPlayer } = usePlayerStore.getState();
  setPlayer(getDefaultPlayer());
  setCachedPlayer(getDefaultCachedPlayer());
}

export function resetPlayerDataAndGame() {
  resetPlayerData();
  resetGame();
}

export function isPlayerDataValid(data: string): boolean {
  try {
    const parsedData = JSON.parse(atob(data));
    if (typeof parsedData === "object") return true;
  } catch {
    return false;
  }
  return false;
}

export function compressPlayerData(player: Player): Partial<Player> {
  const defaultPlayer = getDefaultPlayer();

  const compressedPlayer: Partial<Player> = {};

  for (const [key, value] of Object.entries(player)) {
    const keyPlayer = key as keyof Player;

    const defaultPlayerValue = defaultPlayer[keyPlayer];

    if (value === defaultPlayer[keyPlayer]) continue;
    if (
      value instanceof Decimal &&
      defaultPlayerValue instanceof Decimal &&
      value.equals(defaultPlayerValue)
    )
      continue;

    compressedPlayer[keyPlayer] = value;
  }

  return compressedPlayer;
}

export function getConvertedPlayerData(player: Player): string {
  const compressed = compressPlayerData(player);
  return btoa(JSON.stringify(compressed));
}

export function savePlayerToLocalStorage(
  player: Player = usePlayerStore.getState().player
) {
  console.log("saving");
  try {
    const encryptedData = getConvertedPlayerData(player);
    localStorage.setItem(settings.localStorageName, encryptedData);
  } catch (error) {
    console.error("Saving player failed:", error);
  }
}

export function filterToType<T extends object>(input: unknown, template: T): T {
  const result = {} as T;

  if (typeof input !== "object" || input === null) return template;

  for (const key of Object.keys(template) as (keyof T)[]) {
    if (key in input) {
      result[key] = (input as T)[key];
    } else {
      result[key] = template[key];
    }
  }

  return result;
}

function fixPlayerData(player: Player): Player {
  const defaultPlayer = getDefaultPlayer();
  const ANTI_NEGATIVE = true;

  const result: Player = { ...player };

  for (const key of Object.keys(defaultPlayer) as (keyof Player)[]) {
    const value = result[key];
    const defaultValue = defaultPlayer[key];

    if (defaultValue instanceof Decimal) {
      let decimalValue: Decimal = new Decimal(0);

      if (value !== null && typeof value !== "boolean") {
        decimalValue = new Decimal(value);

        if (decimalValue.isNan() || (decimalValue.lessThan(0) && ANTI_NEGATIVE))
          decimalValue = new Decimal(0);
      }

      (result[key] as unknown as Decimal) = decimalValue;
    }
  }
  if (result.bestRun !== null && result.bestRun < settings.bestRunTimeLimit)
    result.bestRun = settings.bestRunTimeLimit;
  if (
    result.bestVermytes.lessThanOrEqualTo(0) &&
    result.everMadeVermyros &&
    !result.everMadeNullith
  ) {
    result.everMadeVermyros = false;
    result.vermyrosStartedDate = null;
  }
  if (
    !result.everMadeVermyros &&
    result.tier.lessThanOrEqualTo(0) &&
    result.everMadeTier
  ) {
    result.everMadeTier = false;
    result.tierStartedDate = null;
  }
  if (!result.everMadeTier && !result.autoTierEnabled)
    result.autoTierEnabled = true;
  if (!result.everMadeVermyros && !result.autoVermyrosEnabled)
    result.autoVermyrosEnabled = true;
  if (Date.now() - result.startedRun < 0) result.startedRun = Date.now();
  if (
    result.tierStartedDate !== null &&
    Date.now() - result.tierStartedDate < 0
  )
    result.tierStartedDate = Date.now();
  if (
    result.vermyrosStartedDate !== null &&
    Date.now() - result.vermyrosStartedDate < 0
  )
    result.vermyrosStartedDate = Date.now();
  result.gameVersion = defaultPlayer.gameVersion;
  return result;
}

export function loadPlayer(savedData: string): Player {
  const defaultPlayer = getDefaultPlayer();
  if (!savedData) {
    return defaultPlayer;
  }
  try {
    const parsedData = JSON.parse(atob(savedData));
    const merged = filterToType(parsedData, defaultPlayer);
    const fixed = fixPlayerData(merged);
    return fixed;
  } catch (error) {
    console.error("Error loading player data:", error);
    return defaultPlayer;
  }
}

export function loadAndSetPlayer(savedData: string) {
  const loaded = loadPlayer(savedData);
  if (loaded) {
    const { setPlayer } = usePlayerStore.getState();
    resetPlayerData();
    setPlayer(loaded);
    resetGame();
  }
}

export function loadPlayerFromLocalStorage(): Player | null {
  const savedData = localStorage.getItem(settings.localStorageName);
  if (!savedData) {
    return null;
  }
  return loadPlayer(savedData);
}

export function mergePlayer(
  player: Player,
  cachedPlayer: CachedPlayer
): MergedPlayer {
  return { player, cachedPlayer };
}

export function mergePartialPlayer(
  player: Partial<Player> | undefined,
  cachedPlayer: Partial<CachedPlayer> | undefined
): PartialMergedPlayer {
  return { player, cachedPlayer };
}
