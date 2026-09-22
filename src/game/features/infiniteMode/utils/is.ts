import { hasNexusLevel } from "@game/features/nexus/utils/has";
import { PlayerLike } from "@game/player/types";
import { parsePlayerLike } from "@game/player/utils";

export function isInInfiniteMode(playerLike: PlayerLike): boolean {
  const player = parsePlayerLike(playerLike);

  return player.enteredInfiniteMode ?? false;
}

export function isInfiniteModeUnlocked(playerLike: PlayerLike): boolean {
  const player = parsePlayerLike(playerLike);

  return hasNexusLevel(player, 1);
}
