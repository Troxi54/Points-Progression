import type { PlayerLike } from "@game/player/types";
import type { DecimalSource } from "break_eternity.js";
import { parsePlayerLike } from "@game/player/utils";

export function hasNexusLevel(
  playerLike: PlayerLike,
  level: DecimalSource,
): boolean {
  const player = parsePlayerLike(playerLike);

  return player.nexusLevel?.greaterThanOrEqualTo(level) ?? false;
}
