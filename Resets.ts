import Decimal from "break_eternity.js";
import { Player } from "./src/components/PlayerContext";

export function triggerReset() {
  return {
    upgradeLvl: new Decimal(0),
    points: new Decimal(0),
    startedRun: Date.now(),
  };
}

export function triggerTierReset(updates: Player) {
  return {
    tierStartedDate: Date.now(),
    upgradeLvl: new Decimal(0),
    points: new Decimal(0),
    startedRun: Date.now(),
    bestRun: null,
    bestPointsOfRun: new Decimal(0),
    autoresettingEnabled: !updates.boughtThirdTierUpgrade,
    boughtFirstResetUpgrade: updates.boughtFirstTierUpgrade && updates.boughtFirstResetUpgrade,
    boughtSecondResetUpgrade: updates.boughtSecondTierUpgrade && updates.boughtSecondResetUpgrade,
  };
}

export function triggerVermyrosReset(updates: Player) {
  return {
    vermyrosStartedDate: Date.now(),
    upgradeLvl: new Decimal(0),
    points: new Decimal(0),
    startedRun: Date.now(),
    bestRun: null,
    boughtFirstResetUpgrade: updates.boughtSecondVermyrosUpgrade && updates.boughtFirstResetUpgrade,
    boughtSecondResetUpgrade: updates.boughtSecondVermyrosUpgrade && updates.boughtSecondResetUpgrade,
    tier: new Decimal(0),
    autoresettingEnabled: !updates.boughtThirdVermyrosUpgrade,
    bestPointsOfRun: new Decimal(0),
    tierStartedDate: null,
    ampliflux: new Decimal(0),
    amplifluxUpgradeLvl: new Decimal(0),
    boughtFirstTierUpgrade: updates.boughtSecondVermyrosUpgrade && updates.boughtFirstTierUpgrade,
    boughtSecondTierUpgrade: updates.boughtSecondVermyrosUpgrade && updates.boughtSecondTierUpgrade,
    boughtThirdTierUpgrade: updates.boughtThirdVermyrosUpgrade && updates.boughtThirdTierUpgrade,
    boughtFourthTierUpgrade: updates.boughtThirdVermyrosUpgrade && updates.boughtFourthTierUpgrade,
    boughtFifthTierUpgrade: updates.boughtThirdVermyrosUpgrade && updates.boughtFifthTierUpgrade,
    boughtSixthTierUpgrade: updates.boughtThirdVermyrosUpgrade && updates.boughtSixthTierUpgrade,
    autoTierEnabled: updates.boughtSecondVermyrosUpgrade && updates.autoTierEnabled,
  };
}