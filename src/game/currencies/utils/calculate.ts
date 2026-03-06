import createDecimal from "@core/utils/decimal";
import { getCurrencyData } from "./get";
import { isFunction } from "@core/utils/function";
import { MergedPlayer } from "@game/player/merged/types";
import { CurrencyId } from "../types";
import mainFormulas from "@game/formulas/main";
import currencyGainFormulas from "@game/formulas/currencies/gains";
import Decimal from "break_eternity.js";
import currencyEffectFormulas from "@game/formulas/currencies/effects";
import { getDefaultCachedCurrency } from "@game/player/cached/default";
import { getDefaultCachedCurrencyEffect } from "@game/player/cached/default";
import { shouldDimensionWork } from "@game/dimensions/utils/check";

export function calculateCurrencyGain(
  mergedPlayer: MergedPlayer,
  currencyId: CurrencyId,
  isPassive: boolean = false,
) {
  const gainProperty = currencyGainFormulas[currencyId];
  if (!gainProperty) return createDecimal(0);

  const data = getCurrencyData(currencyId);
  const { dimensionId } = data;

  const isPropertyFunction = isFunction(gainProperty);
  const isPropertyObject = !isPropertyFunction;

  const gainFormula = isPropertyFunction ? gainProperty : gainProperty.gain;
  const baseGain = gainFormula(mergedPlayer);

  const softcappedGain = mainFormulas.getMultiplier(
    mergedPlayer,
    currencyId,
    baseGain,
    dimensionId,
    data.layer,
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

  const data = getCurrencyData(currencyId);
  if (!shouldDimensionWork(mergedPlayer, data.dimensionId))
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
