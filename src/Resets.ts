import Decimal from "break_eternity.js";
import { Player } from "./player/playerTypes";

export function triggerReset(): Partial<Player> {
  return {
    upgradeLvl: new Decimal(0),
    points: new Decimal(0),
    startedRun: Date.now()
  };
}

export function triggerTierReset(player: Player): Partial<Player> {
  return {
    tierStartedDate: Date.now(),
    upgradeLvl: new Decimal(0),
    points: new Decimal(0),
    startedRun: Date.now(),
    bestRun: player.boughtThirdTierUpgrade ? player.bestRun : null,
    bestPointsOfRun: new Decimal(0),
    autoresettingEnabled: !player.boughtThirdTierUpgrade,
    boughtFirstResetUpgrade:
      player.boughtFirstTierUpgrade && player.boughtFirstResetUpgrade,
    boughtSecondResetUpgrade:
      player.boughtSecondTierUpgrade && player.boughtSecondResetUpgrade
  };
}

export function triggerVermyrosReset(player: Player): Partial<Player> {
  return {
    vermyrosStartedDate: Date.now(),
    upgradeLvl: new Decimal(0),
    points: new Decimal(0),
    startedRun: Date.now(),
    bestRun: null,
    boughtFirstResetUpgrade:
      player.boughtSecondVermyrosUpgrade && player.boughtFirstResetUpgrade,
    boughtSecondResetUpgrade:
      player.boughtSecondVermyrosUpgrade && player.boughtSecondResetUpgrade,
    tier: new Decimal(0),
    autoresettingEnabled: !player.boughtThirdVermyrosUpgrade,
    bestPointsOfRun: new Decimal(0),
    tierStartedDate: null,
    ampliflux: new Decimal(0),
    amplifluxUpgradeLvl: new Decimal(0),
    boughtFirstTierUpgrade:
      player.boughtSecondVermyrosUpgrade && player.boughtFirstTierUpgrade,
    boughtSecondTierUpgrade:
      player.boughtSecondVermyrosUpgrade && player.boughtSecondTierUpgrade,
    boughtThirdTierUpgrade:
      player.boughtThirdVermyrosUpgrade && player.boughtThirdTierUpgrade,
    boughtFourthTierUpgrade:
      player.boughtThirdVermyrosUpgrade && player.boughtFourthTierUpgrade,
    boughtFifthTierUpgrade:
      player.boughtThirdVermyrosUpgrade && player.boughtFifthTierUpgrade,
    boughtSixthTierUpgrade:
      player.boughtThirdVermyrosUpgrade && player.boughtSixthTierUpgrade,
    autoTierEnabled:
      player.boughtSecondVermyrosUpgrade && player.autoTierEnabled
  };
}

export function triggerNullithReset(player: Player): Partial<Player> {
  const result = { nullithStartedDate: Date.now() };

  if (player.boughtFifthNullithUpgrade) return result;

  return {
    ...result,
    vermyrosStartedDate: Date.now(),
    upgradeLvl: new Decimal(0),
    points: new Decimal(0),
    startedRun: Date.now(),
    bestRun: null,
    boughtFirstResetUpgrade:
      player.boughtSecondNullithUpgrade && player.boughtFirstResetUpgrade,
    boughtSecondResetUpgrade:
      player.boughtSecondNullithUpgrade && player.boughtSecondResetUpgrade,
    tier: new Decimal(0),
    autoresettingEnabled: !player.boughtThirdVermyrosUpgrade,
    bestPointsOfRun: new Decimal(0),
    tierStartedDate: null,
    ampliflux: new Decimal(0),
    amplifluxUpgradeLvl: new Decimal(0),
    boughtFirstTierUpgrade:
      player.boughtSecondNullithUpgrade && player.boughtFirstTierUpgrade,
    boughtSecondTierUpgrade:
      player.boughtSecondNullithUpgrade && player.boughtSecondTierUpgrade,
    boughtThirdTierUpgrade:
      player.boughtSecondNullithUpgrade && player.boughtThirdTierUpgrade,
    boughtFourthTierUpgrade:
      player.boughtSecondNullithUpgrade && player.boughtFourthTierUpgrade,
    boughtFifthTierUpgrade:
      player.boughtSecondNullithUpgrade && player.boughtFifthTierUpgrade,
    boughtSixthTierUpgrade:
      player.boughtSecondNullithUpgrade && player.boughtSixthTierUpgrade,
    autoTierEnabled:
      player.boughtSecondVermyrosUpgrade && player.autoTierEnabled,
    autoVermyrosEnabled: true,
    vermytes: new Decimal(0),
    bestVermytes: new Decimal(0),
    vermora: new Decimal(0),
    vermytesUpgradeLvl: new Decimal(0),
    enteredAmplivault: false,
    amplivaultLevel: player.boughtThirdNullithUpgrade
      ? player.amplivaultLevel
      : new Decimal(0),
    energyReactors: new Decimal(0),
    energy: new Decimal(0),
    cores: new Decimal(0),
    coreUpgradeLvl: new Decimal(0),
    boughtFirstVermyrosUpgrade:
      player.boughtSecondNullithUpgrade && player.boughtFirstVermyrosUpgrade,
    boughtSecondVermyrosUpgrade:
      player.boughtSecondNullithUpgrade && player.boughtSecondVermyrosUpgrade,
    boughtThirdVermyrosUpgrade:
      player.boughtSecondNullithUpgrade && player.boughtThirdVermyrosUpgrade,
    boughtFourthVermyrosUpgrade:
      player.boughtSecondNullithUpgrade && player.boughtFourthVermyrosUpgrade,
    boughtFifthVermyrosUpgrade:
      player.boughtThirdNullithUpgrade && player.boughtFifthVermyrosUpgrade,
    boughtSixthVermyrosUpgrade:
      player.boughtThirdNullithUpgrade && player.boughtSixthVermyrosUpgrade,
    boughtSeventhVermyrosUpgrade:
      player.boughtThirdNullithUpgrade && player.boughtSeventhVermyrosUpgrade,
    boughtEighthVermyrosUpgrade:
      player.boughtThirdNullithUpgrade && player.boughtEighthVermyrosUpgrade,
    boughtNinthVermyrosUpgrade:
      player.boughtFourthNullithUpgrade && player.boughtNinthVermyrosUpgrade,
    boughtTenthVermyrosUpgrade:
      player.boughtFourthNullithUpgrade && player.boughtTenthVermyrosUpgrade,
    reachedBreakAmplivault:
      player.reachedBreakAmplivault || player.enteredAmplivault
  };
}

export function triggerMallirtReset(player: Player): Partial<Player> {
  return {
    dertointUpgradeLvl: new Decimal(0),
    dertoints: new Decimal(0),
    mallirtStartedDate: Date.now(),
    boughtFirstDertointUpgrade: player.boughtFirstMallirtUpgrade,
    boughtSecondDertointUpgrade: player.boughtFirstMallirtUpgrade,
    boughtThirdDertointUpgrade: player.boughtSecondMallirtUpgrade,
    boughtFourthDertointUpgrade: player.boughtSecondMallirtUpgrade
  };
}
