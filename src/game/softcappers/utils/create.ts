import type {
  PartialSoftcapperConfig,
  PartialSoftcapperContainerConfig,
  SoftcapperContainerConfig,
} from "../types";
import type SoftcapperConfig from "../types";
import {
  mergeObjects,
  objectEntries,
  objectFromEntries,
} from "@core/utils/object";
import getDefaultMissingSoftcapperConfig from "../default";

function createSoftcapperConfig(
  softcapperConfig: PartialSoftcapperConfig,
): SoftcapperConfig {
  return mergeObjects(softcapperConfig, getDefaultMissingSoftcapperConfig());
}

export function createSoftcapperContainerConfig(
  container: PartialSoftcapperContainerConfig,
): SoftcapperContainerConfig {
  return objectFromEntries(
    objectEntries(container).map(([currency, softcapperConfig]) => {
      const value = softcapperConfig?.map((softcapper) =>
        createSoftcapperConfig(softcapper),
      );
      return [currency, value];
    }),
  );
}
