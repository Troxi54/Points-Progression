import { useContext } from "react";
import { playerContext, settings } from "../playerUtils";
import { format } from "../format";

function VermyrosUpgrades() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player, setPlayer } = context;
  function buyFirstUpgrade() {
    setPlayer(prev => {
      if (prev.vermytes.lessThan(settings.firstVermyrosUpgradeCost) || player.boughtFirstVermyrosUpgrade) return prev;
      return {
        ...prev,
        boughtFirstVermyrosUpgrade: true,
        vermytes: prev.vermytes.minus(settings.firstVermyrosUpgradeCost)
      };
    });
  }
  function firstUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buyFirstUpgrade();
  }
  function buySecondUpgrade() {
    setPlayer(prev => {
      if (prev.points.lessThan(settings.secondVermyrosUpgradeCost) || player.boughtSecondVermyrosUpgrade) return prev;
      return {
        ...prev,
        boughtSecondVermyrosUpgrade: true,
        points: prev.points.minus(settings.secondVermyrosUpgradeCost)
      };
    });
  }
  function secondUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buySecondUpgrade();
  }
  function buyThirdUpgrade() {
    setPlayer(prev => {
      if (prev.points.lessThan(settings.thirdVermyrosUpgradeCost) || player.boughtThirdVermyrosUpgrade) return prev;
      return {
        ...prev,
        boughtThirdVermyrosUpgrade: true,
        points: prev.points.minus(settings.thirdVermyrosUpgradeCost)
      };
    });
  }
  function thirdUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buyThirdUpgrade();
  }
  function buyFourthUpgrade() {
    setPlayer(prev => {
      if (prev.points.lessThan(settings.fourthVermyrosUpgradeCost) || player.boughtFourthVermyrosUpgrade) return prev;
      return {
        ...prev,
        boughtFourthVermyrosUpgrade: true,
        points: prev.points.minus(settings.fourthVermyrosUpgradeCost)
      };
    });
  }
  function fourthUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buyFourthUpgrade();
  }
  return (
    <div id="vermyros-upgrades" className="upgrade-container gap-[5%]">
      <button onClick={buyFirstUpgrade} onContextMenu={firstUpgradeContextMenu} className={player.boughtFirstVermyrosUpgrade ? 'bought-upgrade' : ''}>
        <p>Vermyros upgrade 1: {format(settings.firstVermyrosUpgradeCost)} vermytes - <span className="text-buyable-once-upgrade-effect">Reset and tier upgrades no longer take points and unlock the Vermyte Upgrade</span></p>
      </button>
      {player.boughtFirstVermyrosUpgrade && (
        <button onClick={buySecondUpgrade} onContextMenu={secondUpgradeContextMenu} className={player.boughtSecondVermyrosUpgrade ? 'bought-upgrade' : ''}>
          <p>Vermyros upgrade 2: {format(settings.secondVermyrosUpgradeCost)} - <span className="text-buyable-once-upgrade-effect">Keep 1st and 2nd reset and tier upgrades, generate 60 tier resets per second and replace the 'Auto Tier' toggle with the 'Auto Tier Up' toggle</span></p>
        </button>
      )}
      {player.boughtSecondVermyrosUpgrade && (
        <button onClick={buyThirdUpgrade} onContextMenu={thirdUpgradeContextMenu} className={player.boughtThirdVermyrosUpgrade ? 'bought-upgrade' : ''}>
          <p>Vermyros upgrade 3: {format(settings.thirdVermyrosUpgradeCost)} - <span className="text-buyable-once-upgrade-effect">Keep 3-6 tier upgrades</span></p>
        </button>
      )}
      {player.boughtThirdVermyrosUpgrade && (
        <button onClick={buyFourthUpgrade} onContextMenu={fourthUpgradeContextMenu} className={player.boughtFourthVermyrosUpgrade ? 'bought-upgrade' : ''}>
          <p>Vermyros upgrade 4: {format(settings.fourthVermyrosUpgradeCost)} - <span className="text-buyable-once-upgrade-effect">Tier no longer resets anything and generate 0.1% of your best vermytes per second</span></p>
        </button>
      )}
    </div>
  )
}

export default VermyrosUpgrades;