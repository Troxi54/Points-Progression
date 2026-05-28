import type { PlayerLike } from "@game/player/types";
import type { XagyrosState } from "../types";
import { parsePlayerLike } from "@game/player/utils";
import xagyrosStateCurrencyMap from "../map";

export function isXagyrosStateActive(
  playerLike: PlayerLike,
  state: XagyrosState,
): boolean {
  const player = parsePlayerLike(playerLike);

  return player.xagyrosStates?.includes(state) ?? false;
}

export function getXagyrosStateCurrencyId<T extends XagyrosState>(
  state: T,
): (typeof xagyrosStateCurrencyMap)[T] {
  return xagyrosStateCurrencyMap[state];
}
