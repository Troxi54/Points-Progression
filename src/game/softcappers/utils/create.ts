import type {
  PartialSoftcapperData,
  PartialSoftcapperDataContainer,
  SoftcapperDataContainer,
} from "../types";
import type SoftcapperData from "../types";
import {
  mergeObjects,
  objectEntries,
  objectFromEntries,
} from "@core/utils/object";
import getDefaultMissingSoftcapperData from "../default";

function createSoftcapperData(
  softcapperData: PartialSoftcapperData,
): SoftcapperData {
  return mergeObjects(softcapperData, getDefaultMissingSoftcapperData());
}

export function createSoftcapperDataContainer(
  container: PartialSoftcapperDataContainer,
): SoftcapperDataContainer {
  return objectFromEntries(
    objectEntries(container).map(([currency, softcapperData]) => {
      const value = softcapperData?.map((softcapper) =>
        createSoftcapperData(softcapper),
      );
      return [currency, value];
    }),
  );
}
