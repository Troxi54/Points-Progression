import createDecimal from "@/core/utils/decimal";

const amplivaultConfig = {
  requirementStartsAt: createDecimal(1e30),
  requirementScaling: createDecimal(1000)
} as const;

export default amplivaultConfig;
