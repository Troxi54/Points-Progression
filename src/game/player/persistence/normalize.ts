import type { PartialPlayer } from "@game/player/types";
import type { Player } from "../schemas";
import { PlayerSchema } from "@game/player/schemas";
import * as z from "@zod/mini";

export function normalizePlayer(player: PartialPlayer): Player {
  return z.looseObject(PlayerSchema.shape).parse(player);
}

export function sanitizePlayer(player: PartialPlayer): Player {
  const result = PlayerSchema.parse(player);

  return result;
}
