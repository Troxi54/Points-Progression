import type { PartialPlayer } from "@game/player/types";
import type { Player } from "../schemas";
import { objectEntries } from "@core/utils/object";
import { PlayerSchema } from "@game/player/schemas";
import { getResetLayerConfig } from "@game/resetLayers/utils/get";
import * as z from "@zod/mini";

export function normalizePlayer(player: PartialPlayer): Player {
  return z.looseObject(PlayerSchema.shape).parse(player);
}

function sanitizeResetLayers(player: Player) {
  const { resetLayers } = player;
  if (!resetLayers) return;

  for (const [resetLayerId, resetLayer] of objectEntries(resetLayers)) {
    if (!resetLayer) continue;

    if (!getResetLayerConfig(resetLayerId).usesResetsCurrency) {
      delete resetLayer.offlineResetsPerSecond;
    }
  }
}

export function sanitizePlayer(player: Player): Player {
  const result = PlayerSchema.parse(player);

  sanitizeResetLayers(result);

  return result;
}
