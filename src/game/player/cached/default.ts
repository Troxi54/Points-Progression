import type { CachedCurrency } from "@game/currencies/cachedData";
import type { CurrencyId } from "@game/currencies/types";
import type { CachedRepeatableUpgrade } from "@game/repeatableUpgrades/cachedData";
import type { RepeatableUpgradeId } from "@game/repeatableUpgrades/ids";
import type { CachedResetLayer } from "@game/resetLayers/cachedData";
import type { ResetLayerId } from "@game/resetLayers/ids";
import type Decimal from "break_eternity.js";
import createDecimal from "@core/utils/decimal";
import { getCurrentTime } from "@core/utils/time";

export function getDefaultCachedPlayer() {
  const currentTime = getCurrentTime();

  return {
    lastSave: 0,
    lastTickSession: currentTime,
    timeSpeed: 1,

    currencies: {} as Record<CurrencyId, CachedCurrency>,
    resetLayers: {} as Partial<Record<ResetLayerId, CachedResetLayer>>,
    resetsAccumulator: 0,
    repeatableUpgrades: {} as Partial<{
      [K in RepeatableUpgradeId]: CachedRepeatableUpgrade;
    }>,
    highestResetDuration: 0,
    gameProgress: createDecimal(0),

    ticksPerSecond: 0,

    offlineProgress: false,
    offlineProgressFullTime: 0,
    offlineProgressTicksOnTrigger: 0,
    offlineProgressTicksCompleted: 0,
    offlineProgressSpeed: 1,
    offlineProgressStartedDate: null as number | null,
    offlineProgressLastTick: currentTime,

    infiniteMode: {
      unlocked: false,
      layerCountToRender: 0,
    },

    runEffect: createDecimal(1),
    runDertointEffect: createDecimal(1),
    bestPointsOfRunEffect: createDecimal(1),
    bestPointsOfRunVermoraEffect: createDecimal(1),
    tierRequirement: createDecimal(Infinity),
    tierEffect: createDecimal(1),
    tierVermyteEffect: createDecimal(1),
    bestVermytesEffect: createDecimal(1),
    bestVermytesPointsEffect: createDecimal(1),
    amplivaultRequirement: createDecimal(Infinity),
    amplivaultEffect: createDecimal(1),
    amplivaultAmplivoidEffect: createDecimal(1),
    softcapperLevel: createDecimal(0),
    nullionInputConverted: createDecimal(0),
    firstDertointUpgradeEffect: createDecimal(1),

    level: createDecimal(0),
    XPForThisLevel: createDecimal(0),
    XPForNextLevel: createDecimal(Infinity),
    levelDertointEffect: createDecimal(1),

    nexusCost: createDecimal(Infinity) as Decimal | null,

    maxXagyrosStates: 0,
  };
}
