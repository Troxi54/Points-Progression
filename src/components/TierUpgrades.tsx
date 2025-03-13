import { useContext } from "react";
import { playerContext, settings } from "./PlayerContext";
import { format } from "../format";

function TierUpgrades() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player, setPlayer } = context;
  function buyFirstUpgrade() {
    setPlayer(prev => {
      if (prev.points.lessThan(settings.firstTierUpgradeCost) || player.boughtFirstTierUpgrade) return prev;
      return {
        ...prev,
        boughtFirstTierUpgrade: true,
        points: prev.points.minus(settings.firstTierUpgradeCost)
      };
    });
  }
  function firstUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buyFirstUpgrade();
  }
  function buySecondUpgrade() {
    setPlayer(prev => {
      if (prev.points.lessThan(settings.secondTierUpgradeCost) || player.boughtSecondTierUpgrade) return prev;
      return {
        ...prev,
        boughtSecondTierUpgrade: true,
        points: prev.points.minus(settings.secondTierUpgradeCost)
      };
    });
  }
  function secondUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buySecondUpgrade();
  }
  function buyThirdUpgrade() {
    setPlayer(prev => {
      if (prev.points.lessThan(settings.thirdTierUpgradeCost) || player.boughtThirdTierUpgrade) return prev;
      return {
        ...prev,
        boughtThirdTierUpgrade: true,
        points: prev.points.minus(settings.thirdTierUpgradeCost)
      };
    });
  }
  function thirdUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buyThirdUpgrade();
  }
  function buyFourthUpgrade() {
    setPlayer(prev => {
      if (prev.points.lessThan(settings.fourthTierUpgradeCost) || player.boughtFourthTierUpgrade) return prev;
      return {
        ...prev,
        boughtFourthTierUpgrade: true,
        points: prev.points.minus(settings.fourthTierUpgradeCost)
      };
    });
  }
  function fourthUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buyFourthUpgrade();
  }
  return (
    <div id="tier-upgrades">
      <button id="tier-upgrade-1" onClick={buyFirstUpgrade} onContextMenu={firstUpgradeContextMenu} className={player.boughtFirstTierUpgrade ? 'bought-upgrade' : ''}>
        <p className="tier-upgrade-text">Tier upgrade 1: {format(settings.firstTierUpgradeCost)} - <span className="tier-upgrade-effect">Reset upgrades no longer take points and keep the first one</span></p>
      </button>
      {player.boughtFirstTierUpgrade && (<button id="tier-upgrade-2" onClick={buySecondUpgrade} onContextMenu={secondUpgradeContextMenu} className={player.boughtSecondTierUpgrade ? 'bought-upgrade' : ''}>
        <p className="tier-upgrade-text">Tier upgrade 2: {format(settings.secondTierUpgradeCost)} - <span className="tier-upgrade-effect">Keep the second reset upgrade</span></p>
      </button>)}
      {player.boughtSecondTierUpgrade && (<button id="tier-upgrade-3" onClick={buyThirdUpgrade} onContextMenu={thirdUpgradeContextMenu} className={player.boughtThirdTierUpgrade ? 'bought-upgrade' : ''}>
        <p className="tier-upgrade-text">Tier upgrade 3: {format(settings.thirdTierUpgradeCost)} - <span className="tier-upgrade-effect">Always have 10ms best reset run and disable auto reset</span></p>
      </button>)}
      {player.boughtThirdTierUpgrade && (<button id="tier-upgrade-4" onClick={buyFourthUpgrade} onContextMenu={fourthUpgradeContextMenu} className={player.boughtFourthTierUpgrade ? 'bought-upgrade' : ''}>
        <p className="tier-upgrade-text">Tier upgrade 4: {format(settings.fourthTierUpgradeCost)} - <span className="tier-upgrade-effect">Automatically update reset best points, remove auto reset toggle and unlock ampliflux</span></p>
      </button>)}
    </div>
  )
}

export default TierUpgrades;