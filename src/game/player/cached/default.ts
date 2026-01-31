import createDecimal from "@/core/utils/decimal";
import {
  CachedCurrency,
  CachedPlayer,
  CachedRepeatableUpgrade,
  CachedResetLayer
} from "./types";
import { getCurrentTime } from "@/core/utils/time";

export function getDefaultCachedPlayer(): CachedPlayer {
  const currentTime = getCurrentTime();

  return {
    lastSave: 0,
    lastTickSession: currentTime,
    timeSpeed: 1,

    currencies: {},
    resetLayers: {},
    resetsAccumulator: 0,
    repeatableUpgrades: {},
    highestResetDuration: 0,

    ticksPerSecond: 0,

    offlineProgress: false,
    offlineProgressFullTime: 0,
    offlineProgressTicksCompleted: 0,
    offlineProgressSpeed: 1,
    offlineProgressStartedDate: currentTime,
    offlineProgressLastTick: currentTime,

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
    softcapperLevel: createDecimal(0),
    nullionInputConverted: createDecimal(0),
    firstDertointUpgradeEffect: createDecimal(1),

    level: createDecimal(0),
    XPForThisLevel: createDecimal(0),
    XPForNextLevel: createDecimal(Infinity),
    levelDertointEffect: createDecimal(1),

    nexusCost: createDecimal(Infinity)
  };
}

export function getDefaultCachedRepeatableUpgrade(): CachedRepeatableUpgrade {
  return {
    cost: createDecimal(Infinity),
    effect: createDecimal(1),
    bulk: createDecimal(0),
    maxed: false
  };
}

export function getDefaultCachedResetLayer(): CachedResetLayer {
  return {
    duration: null,
    lastResetDuration: null
  };
}

export function getDefaultCachedCurrencyEffect() {
  return createDecimal(1);
}

export function getDefaultCachedCurrency(): CachedCurrency {
  return {
    gain: createDecimal(0),
    passiveGain: createDecimal(0),
    effect: getDefaultCachedCurrencyEffect()
  };
}
