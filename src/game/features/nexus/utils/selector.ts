import type { PlayerLike } from "@game/player/types";
import type { DecimalSource } from "break_eternity.js";
import type { NexusLevelSelection } from "../types";
import { objectFromEntries } from "@core/utils/object";
import { parsePlayerLike } from "@game/player/utils";
import { hasNexusLevel } from "./has";

export function hasNexusLevelSelection<T extends string>(
  playerLike: PlayerLike,
  level: DecimalSource,
  levelName: T,
): { [K in NexusLevelSelection<T>]: boolean } {
  return {
    [`hasNexusLevel${levelName}`]: hasNexusLevel(playerLike, level),
  } as { [K in NexusLevelSelection<T>]: boolean };
}

export function hasNexusLevelsSelection<T extends [DecimalSource, string][]>(
  playerLike: PlayerLike,
  levels: T,
): { [K in T[number] as NexusLevelSelection<K["1"]>]: boolean } {
  const player = parsePlayerLike(playerLike);

  return objectFromEntries(
    levels.map(([level, name]) => {
      const key = `hasNexusLevel${name}`;
      return [key, hasNexusLevel(player, level)];
    }),
  ) as { [K in T[number] as NexusLevelSelection<K["1"]>]: boolean };
}
