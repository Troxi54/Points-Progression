import { PlayerLike } from "@/game/player/types";
import { parsePlayerLike } from "@/game/player/utils";
import { DecimalSource } from "break_eternity.js";

export function hasNexusLevel(
  playerLike: PlayerLike,
  level: DecimalSource
): boolean {
  const player = parsePlayerLike(playerLike);

  return player.nexusLevel?.greaterThanOrEqualTo(level) ?? false;
}
