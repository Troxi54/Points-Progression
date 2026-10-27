import type { PartialCachedPlayer } from "@game/player/cached/types";
import type { MergedPlayer } from "@game/player/merged/types";
import type Decimal from "break_eternity.js";
import type { CurrencyId } from "../types";
import createDecimal from "@core/utils/decimal";
import { isFunction } from "@core/utils/function";
import {
  copyObject,
  isObject,
  objectEntries,
  objectKeys,
} from "@core/utils/object";
import currencyEffectFormulas from "@game/formulas/currencies/effects";
import { parseValueGetter } from "@game/player/utils";
import currencyConfig from "../data";
import {
  calculateCurrencyGain,
  calculateCurrencyPassiveGainFromGain,
  calculateEffectOnCurrency,
} from "./calculate";
import { setCachedCurrency } from "./set";

export function updateCurrencyEffects(
  mergedPlayer: MergedPlayer,
): PartialCachedPlayer {
  const result: PartialCachedPlayer = {
    currencies: copyObject(mergedPlayer.cachedPlayer.currencies),
  };

  for (const [currencyId, data] of objectEntries(currencyConfig)) {
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

export function updateCurrencyGains(
  mergedPlayer: MergedPlayer,
): PartialCachedPlayer {
  const result: PartialCachedPlayer = {
    currencies: copyObject(mergedPlayer.cachedPlayer.currencies),
  };

  for (const [currencyId, data] of objectEntries(currencyConfig)) {
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
