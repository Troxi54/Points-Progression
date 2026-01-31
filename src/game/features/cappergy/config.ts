import createDecimal from "@/core/utils/decimal";

const cappergyConfig = {
  startEarningAt: createDecimal(1e21),
  startsWorkingFrom: createDecimal(1e6)
} as const;

export default cappergyConfig;
