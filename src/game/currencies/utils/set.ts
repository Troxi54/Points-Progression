import { mergeObjects } from "@core/utils/object";
import type {
  CachedPlayerLike,
  CachedCurrency,
} from "@game/player/cached/types";
import { parseCachedPlayerLike } from "@game/player/utils";
import type { CurrencyId } from "../types";

export function setCachedCurrency(
  cachedPlayerLike: CachedPlayerLike,
  currencyId: CurrencyId,
  cachedCurrency: Partial<CachedCurrency>,
) {
  const cachedPlayer = parseCachedPlayerLike(cachedPlayerLike);

  let currencies = cachedPlayer.currencies;
  if (!currencies) {
    currencies = cachedPlayer.currencies = {};
  }

  const existingValue = currencies[currencyId];
  const value = mergeObjects(existingValue, cachedCurrency);

  currencies[currencyId] = value;
}
