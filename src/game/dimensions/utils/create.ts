import {
  mergeObjects,
  objectEntries,
  objectFromEntries
} from "@/core/utils/object";
import getDefaultDimensionData from "../default";
import {
  DimensionContainer,
  DimensionData,
  PartialDimensionContainer,
  PartialDimensionData
} from "../types";

function createDimensionData(
  dimensionData?: PartialDimensionData
): DimensionData | undefined {
  if (!dimensionData) return;

  const defaultData = getDefaultDimensionData();
  const newData = mergeObjects(defaultData, dimensionData);

  return newData;
}

export function createDimensionContainer(
  container: PartialDimensionContainer
): DimensionContainer {
  return objectFromEntries(
    objectEntries(container).map(([key, data]) => [
      key,
      createDimensionData(data)
    ])
  );
}
