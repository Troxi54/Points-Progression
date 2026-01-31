import { CachedCurrency, CachedPlayerLike } from "@/game/player/cached/types";
import {
  CachedCurrencyEffectSelection,
  CachedCurrencyPropSelection,
  CurrencyId
} from "../types";
import { parseCachedPlayerLike } from "@/game/player/utils";
import { mergeObjects, objectFromEntries } from "@/core/utils/object";
import { getCachedCurrencyProp } from "./get";
import Decimal from "break_eternity.js";
import { isDecimal } from "@/core/utils/decimal";
import { getDefaultCachedCurrencyEffect } from "@/game/player/cached/default";

export function getCachedCurrencySelection<
  C extends CurrencyId,
  P extends (keyof CachedCurrency)[],
  EI extends CurrencyId[] | undefined = undefined
>(
  cachedPlayerLike: CachedPlayerLike,
  currencyId: C,
  props: P,
  effects?: EI
): {
  [K in P[number] as CachedCurrencyPropSelection<C, K>]: CachedCurrency[K];
} & (EI extends undefined
  ? object
  : EI extends CurrencyId[]
    ? {
        [K in CachedCurrencyEffectSelection<C, EI[number]>]: Decimal;
      }
    : never) {
  const cachedPlayer = parseCachedPlayerLike(cachedPlayerLike);

  return mergeObjects(
    objectFromEntries(
      props.map((prop) => {
        const key: CachedCurrencyPropSelection<C, P[number]> =
          `cachedCurrency_${currencyId}_${prop}`;
        const value = getCachedCurrencyProp(cachedPlayer, currencyId, prop);
        return [key, value];
      })
    ),
    effects
      ? objectFromEntries(
          effects.map((effect) => {
            const key = `cachedCurrency_${currencyId}_${effect}`;
            const effectProp = getCachedCurrencyProp(
              cachedPlayer,
              currencyId,
              "effect"
            );
            const value = isDecimal(effectProp)
              ? effectProp
              : (effectProp[effect] ?? getDefaultCachedCurrencyEffect());
            return [key, value];
          })
        )
      : {}
  ) as ReturnType<typeof getCachedCurrencySelection>;
}

export function getCachedCurrencyPropSelection<
  T extends CurrencyId,
  P extends keyof CachedCurrency
>(cachedPlayerLike: CachedPlayerLike, currencyId: T, prop: P) {
  return getCachedCurrencySelection(cachedPlayerLike, currencyId, [prop]);
}
