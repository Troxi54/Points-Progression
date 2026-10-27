import type {
  CurrencyContainerConfig,
  PartialCurrencyConfig,
  PartialCurrencyContainerConfig,
} from "../types";
import {
  isObject,
  mergeObjects,
  objectEntries,
  objectFromEntries,
} from "@core/utils/object";
import getDefaultCurrencyConfig, {
  getDefaultCurrencyEffectData,
} from "../default";

function buildCurrencyConfig(currencyConfig?: PartialCurrencyConfig) {
  const defaultConfig = getDefaultCurrencyConfig();
  const newConfig = mergeObjects(defaultConfig, currencyConfig);

  const effectData = newConfig.affects;
  if (isObject(effectData)) {
    const defaultEffectData = getDefaultCurrencyEffectData();
    for (const [affects, data] of objectEntries(effectData)) {
      const newEffectData = mergeObjects(defaultEffectData, data);
      effectData[affects] = newEffectData;
    }
  }

  return newConfig;
}

export function createCurrencyContainerConfig(
  container: PartialCurrencyContainerConfig,
): CurrencyContainerConfig {
  return objectFromEntries(
    objectEntries(container).map(([id, data]) => {
      return [id, buildCurrencyConfig(data)];
    }),
  );
}
