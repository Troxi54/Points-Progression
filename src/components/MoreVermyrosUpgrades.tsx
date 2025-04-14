import { useContext } from "react";
import { playerContext, settings } from "../playerUtils";
import { format } from "../format";

function MoreVermyrosUpgrades() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player, setPlayer } = context;
  function buyFifthUpgrade() {
    setPlayer(prev => {
      if (prev.points.lessThan(settings.fifthVermyrosUpgradeCost) || player.boughtFifthVermyrosUpgrade) return prev;
      return {
        ...prev,
        boughtFifthVermyrosUpgrade: true,
        points: prev.points.minus(settings.fifthVermyrosUpgradeCost)
      };
    });
  }
  function fifthUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buyFifthUpgrade();
  }
  function buySixthUpgrade() {
    setPlayer(prev => {
      if (prev.points.lessThan(settings.sixthVermyrosUpgradeCost) || player.boughtSixthVermyrosUpgrade) return prev;
      return {
        ...prev,
        boughtSixthVermyrosUpgrade: true,
        points: prev.points.minus(settings.sixthVermyrosUpgradeCost)
      };
    });
  }
  function sixthUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buySixthUpgrade();
  }
  function buySeventhUpgrade() {
    setPlayer(prev => {
      if (prev.points.lessThan(settings.seventhVermyrosUpgradeCost) || player.boughtSeventhVermyrosUpgrade) return prev;
      return {
        ...prev,
        boughtSeventhVermyrosUpgrade: true,
        points: prev.points.minus(settings.seventhVermyrosUpgradeCost)
      };
    });
  }
  function seventhUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buySeventhUpgrade();
  }
  function buyEighthUpgrade() {
    setPlayer(prev => {
      if (prev.points.lessThan(settings.eighthVermyrosUpgradeCost) || player.boughtEighthVermyrosUpgrade) return prev;
      return {
        ...prev,
        boughtEighthVermyrosUpgrade: true,
        points: prev.points.minus(settings.eighthVermyrosUpgradeCost)
      };
    });
  }
  function eighthUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buyEighthUpgrade();
  }
  return (
    <div id="more-vermyros-upgrades" className="upgrade-container gap-[5%]">
      <button onClick={buyFifthUpgrade} onContextMenu={fifthUpgradeContextMenu} className={player.boughtFifthVermyrosUpgrade ? 'bought-upgrade' : ''}>
        <p>Vermyros upgrade 5: {format(settings.fifthVermyrosUpgradeCost)} - <span className="text-buyable-once-upgrade-effect">Unlock the Amplivault and generate 1% of your best vermytes per second</span></p>
      </button>
      {player.boughtFifthVermyrosUpgrade && (
        <button onClick={buySixthUpgrade} onContextMenu={sixthUpgradeContextMenu} className={player.boughtSixthVermyrosUpgrade ? 'bought-upgrade' : ''}>
          <p>Vermyros upgrade 6: {format(settings.sixthVermyrosUpgradeCost)} - <span className="text-buyable-once-upgrade-effect">Generate 10% of your best vermytes per second</span></p>
        </button>
      )}
      {player.boughtSixthVermyrosUpgrade && (
        <button onClick={buySeventhUpgrade} onContextMenu={seventhUpgradeContextMenu} className={player.boughtSeventhVermyrosUpgrade ? 'bought-upgrade' : ''}>
          <p>Vermyros upgrade 7: {format(settings.seventhVermyrosUpgradeCost)} - <span className="text-buyable-once-upgrade-effect">Generate 100% of your best vermytes per second</span></p>
        </button>
      )}
      {player.boughtSeventhVermyrosUpgrade && (
        <button onClick={buyEighthUpgrade} onContextMenu={eighthUpgradeContextMenu} className={player.boughtEighthVermyrosUpgrade ? 'bought-upgrade' : ''}>
          <p>Vermyros upgrade 8: {format(settings.eighthVermyrosUpgradeCost)} - <span className="text-buyable-once-upgrade-effect">Automatically update best vermytes, remove the 'Auto Vermyros' toggle and unlock energy</span></p>
        </button>
      )}
    </div>
  )
}

export default MoreVermyrosUpgrades;