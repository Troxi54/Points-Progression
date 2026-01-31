import createDecimal from "@/core/utils/decimal";

const nuxarConfig = {
  requirement: createDecimal(1e8),
  nullionLoss: createDecimal(0.75)
} as const;

export default nuxarConfig;
