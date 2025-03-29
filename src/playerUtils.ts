import { createContext } from "react";
import { Player, PlayerContextType, Settings } from "./components/PlayerContext";
import Decimal from "break_eternity.js";

export const playerContext = createContext<PlayerContextType | undefined>(undefined);

export function getDefaultPlayer(): Player {
  const defaultPlayer: Player = {
    gameVersion: '0.1.2',
    lastTick: Date.now(),
    points: new Decimal(0),
    pointGain: new Decimal(1),
    upgradeLvl: new Decimal(0),
    upgradeCost: new Decimal(0),
    upgradeEffect: new Decimal(1),
    upgradeBulk: new Decimal(0),
    startedRun: Date.now(),
    bestRun: null,
    runEffect: new Decimal(1),
    everMadeRun: false,
    autoresettingEnabled: true,
    bestPointsOfRun: new Decimal(0),
    bestPointsOfRunEffect: new Decimal(1),
    boughtFirstResetUpgrade: false,
    boughtSecondResetUpgrade: false,
    everMadeTier: false,
    tier: new Decimal(0),
    madeTierTimes: new Decimal(0),
    approximateTiersPerSecond: new Decimal(0),
    tierRequirement: new Decimal(Infinity),
    autoTierEnabled: true,
    tierEffect: new Decimal(1),
    tierTimesEffect: new Decimal(1),
    boughtFirstTierUpgrade: false,
    boughtSecondTierUpgrade: false,
    boughtThirdTierUpgrade: false,
    boughtFourthTierUpgrade: false,
    tierStartedDate: null,
    ampliflux: new Decimal(0),
    amplifluxGain: new Decimal(1),
    amplifluxEffect: new Decimal(1),
    amplifluxUpgradeLvl: new Decimal(0),
    amplifluxUpgradeCost: new Decimal(0),
    amplifluxUpgradeEffect: new Decimal(1),
    amplifluxUpgradeBulk: new Decimal(0),
    boughtFifthTierUpgrade: false,
    boughtSixthTierUpgrade: false,
    everMadeVermyros: false,
    vermyrosStartedDate: null,
    autoVermyrosEnabled: true,
    vermytes: new Decimal(0),
    vermytesGain: new Decimal(0),
    bestVermytes: new Decimal(0),
    vermytesBestEffect: new Decimal(1),
    vermytesUpgradeLvl: new Decimal(0),
    vermytesUpgradeCost: new Decimal(0),
    vermytesUpgradeEffect: new Decimal(1),
    vermytesUpgradeBulk: new Decimal(0),
    vermora: new Decimal(0),
    vermoraGain: new Decimal(0),
    vermoraEffect: new Decimal(1),
    boughtFirstVermyrosUpgrade: false,
    boughtSecondVermyrosUpgrade: false,
    boughtThirdVermyrosUpgrade: false,
    boughtFourthVermyrosUpgrade: false,
    vermytesPerSecond: new Decimal(0),
    boughtFifthVermyrosUpgrade: false,
    boughtSixthVermyrosUpgrade: false,
    boughtSeventhVermyrosUpgrade: false,
    boughtEighthVermyrosUpgrade: false,
    enteredAmplivault: false,
    amplivaultLevel: new Decimal(0),
    amplivaultRequirement: new Decimal(Infinity),
    amplivaultEffect: new Decimal(1),
    softcapperLevel: new Decimal(0),
    bestSoftcapperLevel: new Decimal(0)
  }
  return defaultPlayer;
}

export function getConvertedPlayerData(player: Player): string {
  return btoa(JSON.stringify(player));
}

export function savePlayerToLocalStorage(player: Player) {
  try {
    const encryptedData = getConvertedPlayerData(player);
    localStorage.setItem(settings.localStorageName, encryptedData);
  } catch (error) {
    console.error("Saving player failed:", error);
  }
}

