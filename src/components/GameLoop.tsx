import { useEffect, useRef, useContext } from "react";
import { Player } from "./PlayerContext";
import { loadPlayerFromLocalStorage, playerContext, savePlayerToLocalStorage, settings } from "../playerUtils";
import Decimal from "break_eternity.js";
import { buyMax, buyMaxAmpliflux, buyMaxVermyte } from "../Upgrades";

function GameLoop() {
  const context = useRef(useContext(playerContext));
  
  const lastTimeSaveRef = useRef(performance.now());
  const lastTierTime = useRef(0);
  const tierTimes = useRef([0]);
  const TIER_TIMES_MAX_LENGTH = 20;
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
      calculateOfflineTierResets();
    }

    function savePlayer() {
      if (performance.now() - lastTimeSaveRef.current >= settings.saveInterval) {
        lastTimeSaveRef.current = performance.now();
        savePlayerToLocalStorage(playerRef.current);
      }
    }

    function onVisibilityChange() {
      if (!document.hidden) {
        calculateOfflineTierResets();
      }
    }
    
    function getVermyrosUpdates(updates: Player) {
      const now = performance.now() / 1000;
      //if (now - lastVermyrosTime.current < VERMYROS_INTERVAL) return;
      if (updates.points.lessThan(settings.vermyrosGoal) || !updates.autoVermyrosEnabled) return;
      
      const vermyrosUpdate = {
        everMadeVermyros: true,
        everMadeTier: true,
        everMadeRun: true,
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

      tierTimes.current.push(updates.tierStartedDate === null ? Infinity : Date.now() - updates.tierStartedDate);
      if (tierTimes.current.length > TIER_TIMES_MAX_LENGTH) tierTimes.current.shift();

      return {
        everMadeTier: true,
        everMadeRun: true,
        tierStartedDate: Date.now(),
        upgradeLvl: new Decimal(0),
        points: new Decimal(0),
        startedRun: Date.now(),
        bestRun: null,
        boughtFirstResetUpgrade: updates.boughtFirstTierUpgrade && updates.boughtFirstResetUpgrade,
        boughtSecondResetUpgrade: updates.boughtSecondTierUpgrade && updates.boughtSecondResetUpgrade,
        tier: updates.tier.plus(bulk.plus(1)),
        madeTierTimes: updates.madeTierTimes.plus(1),
        autoresettingEnabled: !updates.boughtThirdTierUpgrade,
        bestPointsOfRun: new Decimal(0)
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
      return {
        ...autoSet,
        bestPointsOfRun: updates.points.greaterThan(updates.bestPointsOfRun) ? updates.points : updates.bestPointsOfRun,
        everMadeRun: true,
        upgradeLvl: new Decimal(0),
        points: new Decimal(0),
        startedRun: Date.now(),
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
    function calculateOfflineTierResets() {
      setPlayer(prev => {
        if (!prev.boughtThirdTierUpgrade || !prev.autoTierEnabled || prev.boughtSecondVermyrosUpgrade) return prev;
        const deltaTime = (Date.now() - prev.lastTick) / 1000;
        return {
          ...prev,
          madeTierTimes: prev.madeTierTimes.plus(prev.approximateTiersPerSecond.times(deltaTime).floor())
        };
      })
    }
    function automateUpgrade(updates: Player) {
      return buyMax(updates, !updates.boughtSecondResetUpgrade);
    }
    function automateAmplifluxUpgrade(updates: Player) {
      return buyMaxAmpliflux(updates, !updates.boughtSixthTierUpgrade);
    }
  

    function updatePlayer() {
      setPlayer(prev => {
        let updates: Player = { ...prev };

        const deltaTime = (Date.now() - updates.lastTick) / 1000;
    
        updates.vermytesGain = updates.points.greaterThanOrEqualTo(settings.vermyrosGoal)
            ? Decimal.pow(2, updates.points.div(settings.vermyrosGoal).log('e6').max(0))
            : new Decimal(0);
    
        const vermyrosUpdates = getVermyrosUpdates(updates);
        updates = { ...updates, ...vermyrosUpdates };
        updates.vermytesBestEffect = updates.bestVermytes.pow(3);
    
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
        updates.approximateTiersPerSecond = new Decimal(1000 / (tierTimes.current.reduce((num, num2) => num + num2, 0) / tierTimes.current.length));
        updates = {
          ...updates,
          tierEffect: Decimal.pow(3, updates.tier),
          tierTimesEffect: updates.madeTierTimes.softcap(1e6, 0.25, 'pow').plus(1).pow(1.2)
        };
    
        const goalUpdates = getGoalUpdates(updates)
        updates = {...updates, ...goalUpdates};
    
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
        
        const amplifluxGain = updates.amplifluxUpgradeEffect.multiply(updates.vermoraEffect);
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
        
        const pointGain = updates.upgradeEffect
            .multiply(updates.runEffect)
            .multiply(updates.bestPointsOfRunEffect)
            .multiply(updates.tierEffect)
            .multiply(updates.tierTimesEffect)
            .multiply(updates.amplifluxEffect)
            .multiply(updates.vermytesUpgradeEffect);

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