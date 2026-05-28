import type { CachedCurrency, CachedPlayerLike } from "@game/player/cached/types";
import type Decimal from "break_eternity.js";
import type { CurrencyId } from "../types";
import { isDecimal } from "@core/utils/decimal";
import { objectFromEntries } from "@core/utils/object";
import { getDefaultCachedCurrency, getDefaultCachedCurrencyEffect  } from "@game/player/cached/default";
import { parseCachedPlayerLike } from "@game/player/utils";
import currencyData from "../data";

export function getCurrencyData(currencyId: CurrencyId) {
  return currencyData[currencyId];
}

export function getCachedCurrencyProp<P extends keyof CachedCurrency>(
  cachedPlayerLike: CachedPlayerLike,
  currencyId: CurrencyId,
  prop: P,
): CachedCurrency[P] {
  const cachedPlayer = parseCachedPlayerLike(cachedPlayerLike);
  return (
    cachedPlayer.currencies?.[currencyId]?.[prop] ??
    getDefaultCachedCurrency()[prop]
  );
}

export function getCachedCurrencyProps<P extends (keyof CachedCurrency)[]>(
  cachedPlayerLike: CachedPlayerLike,
  currencyId: CurrencyId,
  props: P,
): { [K in P[number]]: CachedCurrency[K] } {
  const cachedPlayer = parseCachedPlayerLike(cachedPlayerLike);
  const defaultCurrency = getDefaultCachedCurrency();

  return objectFromEntries(
    props.map((prop) => {
      const value =
        cachedPlayer.currencies?.[currencyId]?.[prop] ?? defaultCurrency[prop];
      return [prop, value];
    }),
  ) as { [K in P[number]]: CachedCurrency[K] };
}

export function getCurrencyEffect(
  cachedPlayerLike: CachedPlayerLike,
  currencyId: CurrencyId,
) {
  return getCachedCurrencyProp(cachedPlayerLike, currencyId, "effect");
}

export function parseCurrencyEffect(
  effect: CachedCurrency["effect"],
  affects: CurrencyId,
): Decimal {
  if (isDecimal(effect)) return effect;

  return effect[affects] ?? getDefaultCachedCurrencyEffect();
}

export function getCurrencyEffectOn(
  cachedPlayerLike: CachedPlayerLike,
  currencyFrom: CurrencyId,
  effectOn: CurrencyId,
): Decimal {
  const effectProp = getCurrencyEffect(cachedPlayerLike, currencyFrom);
  return parseCurrencyEffect(effectProp, effectOn);
}
