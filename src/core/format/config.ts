import createDecimal from "@core/utils/decimal";

export const formatConfig = {
  numberUnitsThreshold: createDecimal("1e3"),
  scientificNotationThreshold: createDecimal("1e213"),
  scientificNotationModeThreshold: createDecimal("1e3"),
};
