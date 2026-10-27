import type { MergedPlayer } from "@game/player/merged/types";
import type Decimal from "break_eternity.js";
import type { CurrencyId } from "../types";
import createDecimal from "@core/utils/decimal";
import { isFunction } from "@core/utils/function";
import { hasKey } from "@core/utils/object";
import { shouldDimensionWork } from "@game/dimensions/utils/check";
import currencyEffectFormulas from "@game/formulas/currencies/effects";
import currencyGainFormulas from "@game/formulas/currencies/gains";
import mainFormulas from "@game/formulas/main";
import {
  getDefaultCachedCurrency,
  getDefaultCachedCurrencyEffect,
} from "@game/player/cached/default";
import { parseValueGetter } from "@game/player/utils";
import { getCurrencyConfig } from "./get";

export function calculateCurrencyGain(
  mergedPlayer: MergedPlayer,
  currencyId: CurrencyId,
  isPassive: boolean = false,
) {
  const gainProperty = currencyGainFormulas[currencyId];
  if (!gainProperty) return createDecimal(0);

  const config = getCurrencyConfig(currencyId);
  const { dimensionId } = config;

  const isPropertyFunction = isFunction(gainProperty);
  const isPropertyObject = !isPropertyFunction;

  const gainFormula = isPropertyFunction ? gainProperty : gainProperty.gain;
  const baseGain = gainFormula(mergedPlayer);

  const softcappedGain = mainFormulas.getMultiplier(
    mergedPlayer,
    currencyId,
    baseGain,
    dimensionId,
    config.layer,
  );

  let afterSoftcaps = softcappedGain;
  if (isPropertyObject && gainProperty.postSoftcapGain) {
    afterSoftcaps = gainProperty.postSoftcapGain(mergedPlayer, softcappedGain);
  }

  if (!isPassive) return afterSoftcaps;
  if (!shouldDimensionWork(mergedPlayer, dimensionId)) return createDecimal(0);

  let passiveGain = afterSoftcaps;
  if (isPropertyObject && gainProperty.passiveGain) {
    passiveGain = gainProperty.passiveGain(mergedPlayer, afterSoftcaps);
  }

  return passiveGain;
}

export function calculateCurrencyPassiveGain(
  mergedPlayer: MergedPlayer,
  currencyId: CurrencyId,
) {
  return calculateCurrencyGain(mergedPlayer, currencyId, true);
}

export function calculateCurrencyPassiveGainFromGain(
  mergedPlayer: MergedPlayer,
  currencyId: CurrencyId,
  gain: Decimal,
) {
  const gainProperty = currencyGainFormulas[currencyId];
  if (!gainProperty) return getDefaultCachedCurrency().passiveGain;

  const config = getCurrencyConfig(currencyId);
  if (!shouldDimensionWork(mergedPlayer, config.dimensionId))
    return createDecimal(0);

  if (isFunction(gainProperty) || !gainProperty.passiveGain) return gain;

  return gainProperty.passiveGain(mergedPlayer, gain);
}

export function calculateEffectOnCurrency(
  mergedPlayer: MergedPlayer,
  currencyId: CurrencyId,
  effectOn: CurrencyId,
) {
  const effectProperty = currencyEffectFormulas[currencyId];
  if (!effectProperty) return getDefaultCachedCurrencyEffect();

  if (isFunction(effectProperty)) return effectProperty(mergedPlayer);

  return (
    effectProperty[effectOn]?.(mergedPlayer) ?? getDefaultCachedCurrencyEffect()
  );
}

export function currencyEffectWorks(
  mergedPlayer: MergedPlayer,
  currencyId: CurrencyId,
  effectOn: CurrencyId,
): boolean {
  const config = getCurrencyConfig(currencyId);
  const { affects } = config;

  const effectWorks = parseValueGetter(config.effectWorks, mergedPlayer);
  if (!effectWorks) return false;

  const effectDataHasCurrency = hasKey(effectOn, affects);
  if (effectDataHasCurrency) {
    const effectData = affects[effectOn];
    if (effectData) {
      const works = parseValueGetter(effectData.works, mergedPlayer);
      if (!works) return false;
    }
  }

  const hasEffectOnIt = affects === effectOn || hasKey(effectOn, affects);
  if (!hasEffectOnIt) return false;

  return true;
}
