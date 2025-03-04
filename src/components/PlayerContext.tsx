import { createContext, ReactNode, useState } from "react";

interface PlayerContextType {
  player: Player,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>
}

export const playerContext = createContext<PlayerContextType | undefined>(undefined);

interface Player {
  points: number,
  pointGain: number,
  upgradeLvl: number,
  upgradeCost: number,
  upgradeEffect: number,
  startedRun: number,
  bestRun: number | null,
  runEffect: number,
  everMadeRun: boolean,
  autoresettingEnabled: boolean
}

interface PlayerProviderProps {
  children: ReactNode
}

export const PlayerProvider: React.FC<PlayerProviderProps> = function({ children }) {
  const [player, setPlayer] = useState<Player>({
    points: 0,
    pointGain: 1,
    upgradeLvl: 0,
    upgradeCost: 0,
    upgradeEffect: 1,
    startedRun: Date.now(),
    bestRun: null,
    runEffect: 1,
    everMadeRun: false,
    autoresettingEnabled: true
  });
  
  return (
    <playerContext.Provider value={{ player, setPlayer }}>
      { children }
    </playerContext.Provider>
  );
}

interface Settings {
  localStorageName: string,
  saveInterval: number,
  upgradeStartingCost: number,
  upgradeScaling: number,
  upgradeEffectScaling: number,
  finalGoal: number
}

export const settings: Readonly<Settings> = {
  localStorageName: 'PointsProgression',
  saveInterval: 10000,
  upgradeStartingCost: 10,
  upgradeScaling: 1.2,
  upgradeEffectScaling: 1.125,
  finalGoal: 1e6
};

export function savePlayerToLocalStorage(player: Player) {
  try {
    const encryptedData = btoa(JSON.stringify(player));
    localStorage.setItem(settings.localStorageName, encryptedData);
  } catch (error) {
    console.error("Saving player failed:", error);
  }
}

export function loadPlayerFromLocalStorage(): Player | null {
  try {
    const encryptedData = localStorage.getItem(settings.localStorageName);
    if (!encryptedData) return null;
    return JSON.parse(atob(encryptedData));
  } catch (error) {
    console.error("Loading player failed:", error);
    return null;
  }
}