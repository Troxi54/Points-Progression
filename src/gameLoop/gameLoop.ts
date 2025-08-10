import Decimal from "break_eternity.js";
import { formulas } from "../formulas";
import { usePlayerStore } from "../player/playerStore";
import {
  generateCores,
  generateTierResets,
  generateVermytes,
  getGoalUpdates,
  getMallirtUpdates,
  getNullithUpdates,
  getTierUpdates,
  getVermyrosUpdates
} from "./gameLoopParts";
import { settings } from "../player/settings";
import { mergePlayer, savePlayerToLocalStorage } from "../player/playerUtils";
import { checkElapsedTime, getTimeSince } from "../utils";
import { cacheUpdates } from "./cacheUpdates";
import { calculateOfflineProgress } from "../offline";
import {
  automateAmplifluxUpgrade,
  automateCoreUpgrade,
  automateDertointpgrade,
  automateUpgrade,
  automateVermyteUpgrade
} from "../upgrades";
import { CachedPlayer, Player } from "../player/playerTypes";

export function startGameLoop() {
  let lastSave = 0;
  function loop() {
    const now = Date.now();

    const { getState } = usePlayerStore;
    const state = getState();
    const { setPlayer, setCachedPlayer } = state;

    const newPlayer: Player = { ...state.player };
    const newCachedPlayer: CachedPlayer = { ...state.cachedPlayer };

    const deltaTime = Math.max((now - newPlayer.lastTick) / 1000, 0);
    newPlayer.lastTick = now;

    const mergedPlayer = mergePlayer(newPlayer, newCachedPlayer);

    const mallirtUpdates = getMallirtUpdates(newPlayer);
    Object.assign(newPlayer, mallirtUpdates?.player);
    Object.assign(newCachedPlayer, mallirtUpdates?.cachedPlayer);

    if (
      checkElapsedTime(newCachedPlayer.lastMallirtTime) &&
      newPlayer.autoMallirtEnabled
    ) {
      newPlayer.approximateMallirtResetsPerSecond = new Decimal(
        1000 / newCachedPlayer.lastMallirtTime
      );
    } else {
      newPlayer.approximateMallirtResetsPerSecond = new Decimal(0);
    }

    cacheUpdates.mallirtEffect(mergedPlayer);

    cacheUpdates.firstDertointUpgradeEffect(mergedPlayer);

    cacheUpdates.dertointGain(mergedPlayer);
    newPlayer.dertoints = newPlayer.dertoints.plus(
      newCachedPlayer.dertointGain.multiply(deltaTime)
    );

    cacheUpdates.dertointEffect(mergedPlayer);

    cacheUpdates.nullionInput(mergedPlayer);
    cacheUpdates.nullionGain(mergedPlayer);
    cacheUpdates.nullionEffect(mergedPlayer);

    const nullithUpdates = getNullithUpdates(mergedPlayer);
    Object.assign(newPlayer, nullithUpdates?.player);
    Object.assign(newCachedPlayer, nullithUpdates?.cachedPlayer);

    if (
      checkElapsedTime(newCachedPlayer.lastNullithTime) &&
      newPlayer.autoNullithEnabled
    ) {
      newPlayer.approximateNullithResetsPerSecond = new Decimal(
        1000 / newCachedPlayer.lastNullithTime
      );
    } else {
      newPlayer.approximateNullithResetsPerSecond = new Decimal(0);
    }

    cacheUpdates.nullithResetGain(mergedPlayer);

    cacheUpdates.nullithEffect(mergedPlayer);

    cacheUpdates.darkEnergyGain(mergedPlayer);
    newPlayer.darkEnergy = newPlayer.darkEnergy.plus(
      newCachedPlayer.darkEnergyGain.multiply(deltaTime)
    );

    cacheUpdates.darkEnergyEffect(mergedPlayer);

    cacheUpdates.coreEffect(mergedPlayer);

    cacheUpdates.energyReactorGain(mergedPlayer);
    newPlayer.energyReactors = newPlayer.energyReactors.plus(
      newCachedPlayer.energyReactorGain.multiply(deltaTime)
    );

    cacheUpdates.energyGain(mergedPlayer);
    newPlayer.energy = newPlayer.energy.plus(
      newCachedPlayer.energyGain.multiply(deltaTime)
    );

    cacheUpdates.energyEffect(mergedPlayer);

    if (newPlayer.energy.greaterThanOrEqualTo(settings.coresAt))
      newPlayer.everReachedCores = true;

    cacheUpdates.core(mergedPlayer);
    cacheUpdates.coreGeneration(mergedPlayer);
    if (
      newPlayer.coreUpgradeLvl.greaterThanOrEqualTo(
        settings.maxCoreUpgradeLevel
      )
    ) {
      newPlayer.coreUpgradeLvl = settings.maxCoreUpgradeLevel;
    }

    Object.assign(newPlayer, generateCores(mergedPlayer, deltaTime));

    if (newPlayer.boughtEighthVermyrosUpgrade)
      newPlayer.autoVermyrosEnabled = false;

    if (
      (newPlayer.enteredAmplivault || newPlayer.amplivaultBroken) &&
      newPlayer.points.greaterThanOrEqualTo(
        newCachedPlayer.amplivaultRequirement
      )
    ) {
      const bulk = formulas.getAmplivaultBulk(newPlayer, newCachedPlayer);
      newPlayer.amplivaultLevel = newPlayer.amplivaultLevel.plus(bulk);
    }

    cacheUpdates.amplivault(mergedPlayer);

    if (newPlayer.amplivaultBroken && newPlayer.enteredAmplivault) {
      newPlayer.enteredAmplivault = false;
    }

    cacheUpdates.vermyteGain(mergedPlayer);
    cacheUpdates.vermyteGeneration(mergedPlayer);

    if (newPlayer.boughtEighthVermyrosUpgrade)
      newPlayer.bestVermytes = newCachedPlayer.vermytesGain.greaterThan(
        newPlayer.bestVermytes
      )
        ? newCachedPlayer.vermytesGain
        : newPlayer.bestVermytes;

    const vermyrosUpdates = getVermyrosUpdates(mergedPlayer);
    Object.assign(newPlayer, vermyrosUpdates?.player);
    Object.assign(newCachedPlayer, vermyrosUpdates?.cachedPlayer);

    if (
      checkElapsedTime(newCachedPlayer.lastVermyrosTime) &&
      newPlayer.autoVermyrosEnabled
    ) {
      newPlayer.approximateVermyrosResetsPerSecond = new Decimal(
        1000 / newCachedPlayer.lastVermyrosTime
      );
    } else {
      newPlayer.approximateVermyrosResetsPerSecond = new Decimal(0);
    }

    cacheUpdates.vermytesBestEffect(mergedPlayer);

    Object.assign(newPlayer, generateVermytes(mergedPlayer, deltaTime));

    cacheUpdates.vermoraGain(mergedPlayer);
    newPlayer.vermora = newPlayer.vermora.plus(
      newCachedPlayer.vermoraGain.multiply(deltaTime)
    );

    cacheUpdates.vermoraEffect(mergedPlayer);

    const tierUpdates = getTierUpdates(mergedPlayer);
    Object.assign(newPlayer, tierUpdates?.player);
    Object.assign(newCachedPlayer, tierUpdates?.cachedPlayer);

    cacheUpdates.tierResetGain(mergedPlayer);
    cacheUpdates.tier(mergedPlayer);

    if (
      checkElapsedTime(newCachedPlayer.lastTierTime) &&
      newPlayer.autoTierEnabled
    ) {
      newPlayer.approximateTiersPerSecond = new Decimal(
        1000 / newCachedPlayer.lastTierTime
      );
    } else {
      newPlayer.approximateTiersPerSecond = new Decimal(0);
    }

    const automatedUpgrade = automateUpgrade(mergedPlayer);
    Object.assign(newPlayer, automatedUpgrade.player);
    Object.assign(newCachedPlayer, automatedUpgrade.cachedPlayer);
    cacheUpdates.pointUpgrade(mergedPlayer);

    const automatedAmplifluxUpgrade = automateAmplifluxUpgrade(mergedPlayer);
    Object.assign(newPlayer, automatedAmplifluxUpgrade.player);
    Object.assign(newCachedPlayer, automatedAmplifluxUpgrade.cachedPlayer);
    cacheUpdates.amplifluxUpgrade(mergedPlayer);

    const automatedVermyteUpgrade = automateVermyteUpgrade(mergedPlayer);
    Object.assign(newPlayer, automatedVermyteUpgrade.player);
    Object.assign(newCachedPlayer, automatedVermyteUpgrade.cachedPlayer);
    cacheUpdates.vermyteUpgrade(mergedPlayer);

    const automatedCoreUpgrade = automateCoreUpgrade(mergedPlayer);
    Object.assign(newPlayer, automatedCoreUpgrade.player);
    Object.assign(newCachedPlayer, automatedCoreUpgrade.cachedPlayer);
    cacheUpdates.coreUpgrade(mergedPlayer);

    const automatedDertointUpgrade = automateDertointpgrade(mergedPlayer);
    Object.assign(newPlayer, automatedDertointUpgrade.player);
    Object.assign(newCachedPlayer, automatedDertointUpgrade.cachedPlayer);
    cacheUpdates.dertointUpgrade(mergedPlayer);

    if (newPlayer.boughtFourthTierUpgrade)
      newPlayer.autoresettingEnabled = false;

    const goalUpdates = getGoalUpdates(newPlayer);
    Object.assign(newPlayer, goalUpdates.player);
    Object.assign(newCachedPlayer, goalUpdates.cachedPlayer);

    if (
      checkElapsedTime(newCachedPlayer.lastResetTime) &&
      newPlayer.autoresettingEnabled
    ) {
      newPlayer.approximateResetsPerSecond = new Decimal(
        1000 / newCachedPlayer.lastResetTime
      );
    } else {
      newPlayer.approximateResetsPerSecond = new Decimal(0);
    }

    cacheUpdates.runEffect(mergedPlayer);

    cacheUpdates.amplifluxGain(mergedPlayer);
    newPlayer.ampliflux = newPlayer.ampliflux.plus(
      newCachedPlayer.amplifluxGain.multiply(deltaTime)
    );

    cacheUpdates.amplifluxEffect(mergedPlayer);

    Object.assign(newPlayer, generateTierResets(mergedPlayer, deltaTime));

    cacheUpdates.pointGain(mergedPlayer);
    newPlayer.points = newPlayer.points.plus(
      newCachedPlayer.pointGain.multiply(deltaTime)
    );

    for (const [index, softcapper] of settings.softcappers.entries()) {
      if (newCachedPlayer.pointGain.lessThan(softcapper[0])) break;

      const dIndex = new Decimal(index + 1);

      newCachedPlayer.softcapperLevel = dIndex;
      if (dIndex.greaterThan(newPlayer.bestSoftcapperLevel)) {
        newPlayer.bestSoftcapperLevel = dIndex;
      }
    }

    const sliphDate = newPlayer.mallirtStartedDate;

    const baseDate =
      newPlayer.enteredSliph && sliphDate
        ? sliphDate
        : newPlayer.nullithStartedDate ??
          newPlayer.vermyrosStartedDate ??
          newPlayer.tierStartedDate ??
          newPlayer.startedRun;
    newCachedPlayer.timeSinceHighestReset = getTimeSince(baseDate);

    setPlayer(newPlayer);
    setCachedPlayer(newCachedPlayer);

    if (lastSave + settings.saveInterval <= now) {
      savePlayerToLocalStorage(newPlayer);
      lastSave = Date.now();
    }

    requestAnimationFrame(loop);
  }

  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
      calculateOfflineProgress();
    }
  });

  loop();
}
