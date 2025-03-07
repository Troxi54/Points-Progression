import Decimal from "break_eternity.js";
import { createContext, ReactNode, useState } from "react";

interface PlayerContextType {
  player: Player,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>
}

export const playerContext = createContext<PlayerContextType | undefined>(undefined);

export interface Player {
  points: Decimal,
  pointGain: Decimal,
  upgradeLvl: Decimal,
  upgradeCost: Decimal,
  upgradeEffect: Decimal,
  startedRun: number,
  bestRun: number | null,
  runEffect: Decimal,
  everMadeRun: boolean,
  autoresettingEnabled: boolean,
  bestPointsOfRun: Decimal,
  bestPointsOfRunEffect: Decimal,
  boughtFirstResetUpgrade: boolean,
  boughtSecondResetUpgrade: boolean,
  everMadeTier: boolean,
  tier: Decimal,
  madeTierTimes: Decimal,
  tierRequirement: Decimal,
  autoTierEnabled: boolean,
  tierEffect: Decimal,
  tierTimesEffect: Decimal,
  boughtFirstTierUpgrade: boolean,
  boughtSecondTierUpgrade: boolean,
  boughtThirdTierUpgrade: boolean,
  boughtFourthTierUpgrade: boolean,
  tierStartedDate: number | null
}

interface PlayerProviderProps {
  children: ReactNode
}

function getDefaultPlayer(): Player {
  const defaultPlayer: Player = {
    points: new Decimal(0),
    pointGain: new Decimal(1),
    upgradeLvl: new Decimal(0),
    upgradeCost: new Decimal(0),
    upgradeEffect: new Decimal(1),
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
    tierStartedDate: null
  }
  return defaultPlayer;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = function({ children }) {
  const [player, setPlayer] = useState<Player>(getDefaultPlayer());
  
  return (
    <playerContext.Provider value={{ player, setPlayer }}>
      { children }
    </playerContext.Provider>
  );
}

interface Settings {
  localStorageName: string,
  saveInterval: number,
  upgradeStartingCost: Decimal,
  upgradeScaling: Decimal,
  upgradeEffectScaling: Decimal,
  finalGoal: Decimal,
  resetFirstUpgradeCost: Decimal,
  resetSecondUpgradeCost: Decimal,
  firstTierAt: Decimal,
  tierScaling: Decimal,
  firstTierUpgradeCost: Decimal,
  secondTierUpgradeCost: Decimal,
  thirdTierUpgradeCost: Decimal,
  fourthTierUpgradeCost: Decimal,
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
  fourthTierUpgradeCost: new Decimal(1e62)
};

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
    for (let property in merged) {
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