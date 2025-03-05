import { useEffect, useRef, useContext } from "react";
import { loadPlayerFromLocalStorage, Player, playerContext, savePlayerToLocalStorage, settings } from "./PlayerContext";
import { buyMax } from "./UpgradeButton";

export function updateUpgradeValues(setPlayer: React.Dispatch<React.SetStateAction<Player>>) {
  setPlayer((prev) => ({
    ...prev,
    upgradeCost: settings.upgradeStartingCost * settings.upgradeScaling ** prev.upgradeLvl,
    upgradeEffect: settings.upgradeEffectScaling ** prev.upgradeLvl
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
        pointGain: prev.upgradeEffect * prev.runEffect * prev.bestPointsOfRunEffect,
      }));
      setPlayer((prev) => ({ ...prev,
        points: prev.points + deltaTime * prev.pointGain
      }));
    }
    const DAY_IN_MS = 8.64e7;
    function updateGoal() {
      setPlayer((prev) => {
        if (prev.points < settings.finalGoal || !prev.autoresettingEnabled) return prev;
        const timeSpent = Math.max(Math.min(Date.now() - prev.startedRun, DAY_IN_MS), 1);
        
        return {
          ...prev,
          bestPointsOfRun: prev.points > prev.bestPointsOfRun ? prev.points : prev.bestPointsOfRun,
          everMadeRun: true,
          upgradeLvl: 0,
          points: 0,
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
        runEffect: prev.bestRun === null ? 1 : Math.min(1 + Math.log10(TWO_HOURS_IN_MS) / Math.log10(prev.bestRun), 2) * (prev.bestRun <= TWO_HOURS_IN_MS ? 5 ** (Math.log10(TWO_HOURS_IN_MS) - Math.log10(prev.bestRun)) : 1),
        bestPointsOfRunEffect: 1 + Math.log10(Math.max(prev.bestPointsOfRun, 1e6) / 1e6) ** 1.2
      }));
    }
    
    function updateAll(time: number) {
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