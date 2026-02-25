import createDecimal from "@/core/utils/decimal";
import { DimensionId } from "@/game/dimensions/types";
import { MergedPlayer } from "@/game/player/merged/types";
import { shouldDimensionWork } from "@/game/dimensions/utils/check";
import layerFormulas from "./layers";
import { CurrencyId } from "@/game/currencies/types";
import Decimal from "break_eternity.js";
import { calculateSoftcappedGain } from "@/game/softcappers/utils/calculate";
import { flatRepeatableUpgrades } from "@/game/repeatableUpgrades/data";
import { hasKey, isObject, objectEntries } from "@/core/utils/object";
import { getCachedRepeatableUpgradeProp } from "@/game/repeatableUpgrades/utils/get";
import currencyData from "@/game/currencies/data";
import { LayerNumber } from "@/game/resetLayers/types";
import {
  getCurrencyData,
  getCurrencyEffectOn,
} from "@/game/currencies/utils/get";
import { parseValueGetter } from "@/game/player/utils";

const mainFormulas = {
  getGlobalMultiplier() {
    return createDecimal(1);
  },
  getDimensionMultiplier(mergedPlayer: MergedPlayer, dimensionId: DimensionId) {
    return createDecimal(+shouldDimensionWork(mergedPlayer, dimensionId));
  },
  getLayerMultiplier(
    mergedPlayer: MergedPlayer,
    dimensionId: DimensionId,
    layer: LayerNumber,
  ) {
    if (layer === null) return createDecimal(1);

    const dimension = layerFormulas[dimensionId];
    if (!dimension) {
      return createDecimal(1);
    }

    return dimension[layer - 1]?.(mergedPlayer) ?? createDecimal(1);
  },
  getCurrencyRepeatableUpgradeMultiplier(
    mergedPlayer: MergedPlayer,
    currencyId: CurrencyId,
  ) {
    let result = createDecimal(1);

    for (const [repeatableUpgradeId, repeatableUpgrade] of objectEntries(
      flatRepeatableUpgrades,
    )) {
      const { affects } = repeatableUpgrade;
      if (affects !== currencyId) continue;

      const multiplier = getCachedRepeatableUpgradeProp(
        mergedPlayer,
        repeatableUpgradeId,
        "effect",
      );
      result = result.multiply(multiplier);
    }

    return result;
  },
  getCurrencyMultiplier(
    mergedPlayer: MergedPlayer,
    currencyFrom: CurrencyId,
    effectOn?: CurrencyId,
  ) {
    if (!effectOn) return createDecimal(1);

    const data = getCurrencyData(currencyFrom);
    const { affects } = data;

    const effectWorks = parseValueGetter(data.effectWorks, mergedPlayer);
    if (!effectWorks) return createDecimal(1);

    const effectDataHasCurrency = hasKey(effectOn, affects);
    if (effectDataHasCurrency) {
      const effectData = affects[effectOn];
      if (effectData) {
        const works = parseValueGetter(effectData.works, mergedPlayer);
        if (!works) return createDecimal(1);
      }
    }

    const hasEffectOnIt = affects === effectOn || hasKey(effectOn, affects);
    if (!hasEffectOnIt) return createDecimal(1);

    return getCurrencyEffectOn(mergedPlayer, currencyFrom, effectOn);
  },
  boostCurrencyByOthers(
    mergedPlayer: MergedPlayer,
    currencyId: CurrencyId,
    currencyValue: Decimal,
  ) {
    let cumulativeMul = createDecimal(1);
    let cumulativePow = createDecimal(1);

    for (const [id, currency] of objectEntries(currencyData)) {
      const { affects } = currency;
      if (!affects) continue;

      let { effectMode } = currency;

      const effectWorks = parseValueGetter(currency.effectWorks, mergedPlayer);
      if (!effectWorks) continue;

      const effectDataHasCurrency =
        hasKey(currencyId, affects) && affects[currencyId] !== undefined;
      if (effectDataHasCurrency) {
        const effectData = affects[currencyId];
        if (effectData) {
          const works = parseValueGetter(effectData.works, mergedPlayer);
          if (!works) continue;

          effectMode = effectData.mode;
        }
      }

      const apply = () => {
        const value = this.getCurrencyMultiplier(mergedPlayer, id, currencyId);
        if (effectMode === "multiply") {
          return (cumulativeMul = cumulativeMul.multiply(value));
        }
        cumulativePow = cumulativePow.multiply(value);
      };

      if (!isObject(affects) || effectDataHasCurrency) {
        apply();
      }
    }

    return currencyValue.multiply(cumulativeMul).pow(cumulativePow);
  },
  getCurrencySoftcapped(
    mergedPlayer: MergedPlayer,
    currencyId: CurrencyId,
    currencyValue: Decimal,
  ) {
    return calculateSoftcappedGain(mergedPlayer, currencyId, currencyValue);
  },
  boostBeforeSoftcaps(
    mergedPlayer: MergedPlayer,
    currencyId: CurrencyId,
    currencyValue: Decimal,
    dimensionId: DimensionId,
    layer: LayerNumber,
  ) {
    const mainMultipliers = this.getGlobalMultiplier()
      .multiply(this.getDimensionMultiplier(mergedPlayer, dimensionId))
      .multiply(this.getLayerMultiplier(mergedPlayer, dimensionId, layer))
      .multiply(
        this.getCurrencyRepeatableUpgradeMultiplier(mergedPlayer, currencyId),
      );

    const boostedByMainMultipliers = currencyValue.multiply(mainMultipliers);
    const boostedByOtherCurrencies = this.boostCurrencyByOthers(
      mergedPlayer,
      currencyId,
      boostedByMainMultipliers,
    );

    return boostedByOtherCurrencies;
  },
  getMultiplier(
    mergedPlayer: MergedPlayer,
    currencyId: CurrencyId,
    currencyValue: Decimal,
    dimensionId: DimensionId,
    layer: LayerNumber,
  ) {
    const boostedValue = this.boostBeforeSoftcaps(
      mergedPlayer,
      currencyId,
      currencyValue,
      dimensionId,
      layer,
    );

    return this.getCurrencySoftcapped(mergedPlayer, currencyId, boostedValue);
  },
} as const;

export default mainFormulas;
