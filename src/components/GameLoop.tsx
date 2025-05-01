import { useEffect, useRef, useContext } from "react";
import { Player } from "./PlayerContext";
import { GlobalSettings, loadPlayerFromLocalStorage, playerContext, savePlayerToLocalStorage, settings } from "../playerUtils";
import Decimal from "break_eternity.js";
import { buyMax, buyMaxAmpliflux, buyMaxCore, buyMaxVermyte } from "../Upgrades";
import { triggerNullithReset, triggerReset, triggerTierReset, triggerVermyrosReset } from "../Resets";
import { calculateOfflineNullithResets, calculateOfflineTierResets } from "../offline";

function GameLoop() {
  const context = useRef(useContext(playerContext));
  
  const lastTimeSaveRef = useRef(performance.now());
  const lastTierTime = useRef(0);
  const resetTimes = useRef([0]);
  const RESET_TIMES_MAX_LENGTH = 10;
  const tierTimes = useRef([0]);
  const TIER_TIMES_MAX_LENGTH = 10;
  const vermyrosTimes = useRef([0]);
  const VERMYROS_TIMES_MAX_LENGTH = 10;
  const lastVermyrosTime = useRef(0);
  const nullithTimes = useRef([0]);
  const NULLITH_TIMES_MAX_LENGTH = 10;
  const lastNullithTime = useRef(0);

  useEffect(() => {
    if (!context.current) {
      console.error("GameLoop must be inside PlayerProvider!");
      return;
    }

    const TIER_INTERVAL = 1 / 60;
    const MAX_TIER_PER_SECOND = 1 / TIER_INTERVAL;
    //const VERMYROS_INTERVAL = 1 / 60;

    const { setPlayer, playerRef } = context.current;

    let frameId: number;
    const savedPlayer = loadPlayerFromLocalStorage();
    if (savedPlayer) {
      setPlayer(savedPlayer);
      calculateOfflineTierResets(setPlayer);
      calculateOfflineNullithResets(setPlayer);
    }

    function savePlayer() {
      if (performance.now() - lastTimeSaveRef.current >= settings.saveInterval) {
        lastTimeSaveRef.current = performance.now();
        savePlayerToLocalStorage(playerRef.current);
      }
    }

    function onVisibilityChange() {
      if (!document.hidden) {
        calculateOfflineTierResets(setPlayer);
        calculateOfflineNullithResets(setPlayer);
      }
    }
    
    function getNullithUpdates(updates: Player): Partial<Player> {
      const now = performance.now() / 1000;
      if (updates.points.lessThan(settings.nullithGoal) || !updates.autoNullithEnabled) return {};
      
      const time = updates.nullithStartedDate === null ? Infinity : Date.now() - updates.nullithStartedDate;
      nullithTimes.current.push(time);
      setTimeout(() => {
        const index = nullithTimes.current.indexOf(time);
        if (index !== -1) nullithTimes.current.splice(index, 1);
      }, 1000);
      if (nullithTimes.current.length > NULLITH_TIMES_MAX_LENGTH) nullithTimes.current.shift();

      const nullithUpdate: Partial<Player> = {
        ...triggerNullithReset(updates),
        everMadeNullith: true,
        everMadeVermyros: true,
        everMadeTier: true,
        everMadeRun: true,
        madeNullithResets: updates.madeNullithResets.plus(1)
      };

      lastNullithTime.current = now;

      return nullithUpdate;
    }

    function getVermyrosUpdates(updates: Player): Partial<Player> {
      const now = performance.now() / 1000;
      //if (now - lastVermyrosTime.current < VERMYROS_INTERVAL) return;
      if (updates.points.lessThan(settings.vermyrosGoal) || !updates.autoVermyrosEnabled) return {};
      
      const time = updates.vermyrosStartedDate === null ? Infinity : Date.now() - updates.vermyrosStartedDate;
      vermyrosTimes.current.push(time);
      setTimeout(() => {
        const index = vermyrosTimes.current.indexOf(time);
        if (index !== -1) vermyrosTimes.current.splice(index, 1);
      }, 1000);
      if (vermyrosTimes.current.length > VERMYROS_TIMES_MAX_LENGTH) vermyrosTimes.current.shift();

      const vermyrosUpdate = {
        ...triggerVermyrosReset(updates),
        everMadeVermyros: true,
        everMadeTier: true,
        everMadeRun: true,
        vermytes: updates.vermytes.plus(updates.vermytesGain),
        bestVermytes: updates.vermytesGain.greaterThan(updates.bestVermytes) ? updates.vermytesGain : updates.bestVermytes
      };

      lastVermyrosTime.current = now;

      return vermyrosUpdate;
    }
    
    function getTierUpdates(updates: Player): Partial<Player> {
      const now = performance.now() / 1000;
      //if (now - lastTierTime.current < TIER_INTERVAL) return {};
      let bulk = updates.points.dividedBy(updates.tierRequirement).log(settings.tierScaling).floor();
  
      if (!updates.boughtSecondVermyrosUpgrade) {
        if (updates.points.lessThan(settings.firstTierAt) || !updates.autoTierEnabled) return {};
        if (updates.points.lessThan(updates.tierRequirement)) bulk = new Decimal(-1);
      } else {
        if (updates.points.lessThan(updates.tierRequirement) || !updates.autoTierEnabled) return {};
      }
  
      lastTierTime.current = now;
  
      if (updates.boughtFourthVermyrosUpgrade) {
        return {
          tier: updates.tier.plus(bulk.plus(1))
        }
      }

      const time = updates.tierStartedDate === null ? Infinity : Date.now() - updates.tierStartedDate;
      tierTimes.current.push(time);
      setTimeout(() => {
        const index = tierTimes.current.indexOf(time);
        if (index !== -1) tierTimes.current.splice(index, 1);
      }, 1000);
      if (tierTimes.current.length > TIER_TIMES_MAX_LENGTH) tierTimes.current.shift();

      return {
        ...triggerTierReset(updates),
        everMadeTier: true,
        everMadeRun: true,
        tier: updates.tier.plus(bulk.plus(1)),
        madeTierTimes: updates.madeTierTimes.plus(1)
      };
    }
    function getGoalUpdates(updates: Player): Partial<Player> {
      const DAY_IN_MS = 8.64e7;
      let autoSet = {};
      if (updates.boughtThirdTierUpgrade) {
        autoSet = {
          bestRun: 10,
          bestPointsOfRun: updates.boughtFourthTierUpgrade ? updates.points.greaterThan(updates.bestPointsOfRun) ? updates.points : updates.bestPointsOfRun : updates.bestPointsOfRun
        }
      }
      if (updates.points.lessThan(settings.finalGoal) || !updates.autoresettingEnabled) return autoSet;
      const timeSpent = Math.max(Math.min(Date.now() - updates.startedRun, DAY_IN_MS), 10);

      const time = Date.now() - updates.startedRun;
      resetTimes.current.push(time);
      setTimeout(() => {
        const index = resetTimes.current.indexOf(time);
        if (index !== -1) resetTimes.current.splice(index, 1);
      }, 1000);
      if (resetTimes.current.length > RESET_TIMES_MAX_LENGTH) resetTimes.current.shift();

      return {
        ...autoSet,
        ...triggerReset(),
        bestPointsOfRun: updates.points.greaterThan(updates.bestPointsOfRun) ? updates.points : updates.bestPointsOfRun,
        everMadeRun: true,
        bestRun: updates.boughtThirdTierUpgrade ? 10 : updates.bestRun === null ? timeSpent :
            timeSpent < updates.bestRun ? timeSpent : updates.bestRun
      };
    }
    function generateTierResets(updates: Player, deltaTime: number): Partial<Player> {
      if (!updates.boughtSecondVermyrosUpgrade) return {};
      return {
        madeTierTimes: updates.madeTierTimes.plus(Decimal.multiply(MAX_TIER_PER_SECOND, deltaTime))
      };
    }
    function automateUpgrade(updates: Player): Partial<Player> {
      return buyMax(updates, !updates.boughtSecondResetUpgrade);
    }
    function automateAmplifluxUpgrade(updates: Player): Partial<Player> {
      return buyMaxAmpliflux(updates, !updates.boughtSixthTierUpgrade);
    }
    function automateVermyteUpgrade(updates: Player): Partial<Player> {
      return buyMaxVermyte(updates, !updates.boughtTenthVermyrosUpgrade);
    }
    function automateCoreUpgrade(updates: Player): Partial<Player> {
      return buyMaxCore(updates, !updates.boughtFourthNullithUpgrade);
    }
    function generateVermytes(updates: Player, deltaTime: number) {
      let percentage = 0;
      if (updates.boughtFourthVermyrosUpgrade) percentage = 0.1;
      if (updates.boughtFifthVermyrosUpgrade) percentage = 1;
      if (updates.boughtSixthVermyrosUpgrade) percentage = 10;
      if (updates.boughtSeventhVermyrosUpgrade) percentage = 100;
      if (!percentage || updates.bestVermytes.lessThanOrEqualTo(0)) return {
        vermytesPerSecond: new Decimal(0)
      };
      const generation = updates.bestVermytes.multiply(percentage / 100);
      return {
        vermytesPerSecond: generation,
        vermytes: updates.vermytes.plus(generation.multiply(deltaTime))
      }
    }
    function generateCores(updates: Player, deltaTime: number): Partial<Player> {
      let percentage = 0;
      if (updates.boughtThirdNullithUpgrade) percentage = 0.1;
      if (updates.boughtFourthNullithUpgrade) percentage = 1;
      if (!percentage || updates.coreGain.lessThanOrEqualTo(0)) return {
        coresPerSecond: new Decimal(0)
      };
      const generation = updates.coreGain.multiply(percentage / 100);
      return {
        coresPerSecond: generation,
        cores: updates.cores.plus(generation.multiply(deltaTime))
      }
    }
  

    function updatePlayer() {
      setPlayer(prev => {
        let updates: Player = { ...prev };

        const deltaTime = Math.max((Date.now() - updates.lastTick) / 1000, 0);

        updates = {...updates, ...getNullithUpdates(updates)};
        const nullithTimesSum = nullithTimes.current.reduce((num, num2) => num + num2, 0);
        if (nullithTimes.current.length >= 1 && nullithTimesSum > 0 && nullithTimesSum !== Infinity && updates.autoNullithEnabled) {
          updates.approximateNullithResetsPerSecond = new Decimal(1000 / (nullithTimesSum / nullithTimes.current.length));
        } else {
          updates.approximateNullithResetsPerSecond = new Decimal(0);
        }
        updates.nullithResetsEffect = updates.madeNullithResets.gt(0) ? Decimal.multiply(125, updates.madeNullithResets.pow(3)).round()
              : new Decimal(1);
        updates.nullithResetsVermyteEffect = updates.madeNullithResets.gt(0) ? updates.madeNullithResets.plus(1).pow(1.2)
              : new Decimal(1);
        updates.nullithResetsEnergyEffect = updates.madeNullithResets.gt(0) ? updates.madeNullithResets.plus(1).pow(0.75)
              : new Decimal(1);

        updates.everBoughtTenthVermyrosUpgrade = updates.boughtTenthVermyrosUpgrade || updates.everBoughtTenthVermyrosUpgrade;

        let darkEnergyGain = Decimal.pow(2, updates.points.dividedBy(settings.tenthVermyrosUpgradeCost).max(0).plus(1).log(1e10)).max(1);
        if (!updates.everBoughtTenthVermyrosUpgrade && !updates.everMadeNullith) darkEnergyGain = new Decimal(0);
        const newDarkEnergy = updates.darkEnergy.plus(darkEnergyGain.multiply(deltaTime));
        
        updates = {
          ...updates,
          darkEnergy: newDarkEnergy,
          darkEnergyGain: darkEnergyGain,
          darkEnergyEffect: Decimal.pow(1.75, newDarkEnergy.max(0).plus(1).log10())
        }

        updates.coreEffect = Decimal.pow(4, updates.cores.max(0).plus(1).log10());

        let energyReactorGain = new Decimal(0.1).multiply(updates.coreEffect).multiply(updates.darkEnergyEffect);
        if (!updates.boughtEighthVermyrosUpgrade) energyReactorGain = new Decimal(0);
        const newEnergyReactors = updates.energyReactors.plus(energyReactorGain.multiply(deltaTime));
        updates = {
          ...updates,
          energyReactors: newEnergyReactors,
          energyReactorGain: energyReactorGain
        }

        let energyGain = updates.energyReactors.multiply(updates.nullithResetsEnergyEffect);
        if (!updates.boughtEighthVermyrosUpgrade) energyGain = new Decimal(0);
        const newEnergy = updates.energy.plus(energyGain.multiply(deltaTime));
        updates = {
          ...updates,
          energy: newEnergy,
          energyGain: energyGain,
          energyEffect: Decimal.pow(1.75, newEnergy.max(0).plus(1).log10())
        }

        if (newEnergy.greaterThanOrEqualTo(settings.coresAt))
          updates.everReachedCores = true;

        updates.coreGain = newEnergy.greaterThanOrEqualTo(settings.coresAt)
                ? newEnergy.dividedBy(settings.coresAt)
                : new Decimal(0);

        updates = { ...updates, ...generateCores(updates, deltaTime) };

        updates.softcapperLevel = new Decimal(0);
        if (updates.pointGain.greaterThanOrEqualTo(settings.firstSoftcapperLevelAt))
          updates.softcapperLevel = new Decimal(1);
        if (updates.points.greaterThanOrEqualTo(settings.secondSoftcapperLevelAt))
          updates.softcapperLevel = new Decimal(2);
        updates.bestSoftcapperLevel = updates.softcapperLevel.greaterThan(updates.bestSoftcapperLevel) ? updates.softcapperLevel : updates.bestSoftcapperLevel;

        if (updates.boughtEighthVermyrosUpgrade) updates.autoVermyrosEnabled = false;
        updates.amplivaultRequirement = settings.amplivaultRequirementStartsAt.multiply(Decimal.pow(1000, updates.amplivaultLevel));
        if (updates.enteredAmplivault && updates.points.greaterThanOrEqualTo(updates.amplivaultRequirement)) {
          const bulk = updates.points.dividedBy(updates.amplivaultRequirement).log(1000).floor().plus(1);
          updates.amplivaultLevel = updates.amplivaultLevel.plus(bulk);
        } 
        updates.amplivaultEffect = Decimal.pow(2, updates.amplivaultLevel);

        updates.vermytesGain = updates.points.greaterThanOrEqualTo(settings.vermyrosGoal)
            ? Decimal.pow(2, updates.points.div(settings.vermyrosGoal).log('e6').max(0))
              .multiply(updates.nullithResetsVermyteEffect)
            : new Decimal(0);

        if (updates.boughtEighthVermyrosUpgrade)
          updates.bestVermytes = updates.vermytesGain.greaterThan(updates.bestVermytes) ? updates.vermytesGain : updates.bestVermytes;
    
        const vermyrosUpdates = getVermyrosUpdates(updates);
        updates = { ...updates, ...vermyrosUpdates };
        const vermyrosTimesSum = vermyrosTimes.current.reduce((num, num2) => num + num2, 0);
        if (vermyrosTimes.current.length >= 1 && vermyrosTimesSum > 0 && vermyrosTimesSum !== Infinity && updates.autoVermyrosEnabled) {
          updates.approximateVermyrosResetsPerSecond = new Decimal(1000 / (vermyrosTimesSum / vermyrosTimes.current.length));
        } else {
          updates.approximateVermyrosResetsPerSecond = new Decimal(0);
        }
        updates.vermytesBestEffect = updates.bestVermytes.pow(3);
        updates = { ...updates, ...generateVermytes(updates, deltaTime) };
    
        const vermoraGain = updates.vermytesBestEffect;
        const newVermora = updates.vermora.plus(vermoraGain.multiply(deltaTime));
        updates = {
          ...updates,
          vermora: newVermora,
          vermoraGain: vermoraGain,
          vermoraEffect: Decimal.pow(2, newVermora.max(0).plus(1).log10()),
          tierRequirement: settings.firstTierAt.multiply(settings.tierScaling.pow(updates.tier)),
        };
        const tierUpdates = getTierUpdates(updates);
        updates = {...updates, ...tierUpdates};
        const tierTimesSum = tierTimes.current.reduce((num, num2) => num + num2, 0);
        if (tierTimes.current.length >= 1 && tierTimesSum > 0 && tierTimesSum !== Infinity && updates.autoTierEnabled) {
          updates.approximateTiersPerSecond = new Decimal(1000 / (tierTimesSum / tierTimes.current.length));
        } else {
          updates.approximateTiersPerSecond = new Decimal(0);
        }
        
        updates = {
          ...updates,
          tierEffect: Decimal.pow(3, updates.tier),
          tierTimesEffect: updates.madeTierTimes.softcap(1e6, 0.25, 'pow').plus(1).pow(1.2)
        };
    
        updates = {...updates, ...automateUpgrade(updates)};
        updates.upgradeCost = settings.upgradeStartingCost.multiply(Decimal.pow(settings.upgradeScaling, updates.upgradeLvl));
        updates.upgradeEffect = settings.upgradeEffectScaling.pow(updates.upgradeLvl);
        
        updates = {...updates, ...automateAmplifluxUpgrade(updates)};
        updates.amplifluxUpgradeCost = settings.amplifluxUpgradeStartingCost.multiply(Decimal.pow(settings.amplifluxUpgradeCostScaling, updates.amplifluxUpgradeLvl));
        updates.amplifluxUpgradeEffect = settings.amplifluxUpgradeEffectScaling.pow(updates.amplifluxUpgradeLvl);
        
        updates = {...updates, ...automateVermyteUpgrade(updates)};
        updates.vermytesUpgradeCost = settings.vermytesUpgradeStartingCost.multiply(Decimal.pow(settings.vermytesUpgradeCostScaling, updates.vermytesUpgradeLvl));
        updates.vermytesUpgradeEffect = settings.vermytesUpgradeEffectScaling.pow(updates.vermytesUpgradeLvl);

        updates = {...updates, ...automateCoreUpgrade(updates)};
        updates.coreUpgradeCost = settings.coreUpgradeStartingCost.multiply(Decimal.pow(settings.coreUpgradeCostScaling, updates.coreUpgradeLvl));
        updates.coreUpgradeEffect = settings.coreUpgradeEffectScaling.pow(updates.coreUpgradeLvl);

        if (updates.boughtFourthTierUpgrade)
          updates.autoresettingEnabled = false;

        const goalUpdates = getGoalUpdates(updates)
        updates = {...updates, ...goalUpdates};
        const resetTimesSum = resetTimes.current.reduce((num, num2) => num + num2, 0);
        if (resetTimes.current.length >= 1 && resetTimesSum > 0 && updates.autoresettingEnabled) {
          updates.approximateResetsPerSecond = new Decimal(1000 / (resetTimesSum / resetTimes.current.length));
        } else {
          updates.approximateResetsPerSecond = new Decimal(0);
        }
    
        const TWO_HOURS_IN_MS = 7.2e6;
        updates = {
            ...updates,
            runEffect: updates.bestRun === null ? new Decimal(1) : Decimal.min(Decimal.plus(1, Math.log10(TWO_HOURS_IN_MS) / Math.log10(updates.bestRun)), 2).times(updates.bestRun <= TWO_HOURS_IN_MS ? Decimal.pow(5, Math.log10(TWO_HOURS_IN_MS) - Math.log10(updates.bestRun)) : 1),
            bestPointsOfRunEffect: Decimal.plus(1, Decimal.max(updates.bestPointsOfRun, 1e6).dividedBy(1e6).log10()).pow(1.3).pow(updates.coreUpgradeEffect)
        };
        
        let amplifluxGain = updates.amplifluxUpgradeEffect.multiply(updates.vermoraEffect).multiply(updates.amplivaultEffect);
        if (!updates.boughtFourthTierUpgrade) amplifluxGain = new Decimal(0);
        const newAmpliflux = updates.ampliflux.plus(amplifluxGain.multiply(deltaTime));
        
        updates = {
          ...updates,
          ampliflux: newAmpliflux,
          amplifluxGain: amplifluxGain,
          amplifluxEffect: Decimal.pow(2, newAmpliflux.max(0).plus(1).log10())
        };

        const tierResetGenerationUpdates = generateTierResets(updates, deltaTime);
        updates = {...updates, ...tierResetGenerationUpdates};
        
        const preSoftcap1 = updates.upgradeEffect
            .multiply(updates.runEffect)
            .multiply(updates.bestPointsOfRunEffect)
            .multiply(updates.tierEffect)
            .multiply(updates.tierTimesEffect)
            .multiply(updates.amplifluxEffect)
            .multiply(updates.vermytesUpgradeEffect)
            .multiply(updates.energyEffect)
            .multiply(updates.nullithResetsEffect);
        const pointGain = preSoftcap1.softcap(settings.firstSoftcapperLevelAt, settings.firstSoftcapperLevelPower, 'pow')
            .softcap(settings.secondSoftcapperLevelAt, settings.secondSoftcapperLevelPower, 'pow');

        updates.points = updates.points.plus(pointGain.multiply(deltaTime));

        updates = {
          ...updates,
          pointGain: pointGain,
        };

        updates.lastTick = Date.now();

        GlobalSettings.exponentialNotation = updates.exponentialNotation;

        return updates;
      });
      savePlayer();

      

      frameId = requestAnimationFrame(updatePlayer);
    }
    document.addEventListener('visibilitychange', onVisibilityChange);

    frameId = requestAnimationFrame(updatePlayer);

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      cancelAnimationFrame(frameId);
    } 
  }, []);
  return null;
}

export default GameLoop;