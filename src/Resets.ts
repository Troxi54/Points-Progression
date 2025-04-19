import Decimal from "break_eternity.js";
import { Player } from "../src/components/PlayerContext";

export function triggerReset() {
  return {
    upgradeLvl: new Decimal(0),
    points: new Decimal(0),
    startedRun: Date.now(),
  };
}

export function triggerTierReset(updates: Player): Partial<Player> {
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

export function triggerVermyrosReset(updates: Player): Partial<Player> {
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

export function triggerNullithReset(updates: Player): Partial<Player> {
  return {
    nullithStartedDate: Date.now(),
    vermyrosStartedDate: Date.now(),
    upgradeLvl: new Decimal(0),
    points: new Decimal(0),
    startedRun: Date.now(),
    bestRun: null,
    boughtFirstResetUpgrade: updates.boughtSecondNullithUpgrade && updates.boughtFirstResetUpgrade,
    boughtSecondResetUpgrade: updates.boughtSecondNullithUpgrade && updates.boughtSecondResetUpgrade,
    tier: new Decimal(0),
    autoresettingEnabled: !updates.boughtThirdVermyrosUpgrade,
    bestPointsOfRun: new Decimal(0),
    tierStartedDate: null,
    ampliflux: new Decimal(0),
    amplifluxUpgradeLvl: new Decimal(0),
    boughtFirstTierUpgrade: updates.boughtSecondNullithUpgrade && updates.boughtFirstTierUpgrade,
    boughtSecondTierUpgrade: updates.boughtSecondNullithUpgrade && updates.boughtSecondTierUpgrade,
    boughtThirdTierUpgrade: updates.boughtSecondNullithUpgrade && updates.boughtThirdTierUpgrade,
    boughtFourthTierUpgrade: updates.boughtSecondNullithUpgrade && updates.boughtFourthTierUpgrade,
    boughtFifthTierUpgrade: updates.boughtSecondNullithUpgrade && updates.boughtFifthTierUpgrade,
    boughtSixthTierUpgrade: updates.boughtSecondNullithUpgrade && updates.boughtSixthTierUpgrade,
    autoTierEnabled: updates.boughtSecondVermyrosUpgrade && updates.autoTierEnabled,
    autoVermyrosEnabled: true,
    vermytes: new Decimal(0),
    bestVermytes: new Decimal(0),
    vermora: new Decimal(0),
    vermytesUpgradeLvl: new Decimal(0),
    enteredAmplivault: false,
    amplivaultLevel: updates.boughtThirdNullithUpgrade ? updates.amplivaultLevel : new Decimal(0),
    energyReactors: new Decimal(0),
    energy: new Decimal(0),
    cores: new Decimal(0),
    coreUpgradeLvl: new Decimal(0),
    boughtFirstVermyrosUpgrade: updates.boughtSecondNullithUpgrade && updates.boughtFirstVermyrosUpgrade,
    boughtSecondVermyrosUpgrade: updates.boughtSecondNullithUpgrade && updates.boughtSecondVermyrosUpgrade,
    boughtThirdVermyrosUpgrade: updates.boughtSecondNullithUpgrade && updates.boughtThirdVermyrosUpgrade,
    boughtFourthVermyrosUpgrade: updates.boughtSecondNullithUpgrade && updates.boughtFourthVermyrosUpgrade,
    boughtFifthVermyrosUpgrade: updates.boughtThirdNullithUpgrade && updates.boughtFifthVermyrosUpgrade,
    boughtSixthVermyrosUpgrade: updates.boughtThirdNullithUpgrade && updates.boughtSixthVermyrosUpgrade,
    boughtSeventhVermyrosUpgrade: updates.boughtThirdNullithUpgrade && updates.boughtSeventhVermyrosUpgrade,
    boughtEighthVermyrosUpgrade: updates.boughtThirdNullithUpgrade && updates.boughtEighthVermyrosUpgrade,
    boughtNinthVermyrosUpgrade: updates.boughtFourthNullithUpgrade && updates.boughtNinthVermyrosUpgrade,
    boughtTenthVermyrosUpgrade: updates.boughtFourthNullithUpgrade && updates.boughtTenthVermyrosUpgrade
  };
}