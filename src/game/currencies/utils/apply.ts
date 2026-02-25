import { MergedPlayer } from "@/game/player/merged/types";
import {
  copyObject,
  isObject,
  mergeObjects,
  objectEntries,
  objectKeys,
} from "@/core/utils/object";
import currencyData from "../data";
import {
  CachedCurrency,
  CachedPlayerLike,
  PartialCachedPlayer,
} from "@/game/player/cached/types";
import createDecimal from "@/core/utils/decimal";
import { parseCachedPlayerLike, parseValueGetter } from "@/game/player/utils";
import {
  calculateEffectOnCurrency,
  calculateCurrencyGain,
  calculateCurrencyPassiveGainFromGain,
} from "./calculate";
import { CurrencyId } from "../types";
import currencyEffectFormulas from "@game/formulas/currencies/effects";
import { isFunction } from "@/core/utils/function";
import { PartialPlayer } from "@/game/player/types";
import { getCachedCurrencyProp } from "./get";
import Decimal from "break_eternity.js";

function setCachedCurrency(
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

export function applyUpdatedCurrencyEffects(
  mergedPlayer: MergedPlayer,
): PartialCachedPlayer {
  const result: PartialCachedPlayer = {
    currencies: copyObject(mergedPlayer.cachedPlayer.currencies),
  };

  for (const [currencyId, data] of objectEntries(currencyData)) {
    const { affects } = data;
    if (!affects) continue;

    const effectProperty = currencyEffectFormulas[currencyId];
    if (!effectProperty) continue;

    const isPropertyFunction = isFunction(effectProperty);
    const thereIsMultipleEffects = isObject(affects);

    if (thereIsMultipleEffects) {
      const newEffects = {} as Partial<Record<CurrencyId, Decimal>>;

      for (const effectCurrency of objectKeys(affects)) {
        const newEffect = calculateEffectOnCurrency(
          mergedPlayer,
          currencyId,
          effectCurrency,
        );
        if (newEffect) newEffects[effectCurrency] = newEffect;
      }

      setCachedCurrency(result, currencyId, {
        effect: newEffects,
      });

      continue;
    }

    const effectFormula = isPropertyFunction
      ? effectProperty
      : effectProperty[affects];
    if (!effectFormula) continue;

    const newEffect = effectFormula(mergedPlayer);

    setCachedCurrency(result, currencyId, {
      effect: newEffect,
    });
  }

  return result;
}

export function applyUpdatedCurrencyGains(
  mergedPlayer: MergedPlayer,
): PartialCachedPlayer {
  const result: PartialCachedPlayer = {
    currencies: copyObject(mergedPlayer.cachedPlayer.currencies),
  };

  for (const [currencyId, data] of objectEntries(currencyData)) {
    const gain = calculateCurrencyGain(mergedPlayer, currencyId, false);

    const passiveGainWorks = parseValueGetter(
      data.passiveGainWorks,
      mergedPlayer,
    );
    const passiveGain = passiveGainWorks
      ? calculateCurrencyPassiveGainFromGain(mergedPlayer, currencyId, gain)
      : createDecimal(0);

    setCachedCurrency(result, currencyId, {
      gain,
      passiveGain,
    });
  }

  return result;
}

export function applyGeneratedCurrencies(
  mergedPlayer: MergedPlayer,
  deltaTime: number,
): PartialPlayer {
  const result: PartialPlayer = {};

  const { cachedPlayer } = mergedPlayer;

  for (const [currencyId, data] of objectEntries(currencyData)) {
    const passiveGain = getCachedCurrencyProp(
      cachedPlayer,
      currencyId,
      "passiveGain",
    );
    if (passiveGain.equals(0)) continue;

    const passiveGainWorks = parseValueGetter(
      data.passiveGainWorks,
      mergedPlayer,
    );

    if (!passiveGainWorks) continue;

    const oldValue = mergedPlayer.player[currencyId];
    const newValue = oldValue.plus(passiveGain.multiply(deltaTime));

    result[currencyId] = newValue;
  }

  return result;
}
