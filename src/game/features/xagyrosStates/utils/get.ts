import { MergedPlayer } from "@game/player/merged/types";
import { XagyrosState } from "../types";
import xagyrosStateCurrencyMap from "../map";

export function isXagyrosStateActive(
  mergedPlayer: MergedPlayer,
  state: XagyrosState,
): boolean {
  return mergedPlayer.player.xagyrosStates.includes(state);
}

export function getXagyrosStateCurrencyId<T extends XagyrosState>(
  state: T,
): (typeof xagyrosStateCurrencyMap)[T] {
  return xagyrosStateCurrencyMap[state];
}
