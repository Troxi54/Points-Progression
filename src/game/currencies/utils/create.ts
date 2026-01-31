import {
  isObject,
  mergeObjects,
  objectEntries,
  objectFromEntries
} from "@/core/utils/object";
import getDefaultCurrencyData, {
  getDefaultCurrencyEffectData
} from "../default";
import {
  CurrencyDataContainer,
  PartialCurrencyData,
  PartialCurrencyDataContainer
} from "../types";

function createCurrencyData(currencyData?: PartialCurrencyData) {
  const defaultData = getDefaultCurrencyData();
  const newData = mergeObjects(defaultData, currencyData);

  const effectData = newData.affects;
  if (isObject(effectData)) {
    const defaultEffectData = getDefaultCurrencyEffectData();
    for (const [affects, data] of objectEntries(effectData)) {
      const newEffectData = mergeObjects(defaultEffectData, data);
      effectData[affects] = newEffectData;
    }
  }

  return newData;
}

export function createCurrencyDataContainer(
  container: PartialCurrencyDataContainer
): CurrencyDataContainer {
  return objectFromEntries(
    objectEntries(container).map(([id, data]) => {
      return [id, createCurrencyData(data)];
    })
  );
}
