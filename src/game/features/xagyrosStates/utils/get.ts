import { XagyrosState } from "../types";
import xagyrosStateCurrencyMap from "../map";
import { PlayerLike } from "@game/player/types";
import { parsePlayerLike } from "@game/player/utils";

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
