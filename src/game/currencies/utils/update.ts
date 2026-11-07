import type { MergedPlayer } from "@game/player/merged/types";
import type Decimal from "break_eternity.js";
import type { CurrencyId } from "../types";
import createDecimal from "@core/utils/decimal";
import { isFunction } from "@core/utils/function";
import { isObject, objectEntries, objectKeys } from "@core/utils/object";
import currencyEffectFormulas from "@game/formulas/currencies/effects";
import { parseValueGetter } from "@game/player/utils";
import currencyConfig from "../data";
import {
  calculateCurrencyGain,
  calculateCurrencyPassiveGainFromGain,
  calculateEffectOnCurrency,
} from "./calculate";

export function updateCurrencyEffects(mergedPlayer: MergedPlayer) {
  const {
    cachedPlayer: { currencies },
  } = mergedPlayer;

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

      currencies[currencyId].effect = newEffects;

      continue;
    }

    const effectFormula = isPropertyFunction
      ? effectProperty
      : effectProperty[affects];
    if (!effectFormula) continue;

    const newEffect = effectFormula(mergedPlayer);

    currencies[currencyId].effect = newEffect;
  }
}

export function updateCurrencyGains(mergedPlayer: MergedPlayer) {
  const {
    cachedPlayer: { currencies },
  } = mergedPlayer;

  for (const [currencyId, data] of objectEntries(currencyConfig)) {
    const gain = calculateCurrencyGain(mergedPlayer, currencyId, false);

    const passiveGainWorks = parseValueGetter(
      data.passiveGainWorks,
      mergedPlayer,
    );
    const passiveGain = passiveGainWorks
      ? calculateCurrencyPassiveGainFromGain(mergedPlayer, currencyId, gain)
      : createDecimal(0);

    currencies[currencyId].gain = gain;
    currencies[currencyId].passiveGain = passiveGain;
  }
}
