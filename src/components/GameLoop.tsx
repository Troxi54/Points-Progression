import { useEffect, useRef, useContext } from "react";
import { loadPlayerFromLocalStorage, Player, playerContext, savePlayerToLocalStorage, settings } from "./PlayerContext";
import { buyMax } from "./UpgradeButton";
import Decimal from "break_eternity.js";

export function updateUpgradeValues(setPlayer: React.Dispatch<React.SetStateAction<Player>>) {
  setPlayer((prev) => ({
    ...prev,
    upgradeCost: settings.upgradeStartingCost.multiply(Decimal.pow(settings.upgradeScaling, prev.upgradeLvl)),
    upgradeEffect: settings.upgradeEffectScaling.pow(prev.upgradeLvl)
  }));
}

function GameLoop() {
  const context = useContext(playerContext);

  if (!context) {
    console.error("GameLoop must be inside PlayerProvider!");
    return null;
  }

  const { setPlayer } = context;
  const lastTimeRef = useRef(performance.now());
  const lastTimeSaveRef = useRef(performance.now());

  useEffect(() => {
    const savedPlayer = loadPlayerFromLocalStorage();
    if (savedPlayer) {
      setPlayer(savedPlayer);
    }

    function savePlayer() {
      if (performance.now() - lastTimeSaveRef.current >= settings.saveInterval) {
        lastTimeSaveRef.current = performance.now();
        setPlayer(prev => {
          savePlayerToLocalStorage(prev);
          return prev;
        });
      }
    }
    function automateUpgrade() {
      setPlayer(prev => {
        if (!prev.boughtSecondResetUpgrade) return prev;
        buyMax(undefined, setPlayer);
        return prev;
      });
    }
    
    function updatePoints(time: number) {
      const deltaTime = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      setPlayer((prev) => ({ ...prev,
        pointGain: prev.upgradeEffect.multiply(prev.runEffect).multiply(prev.bestPointsOfRunEffect).multiply(prev.tierEffect).multiply(prev.tierTimesEffect),
      }));
      setPlayer((prev) => ({ ...prev,
        points: prev.points.plus(prev.pointGain.multiply(deltaTime))
      }));
    }
    const DAY_IN_MS = 8.64e7;
    function updateGoal() {
      setPlayer(prev => {
        if (!prev.boughtThirdTierUpgrade) return prev;
        return { 
          ...prev,
          bestRun: 10,
          bestPointsOfRun: prev.boughtFourthTierUpgrade ? prev.points.greaterThan(prev.bestPointsOfRun) ? prev.points : prev.bestPointsOfRun : prev.bestPointsOfRun
        }
      }); 
      setPlayer((prev) => {
        
        if (prev.points.lessThan(settings.finalGoal) || !prev.autoresettingEnabled) return prev;
        const timeSpent = Math.max(Math.min(Date.now() - prev.startedRun, DAY_IN_MS), 10);
        
        return {
          ...prev,
          bestPointsOfRun: prev.points.greaterThan(prev.bestPointsOfRun) ? prev.points : prev.bestPointsOfRun,
          everMadeRun: true,
          upgradeLvl: new Decimal(0),
          points: new Decimal(0),
          startedRun: Date.now(),
          bestRun: prev.bestRun === null ? timeSpent :
                   timeSpent < prev.bestRun ? timeSpent : prev.bestRun
        };
      });
      
    }
    function updateGoalEffect() {
      const TWO_HOURS_IN_MS = 7.2e6;
      setPlayer((prev) => ({
        ...prev,
        runEffect: prev.bestRun === null ? new Decimal(1) : Decimal.min(Decimal.plus(1, Math.log10(TWO_HOURS_IN_MS) / Math.log10(prev.bestRun)), 2).times(prev.bestRun <= TWO_HOURS_IN_MS ? Decimal.pow(5, Math.log10(TWO_HOURS_IN_MS) - Math.log10(prev.bestRun)) : 1),
        bestPointsOfRunEffect: Decimal.plus(1, Decimal.max(prev.bestPointsOfRun, 1e6).dividedBy(1e6).log10().pow(1.2))
      }));
    }
    function updateTierRequirement() {
      setPlayer((prev) => ({
        ...prev,
        tierRequirement: settings.firstTierAt.multiply(settings.tierScaling.pow(prev.tier))
      }))
    }
    function updateTier() {
      setPlayer((prev) => {
        if (prev.points.lessThan(settings.firstTierAt) || !prev.autoTierEnabled) return prev;

        let bulk = prev.points.dividedBy(prev.tierRequirement).log(settings.tierScaling).floor();
        if (prev.points.lessThan(prev.tierRequirement)) bulk = new Decimal(-1);

        return {
          ...prev,
          everMadeTier: true,
          tierStartedDate: Date.now(),
          upgradeLvl: new Decimal(0),
          points: new Decimal(0),
          startedRun: Date.now(),
          bestRun: null,
          boughtFirstResetUpgrade: prev.boughtFirstTierUpgrade ? true : false,
          boughtSecondResetUpgrade: prev.boughtSecondTierUpgrade ? true : false,
          tier: prev.tier.plus(bulk.plus(1)),
          madeTierTimes: prev.madeTierTimes.plus(1),
          autoresettingEnabled: prev.boughtThirdTierUpgrade ? false : true,
          bestPointsOfRun: new Decimal(0),
        };
      });
      
    }
    function updateTierEffect() {
      setPlayer((prev) => ({
        ...prev,
        tierEffect: Decimal.pow(3, prev.tier),
        tierTimesEffect: prev.madeTierTimes.plus(1).pow(1.2)
      }));
    }
    
    function updateAll(time: number) {
      updateTierRequirement();
      updateTier();
      updateTierEffect();
      updateGoal();
      updateGoalEffect();
      automateUpgrade();
      updateUpgradeValues(setPlayer);
      updatePoints(time);
      savePlayer();

      requestAnimationFrame(updateAll);
    }

    const animationFrame = requestAnimationFrame(updateAll);

    return () => cancelAnimationFrame(animationFrame);
  }, []);
  return null;
}

export default GameLoop;