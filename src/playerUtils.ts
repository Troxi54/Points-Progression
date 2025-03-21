import { createContext } from "react";
import { Player, PlayerContextType, Settings } from "./components/PlayerContext";
import Decimal from "break_eternity.js";

export const playerContext = createContext<PlayerContextType | undefined>(undefined);

export function getDefaultPlayer(): Player {
  const defaultPlayer: Player = {
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
    boughtFourthVermyrosUpgrade: false
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
    for (const property in merged) {
      if (getDefaultPlayer()[property as keyof Player] instanceof Decimal)
        merged[property] = new Decimal(merged[property]);
    }
    if (merged.bestRun !== null && merged.bestRun < 10) merged.bestRun = 10;
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
  fourthVermyrosUpgradeCost: new Decimal(1e114)
};