export function loadPlayer(savedData: string): Player {
  if (!savedData) {
    return getDefaultPlayer();
  }
  try {
    const parsedData = JSON.parse(atob(savedData));
    const merged = { ...getDefaultPlayer(), ...parsedData };
    const ANTI_NEGATIVE = true;
    for (const property in merged) {
      if (getDefaultPlayer()[property as keyof Player] instanceof Decimal)
        merged[property] = new Decimal(merged[property]);
      if (merged[property] instanceof Decimal) {
        if (merged[property].isNan()) merged[property] = new Decimal(0);
        if (merged[property].lessThan(0) && ANTI_NEGATIVE) merged[property] = new Decimal(0);
      }
    }
    if (merged.bestRun !== null && merged.bestRun < 10) merged.bestRun = 10;
    if (merged.bestVermytes.lessThanOrEqualTo(0) && merged.everMadeVermyros) {
      merged.everMadeVermyros = false;
      merged.vermyrosStartedDate = null;
    }
    if (!merged.everMadeVermyros && merged.tier.lessThanOrEqualTo(0) && merged.everMadeTier) {
      merged.everMadeTier = false;
      merged.tierStartedDate = null;
    }
    if (!merged.everMadeTier && !merged.autoTierEnabled) merged.autoTierEnabled = true;
    if (!merged.everMadeVermyros && !merged.autoVermyrosEnabled) merged.autoVermyrosEnabled = true;
    if (Date.now() - merged.startedRun < 0) merged.startedRun = Date.now();
    if (merged.tierStartedDate !== null && Date.now() - merged.tierStartedDate < 0) merged.tierStartedDate = Date.now();
    if (merged.vermyrosStartedDate !== null && Date.now() - merged.vermyrosStartedDate < 0) merged.vermyrosStartedDate = Date.now();

    return merged;
  } catch (error) {
    console.error("Error loading player data:", error);
    return getDefaultPlayer();
  }
}

export function loadPlayerFromLocalStorage(): Player {
  const savedData = localStorage.getItem(settings.localStorageName);
  if (!savedData) {
    return getDefaultPlayer();
  }
  return loadPlayer(savedData);
}

export const settings: Readonly<Settings> = {
  localStorageName: 'PointsProgression',
  saveInterval: 10000,
  upgradeStartingCost: new Decimal(10),
  upgradeScaling: new Decimal(1.2),
  upgradeEffectScaling: new Decimal(1.125),
  finalGoal: new Decimal(1e6),
  resetFirstUpgradeCost: new Decimal(1e20),
  resetSecondUpgradeCost: new Decimal(1e23),
  firstTierAt: new Decimal(1e25),
  tierScaling: new Decimal(1000),
  firstTierUpgradeCost: new Decimal(1e27),
  secondTierUpgradeCost: new Decimal(1e32),
  thirdTierUpgradeCost: new Decimal(1e40),
  fourthTierUpgradeCost: new Decimal(1e62),
  amplifluxUpgradeStartingCost: new Decimal(10),
  amplifluxUpgradeCostScaling: new Decimal(1.15),
  amplifluxUpgradeEffectScaling: new Decimal(1.1),
  fifthTierUpgradeCost: new Decimal(1e74),
  sixthTierUpgradeCost: new Decimal(1e82),
  vermyrosGoal: new Decimal(1e84),
  vermytesUpgradeStartingCost: new Decimal(1),
  vermytesUpgradeCostScaling: new Decimal(2),
  vermytesUpgradeEffectScaling: new Decimal(3),
  firstVermyrosUpgradeCost: new Decimal(1),
  secondVermyrosUpgradeCost: new Decimal(1e90),
  thirdVermyrosUpgradeCost: new Decimal(1e96),
  fourthVermyrosUpgradeCost: new Decimal(1e114),
  fifthVermyrosUpgradeCost: new Decimal(1e133),
  sixthVermyrosUpgradeCost: new Decimal(1e162),
  seventhVermyrosUpgradeCost: new Decimal(1e186),
  eighthVermyrosUpgradeCost: new Decimal(1e212),
  amplivaultRequirementStartsAt: new Decimal(1e30),
  firstSoftcapperLevelAt: new Decimal(1e204),
  firstSoftcapperLevelPower: new Decimal(0.9)
};