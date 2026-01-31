import createDecimal from "@/core/utils/decimal";

const coreConfig = {
  unlocksAt: createDecimal(1e6)
} as const;

export default coreConfig;
