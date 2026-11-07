import type { CachedPlayer } from "@game/player/cached/types";
import { objectKeys } from "@core/utils/object";
import { getDefaultCachedCurrency } from "../cachedData";
import currencyConfig from "../data";

export function syncCachedCurrencies(cachedPlayer: CachedPlayer) {
  const { currencies } = cachedPlayer;

  for (const currencyId of objectKeys(currencyConfig)) {
    if (currencies[currencyId]) continue;

    currencies[currencyId] = getDefaultCachedCurrency();
  }
}
