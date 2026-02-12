import { getCurrencyEffectFor } from "@/game/currencies/utils/get";
import { createSoftcapperDataContainer } from "./utils/create";
import createDecimal from "@/core/utils/decimal";
import cappergyConfig from "@/game/features/cappergy/config";

const softcapperData = createSoftcapperDataContainer({
  points: [
    {
      startsAt: createDecimal("1e204"),
      power: createDecimal(0.94),
    },
    {
      startsAt: createDecimal("1e368"),
      power: createDecimal(0.85),
    },
    {
      startsAt: createDecimal("1e1000"),
      power: createDecimal(0.5),
    },
    {
      startsAt: createDecimal("1e2500"),
      power: createDecimal(0.5),
    },
    {
      startsAt: createDecimal("1e4025"),
      power: createDecimal(0.4),
    },
  ],
  dertoints: [
    {
      startsAt: createDecimal(cappergyConfig.startsWorkingFrom),
      power: ({ cachedPlayer }) => {
        return getCurrencyEffectFor(cachedPlayer, "cappergy", "dertoints");
      },
    },
  ],
} as const);

export default softcapperData;
