import { MergedPlayer, PartialMergedPlayer } from "@game/player/merged/types";
import { XagyrosState } from "../types";
import { isXagyrosStateActive } from "./get";
import { triggerResetLayer } from "@game/resetLayers/utils/apply";
import { everPerformed } from "@game/resetLayers/utils/get";

export function activateXagyrosState(
  mergedPlayer: MergedPlayer,
  state: XagyrosState,
): PartialMergedPlayer | null {
  if (!everPerformed(mergedPlayer, "xagyros")) return null;
  if (isXagyrosStateActive(mergedPlayer, state)) return null;

  const triggered = triggerResetLayer(mergedPlayer, "xagyros");

  const {
    cachedPlayer: { maxXagyrosStates },
  } = triggered;

  const newStates = [state, ...triggered.player.xagyrosStates].slice(
    0,
    maxXagyrosStates,
  );

  triggered.player.xagyrosStates = newStates;

  return triggered;
}
