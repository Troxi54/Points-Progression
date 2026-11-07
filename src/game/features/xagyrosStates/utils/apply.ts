import type { MergedPlayer } from "@game/player/merged/types";
import type { XagyrosState } from "../states";
import { everPerformed } from "@game/resetLayers/utils/get";
import { triggerResetLayer } from "@game/resetLayers/utils/trigger";
import { isXagyrosStateActive } from "./get";

export function activateXagyrosState(
  mergedPlayer: MergedPlayer,
  state: XagyrosState,
) {
  if (!everPerformed(mergedPlayer, "xagyros")) return null;
  if (isXagyrosStateActive(mergedPlayer, state)) return null;

  const { player, cachedPlayer } = mergedPlayer;

  triggerResetLayer(mergedPlayer, "xagyros");

  player.xagyrosStates = [state, ...player.xagyrosStates].slice(
    0,
    cachedPlayer.maxXagyrosStates,
  );
}
