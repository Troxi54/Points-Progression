import { CachedCurrency, CachedPlayerLike } from "@/game/player/cached/types";
import currencyData from "../data";
import { CurrencyId } from "../types";
import { getDefaultCachedCurrency } from "@/game/player/cached/default";
import { getDefaultCachedCurrencyEffect } from "@/game/player/cached/default";
import { objectFromEntries } from "@/core/utils/object";
import { parseCachedPlayerLike } from "@/game/player/utils";
import { isDecimal } from "@/core/utils/decimal";
import Decimal from "break_eternity.js";

export function getCurrencyData(currencyId: CurrencyId) {
  return currencyData[currencyId];
}

export function getCachedCurrencyProp<P extends keyof CachedCurrency>(
  cachedPlayerLike: CachedPlayerLike,
  currencyId: CurrencyId,
  prop: P
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
  props: P
): { [K in P[number]]: CachedCurrency[K] } {
  const cachedPlayer = parseCachedPlayerLike(cachedPlayerLike);
  const defaultCurrency = getDefaultCachedCurrency();

  return objectFromEntries(
    props.map((prop) => {
      const value =
        cachedPlayer.currencies?.[currencyId]?.[prop] ?? defaultCurrency[prop];
      return [prop, value];
    })
  ) as { [K in P[number]]: CachedCurrency[K] };
}

export function getCurrencyEffect(
  cachedPlayerLike: CachedPlayerLike,
  currencyId: CurrencyId
) {
  return getCachedCurrencyProp(cachedPlayerLike, currencyId, "effect");
}

export function parseCurrencyEffect(
  effect: CachedCurrency["effect"],
  affects: CurrencyId
): Decimal {
  if (isDecimal(effect)) return effect;

  return effect[affects] ?? getDefaultCachedCurrencyEffect();
}

export function getCurrencyEffectFor(
  cachedPlayerLike: CachedPlayerLike,
  currencyFrom: CurrencyId,
  currencyFor: CurrencyId
): Decimal {
  const effectProp = getCurrencyEffect(cachedPlayerLike, currencyFrom);
  return parseCurrencyEffect(effectProp, currencyFor);
}
