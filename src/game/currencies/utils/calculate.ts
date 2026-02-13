import createDecimal from "@/core/utils/decimal";
import { getCurrencyData } from "./get";
import { isFunction } from "@/core/utils/function";
import { MergedPlayer } from "@/game/player/merged/types";
import { CurrencyId } from "../types";
import mainFormulas from "@game/formulas/main";
import currencyGainFormulas from "@game/formulas/currencies/gains";
import Decimal from "break_eternity.js";
import currencyEffectFormulas from "@game/formulas/currencies/effects";
import { getDefaultCachedCurrency } from "@/game/player/cached/default";
import { getDefaultCachedCurrencyEffect } from "@/game/player/cached/default";

export function calculateCurrencyGain(
  mergedPlayer: MergedPlayer,
  currencyId: CurrencyId,
  isPassive: boolean = false,
) {
  const gainProperty = currencyGainFormulas[currencyId];
  if (!gainProperty) return createDecimal(0);

  const data = getCurrencyData(currencyId);

  const isPropertyFunction = isFunction(gainProperty);
  const isPropertyObject = !isPropertyFunction;

  const gainFormula = isPropertyFunction ? gainProperty : gainProperty.gain;
  const baseGain = gainFormula(mergedPlayer);

  const beforeSoftcaps = mainFormulas.boostBeforeSoftcaps(
    mergedPlayer,
    currencyId,
    baseGain,
    data.dimensionId,
    data.layer,
  );
  const softcappedGain = mainFormulas.getCurrencySoftcapped(
    mergedPlayer,
    currencyId,
    beforeSoftcaps,
  );

  let afterSoftcaps = softcappedGain;
  if (isPropertyObject && gainProperty.postSoftcapGain) {
    afterSoftcaps = gainProperty.postSoftcapGain(mergedPlayer, softcappedGain);
  }

  if (!isPassive) return afterSoftcaps;

  let passiveGain = afterSoftcaps;
  if (isPropertyObject && gainProperty.passiveGain) {
    passiveGain = gainProperty.passiveGain(mergedPlayer, softcappedGain);
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

  if (isFunction(gainProperty) || !gainProperty.passiveGain) return gain;

  return gainProperty.passiveGain(mergedPlayer, gain);
}

export function calculateEffectForCurrency(
  mergedPlayer: MergedPlayer,
  currencyId: CurrencyId,
  currencyFor: CurrencyId,
) {
  const effectProperty = currencyEffectFormulas[currencyId];
  if (!effectProperty) return getDefaultCachedCurrencyEffect();

  if (isFunction(effectProperty)) return effectProperty(mergedPlayer);

  return (
    effectProperty[currencyFor]?.(mergedPlayer) ??
    getDefaultCachedCurrencyEffect()
  );
}
