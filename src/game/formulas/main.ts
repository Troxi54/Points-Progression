import type { CurrencyId } from "@game/currencies/types";
import type { DimensionId } from "@game/dimensions/types";
import type { MergedPlayer } from "@game/player/merged/types";
import type { LayerNumber } from "@game/resetLayers/types";
import type Decimal from "break_eternity.js";
import createDecimal from "@core/utils/decimal";
import { hasKey, isObject, objectEntries } from "@core/utils/object";
import currencyData from "@game/currencies/data";
import { currencyEffectWorks } from "@game/currencies/utils/calculate";
import { getCurrencyEffectOn } from "@game/currencies/utils/get";
import { shouldDimensionWork } from "@game/dimensions/utils/check";
import { parseValueGetter } from "@game/player/utils";
import { flatRepeatableUpgrades } from "@game/repeatableUpgrades/data";
import { getCachedRepeatableUpgradeProp } from "@game/repeatableUpgrades/utils/get";
import { calculateSoftcappedGain } from "@game/softcappers/utils/calculate";
import layerFormulas from "./layers";

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

    if (!currencyEffectWorks(mergedPlayer, currencyFrom, effectOn))
      return createDecimal(1);

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

          const { mode } = effectData;
          if (mode !== undefined) {
            effectMode = mode;
          }
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
