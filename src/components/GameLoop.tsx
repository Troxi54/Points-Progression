import { useEffect, useRef, useContext } from "react";
import { Player } from "./PlayerContext";
import { loadPlayerFromLocalStorage, playerContext, savePlayerToLocalStorage, settings } from "../playerUtils";
import Decimal from "break_eternity.js";
import { buyMax, buyMaxAmpliflux, buyMaxVermyte } from "../Upgrades";
import { triggerReset, triggerTierReset, triggerVermyrosReset } from "../../Resets";
import { format } from "../format";

export function calculateOfflineTierResets(setPlayer: React.Dispatch<React.SetStateAction<Player>>) {
  setPlayer(prev => {
    if (!prev.boughtThirdTierUpgrade || !prev.autoTierEnabled || prev.boughtSecondVermyrosUpgrade) return prev;
    const deltaTime = Math.max((Date.now() - prev.lastTick) / 1000, 0);
    console.log(deltaTime + 's', prev.approximateTiersPerSecond, format(prev.approximateTiersPerSecond.times(deltaTime).floor()))
    return {
      ...prev,
      madeTierTimes: prev.madeTierTimes.plus(prev.approximateTiersPerSecond.times(deltaTime).floor())
    };
  })
}

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
      }
    }
    
    function getVermyrosUpdates(updates: Player) {
      const now = performance.now() / 1000;
      //if (now - lastVermyrosTime.current < VERMYROS_INTERVAL) return;
      if (updates.points.lessThan(settings.vermyrosGoal) || !updates.autoVermyrosEnabled) return;
      
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
    
    function getTierUpdates(updates: Player) {
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
    function getGoalUpdates(updates: Player) {
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
    function generateTierResets(updates: Player, deltaTime: number) {
      if (!updates.boughtSecondVermyrosUpgrade) return {};
      return {
        madeTierTimes: updates.madeTierTimes.plus(Decimal.multiply(MAX_TIER_PER_SECOND, deltaTime))
      };
    }
    function automateUpgrade(updates: Player) {
      return buyMax(updates, !updates.boughtSecondResetUpgrade);
    }
    function automateAmplifluxUpgrade(updates: Player) {
      return buyMaxAmpliflux(updates, !updates.boughtSixthTierUpgrade);
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
  

    function updatePlayer() {
      setPlayer(prev => {
        let updates: Player = { ...prev };

        const deltaTime = Math.max((Date.now() - updates.lastTick) / 1000, 0);

        updates.softcapperLevel = new Decimal(0);
        if (updates.pointGain.greaterThanOrEqualTo(settings.firstSoftcapperLevelAt))
          updates.softcapperLevel = new Decimal(1);
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
            bestPointsOfRunEffect: Decimal.plus(1, Decimal.max(updates.bestPointsOfRun, 1e6).dividedBy(1e6).log10()).pow(1.3)
        };
        
        updates = {...updates, ...automateUpgrade(updates)};
        updates.upgradeCost = settings.upgradeStartingCost.multiply(Decimal.pow(settings.upgradeScaling, updates.upgradeLvl));
        updates.upgradeEffect = settings.upgradeEffectScaling.pow(updates.upgradeLvl);
        
        updates = {...updates, ...automateAmplifluxUpgrade(updates)};
        updates.amplifluxUpgradeCost = settings.amplifluxUpgradeStartingCost.multiply(Decimal.pow(settings.amplifluxUpgradeCostScaling, updates.amplifluxUpgradeLvl));
        updates.amplifluxUpgradeEffect = settings.amplifluxUpgradeEffectScaling.pow(updates.amplifluxUpgradeLvl);
        
        updates = {...updates, ...buyMaxVermyte(updates, true)};
        updates.vermytesUpgradeCost = settings.vermytesUpgradeStartingCost.multiply(Decimal.pow(settings.vermytesUpgradeCostScaling, updates.vermytesUpgradeLvl));
        updates.vermytesUpgradeEffect = settings.vermytesUpgradeEffectScaling.pow(updates.vermytesUpgradeLvl);
        
        const amplifluxGain = updates.amplifluxUpgradeEffect.multiply(updates.vermoraEffect).multiply(updates.amplivaultEffect);
        let newAmpliflux = updates.ampliflux.plus(amplifluxGain.multiply(deltaTime));
        if (!updates.boughtFourthTierUpgrade) newAmpliflux = updates.ampliflux;
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
            .multiply(updates.vermytesUpgradeEffect);
        const pointGain = preSoftcap1.softcap(settings.firstSoftcapperLevelAt, settings.firstSoftcapperLevelPower, 
          'pow');

        updates.points = updates.points.plus(pointGain.multiply(deltaTime));

        updates = {
          ...updates,
          pointGain: pointGain,
        };

        updates.lastTick = Date.now();
        
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