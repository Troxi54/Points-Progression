import {
  mergeObjects,
  objectEntries,
  objectFromEntries
} from "@/core/utils/object";
import SoftcapperData, {
  PartialSoftcapperData,
  PartialSoftcapperDataContainer,
  SoftcapperDataContainer
} from "../types";
import getDefaultMissingSoftcapperData from "../default";

function createSoftcapperData(
  softcapperData: PartialSoftcapperData
): SoftcapperData {
  return mergeObjects(softcapperData, getDefaultMissingSoftcapperData());
}

export function createSoftcapperDataContainer(
  container: PartialSoftcapperDataContainer
): SoftcapperDataContainer {
  return objectFromEntries(
    objectEntries(container).map(([currency, softcapperData]) => {
      const value = softcapperData?.map((softcapper) =>
        createSoftcapperData(softcapper)
      );
      return [currency, value];
    })
  );
}
