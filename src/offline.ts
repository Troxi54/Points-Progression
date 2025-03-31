import { Player } from "./components/PlayerContext";

export function calculateOfflineTierResets(setPlayer: React.Dispatch<React.SetStateAction<Player>>) {
  setPlayer(prev => {
    if (!prev.boughtThirdTierUpgrade || !prev.autoTierEnabled || prev.boughtSecondVermyrosUpgrade) return prev;
    const deltaTime = Math.max((Date.now() - prev.lastTick) / 1000, 0);
    return {
      ...prev,
      madeTierTimes: prev.madeTierTimes.plus(prev.approximateTiersPerSecond.times(deltaTime).floor())
    };
  })
}