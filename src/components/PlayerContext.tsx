import Decimal from "break_eternity.js";
import React, { ReactNode, useEffect, useState } from "react";
import { getDefaultPlayer, playerContext } from "../playerUtils";

export interface PlayerContextType {
  player: Player,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  playerRef: React.RefObject<Player>
}

export interface Player {
  gameVersion: string,
  lastTick: number,
  points: Decimal,
  pointGain: Decimal,
  upgradeLvl: Decimal,
  upgradeCost: Decimal,
  upgradeEffect: Decimal,
  upgradeBulk: Decimal,
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
  approximateTiersPerSecond: Decimal,
  tierRequirement: Decimal,
  autoTierEnabled: boolean,
  tierEffect: Decimal,
  tierTimesEffect: Decimal,
  boughtFirstTierUpgrade: boolean,
  boughtSecondTierUpgrade: boolean,
  boughtThirdTierUpgrade: boolean,
  boughtFourthTierUpgrade: boolean,
  tierStartedDate: number | null,
  ampliflux: Decimal,
  amplifluxGain: Decimal,
  amplifluxEffect: Decimal,
  amplifluxUpgradeLvl: Decimal,
  amplifluxUpgradeCost: Decimal,
  amplifluxUpgradeEffect: Decimal,
  amplifluxUpgradeBulk: Decimal,
  boughtFifthTierUpgrade: boolean,
  boughtSixthTierUpgrade: boolean,
  everMadeVermyros: boolean,
  vermyrosStartedDate: number | null,
  autoVermyrosEnabled: boolean,
  vermytes: Decimal,
  vermytesGain: Decimal,
  bestVermytes: Decimal,
  vermytesBestEffect: Decimal,
  vermytesUpgradeLvl: Decimal,
  vermytesUpgradeCost: Decimal,
  vermytesUpgradeEffect: Decimal,
  vermytesUpgradeBulk: Decimal,
  vermora: Decimal,
  vermoraGain: Decimal,
  vermoraEffect: Decimal,
  boughtFirstVermyrosUpgrade: boolean,
  boughtSecondVermyrosUpgrade: boolean,
  boughtThirdVermyrosUpgrade: boolean,
  boughtFourthVermyrosUpgrade: boolean,
  vermytesPerSecond: Decimal,
  boughtFifthVermyrosUpgrade: boolean,
  boughtSixthVermyrosUpgrade: boolean,
  boughtSeventhVermyrosUpgrade: boolean,
  boughtEighthVermyrosUpgrade: boolean,
  enteredAmplivault: boolean,
  amplivaultLevel: Decimal,
  amplivaultRequirement: Decimal,
  amplivaultEffect: Decimal,
  softcapperLevel: Decimal,
  bestSoftcapperLevel: Decimal
}

interface PlayerProviderProps {
  children: ReactNode
}

export const PlayerProvider: React.FC<PlayerProviderProps> = function({ children }) {
  const [player, setPlayer] = useState<Player>(getDefaultPlayer());
  const playerRef = React.useRef<Player>(player);
  
  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  return (
    <playerContext.Provider value={{ player, setPlayer, playerRef }}>
      { children }
    </playerContext.Provider>
  );
}

export interface Settings {
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
  amplifluxUpgradeStartingCost: Decimal,
  amplifluxUpgradeCostScaling: Decimal,
  amplifluxUpgradeEffectScaling: Decimal,
  fifthTierUpgradeCost: Decimal,
  sixthTierUpgradeCost: Decimal,
  vermyrosGoal: Decimal,
  vermytesUpgradeStartingCost: Decimal,
  vermytesUpgradeCostScaling: Decimal,
  vermytesUpgradeEffectScaling: Decimal,
  firstVermyrosUpgradeCost: Decimal,
  secondVermyrosUpgradeCost: Decimal,
  thirdVermyrosUpgradeCost: Decimal,
  fourthVermyrosUpgradeCost: Decimal,
  fifthVermyrosUpgradeCost: Decimal,
  sixthVermyrosUpgradeCost: Decimal,
  seventhVermyrosUpgradeCost: Decimal,
  eighthVermyrosUpgradeCost: Decimal,
  amplivaultRequirementStartsAt: Decimal,
  firstSoftcapperLevelAt: Decimal,
  firstSoftcapperLevelPower: Decimal
}