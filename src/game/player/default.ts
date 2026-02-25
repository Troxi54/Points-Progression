import { Player, ResetLayerPlayerData } from "./types";
import { getCurrentTime } from "@/core/utils/time";
import createDecimal from "@/core/utils/decimal";
import gameConfig from "@/core/config/data";

export function getDefaultPlayer(): Player {
  const currentTime = getCurrentTime();

  const firstResetLayerData = getDefaultResetLayerPlayerData();
  firstResetLayerData.startedDate = currentTime;

  return {
    gameVersion: gameConfig.gameVersion,
    lastTick: currentTime,
    offlineOffset: 0,
    unspentOfflineTime: 0,

    hideBoughtUpgrades: false,
    stableProgressBars: true,
    exponentialNotation: false,
    autosave: true,
    saveBeforeUnload: true,
    offlineProgressWorks: true,
    menuBackgroundBlur: true,

    upgrades: {},
    repeatableUpgrades: {},
    resetLayers: {
      reset: firstResetLayerData,
    },

    dimensionId: "normal",

    points: createDecimal(0),
    bestPoints: createDecimal(0),
    bestRun: null,
    bestPointsOfRun: createDecimal(0),
    tier: createDecimal(0),
    madeTierTimes: createDecimal(0),
    ampliflux: createDecimal(0),

    vermytes: createDecimal(0),
    bestVermytes: createDecimal(0),
    vermora: createDecimal(0),
    enteredAmplivault: false,
    amplivaultLevel: createDecimal(0),
    bestSoftcapperLevel: createDecimal(0),

    energyReactors: createDecimal(0),
    energy: createDecimal(0),
    everReachedCores: false,
    everMadeCoreReset: false,
    cores: createDecimal(0),
    darkEnergy: createDecimal(0),

    madeNullithResets: createDecimal(0),
    reachedBreakAmplivault: false,
    amplivaultBroken: false,
    nullionInput: "",
    nullions: createDecimal(0),
    everEnteredSliph: false,
    dertoints: createDecimal(0),
    mallirtTotalDertoints: createDecimal(0),
    everReachedCappergy: false,
    cappergy: createDecimal(0),

    score: createDecimal(0),
    XP: createDecimal(0),
    nux: createDecimal(0),
    everTriggeredNuxar: false,
    nexusLevel: createDecimal(0),
    bestNexusLevel: createDecimal(0),
    amplivoid: createDecimal(0),
  };
}

export function getDefaultRepeatableUpgradeLevel() {
  return createDecimal(0);
}

export function getDefaultResetLayerPlayerData(): ResetLayerPlayerData {
  return {
    everPerformed: false,
    startedDate: null,
    autoEnabled: true,
    resetsPerSecond: 0,
  };
}

export const requiredPlayerProps = new Set<keyof Player>(["gameVersion"]);
