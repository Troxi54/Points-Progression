import type { PartialPlayer } from "@game/player/types";
import type { Player } from "../schemas";
import { objectEntries } from "@core/utils/object";
import { getDefaultPlayer, PlayerSchema } from "@game/player/schemas";
import * as z from "@zod/mini";

export function normalizePlayer(player: PartialPlayer): Player {
  return z.looseObject(PlayerSchema.shape).parse(player);
}

export function sanitizePlayer(player: PartialPlayer): Player {
  const result = getDefaultPlayer();

  for (const [key, value] of objectEntries(player)) {
    if (!(key in result)) continue;

    (result[key] as unknown) = value;
  }

  return result;
}
