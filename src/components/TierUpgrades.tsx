import { useContext } from "react";
import { playerContext, settings } from "../playerUtils";
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
        points: prev.boughtFirstVermyrosUpgrade ? prev.points : prev.points.minus(settings.firstTierUpgradeCost)
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
        points: prev.boughtFirstVermyrosUpgrade ? prev.points : prev.points.minus(settings.secondTierUpgradeCost)
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
        points: prev.boughtFirstVermyrosUpgrade ? prev.points : prev.points.minus(settings.thirdTierUpgradeCost)
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
        points: prev.boughtFirstVermyrosUpgrade ? prev.points : prev.points.minus(settings.fourthTierUpgradeCost)
      };
    });
  }
  function fourthUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buyFourthUpgrade();
  }
  return (
    <div id="tier-upgrades" className="upgrade-container gap-[5%]">
      <button onClick={buyFirstUpgrade} onContextMenu={firstUpgradeContextMenu} className={player.boughtFirstTierUpgrade ? 'bought-upgrade' : ''}>
        <p>Tier upgrade 1: {format(settings.firstTierUpgradeCost)} - <span className="text-buyable-once-upgrade-effect">Reset upgrades no longer take points and keep the first one</span></p>
      </button>
      {(player.boughtFirstTierUpgrade || player.everMadeVermyros) && (
        <button onClick={buySecondUpgrade} onContextMenu={secondUpgradeContextMenu} className={player.boughtSecondTierUpgrade ? 'bought-upgrade' : ''}>
          <p>Tier upgrade 2: {format(settings.secondTierUpgradeCost)} - <span className="text-buyable-once-upgrade-effect">Keep the second reset upgrade</span></p>
        </button>
      )}
      {(player.boughtSecondTierUpgrade || player.everMadeVermyros) && (
        <button onClick={buyThirdUpgrade} onContextMenu={thirdUpgradeContextMenu} className={player.boughtThirdTierUpgrade ? 'bought-upgrade' : ''}>
          <p>Tier upgrade 3: {format(settings.thirdTierUpgradeCost)} - <span className="text-buyable-once-upgrade-effect">Always have 10ms best reset run, disable auto reset and unlock offline tier resets</span></p>
        </button>
      )}
      {(player.boughtThirdTierUpgrade || player.everMadeVermyros) && (
        <button onClick={buyFourthUpgrade} onContextMenu={fourthUpgradeContextMenu} className={player.boughtFourthTierUpgrade ? 'bought-upgrade' : ''}>
          <p>Tier upgrade 4: {format(settings.fourthTierUpgradeCost)} - <span className="text-buyable-once-upgrade-effect">Automatically update reset best points, remove the 'Auto Reset' toggle and unlock ampliflux</span></p>
        </button>
      )}
    </div>
  )
}

export default TierUpgrades;