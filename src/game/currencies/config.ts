import createDecimal from "@/core/utils/decimal";

const currencyConfig = {
  coresAt: createDecimal(1e6),
  darkEnergyGrowthStartsAt: createDecimal(1e250)
} as const;

export default currencyConfig;
