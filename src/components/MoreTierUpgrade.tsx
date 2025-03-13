import { useContext } from "react";
import { playerContext, settings } from "./PlayerContext";
import { format } from "../format";

function MoreTierUpgrades() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player, setPlayer } = context;
  function buyFifthUpgrade() {
    setPlayer(prev => {
      if (prev.points.lessThan(settings.fifthTierUpgradeCost) || player.boughtFifthTierUpgrade) return prev;
      return {
        ...prev,
        boughtFifthTierUpgrade: true,
        points: prev.points.minus(settings.fifthTierUpgradeCost)
      };
    });
  }
  function fifthUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buyFifthUpgrade();
  }
  function buySixthUpgrade() {
    setPlayer(prev => {
      if (prev.points.lessThan(settings.sixthTierUpgradeCost) || player.boughtSixthTierUpgrade) return prev;
      return {
        ...prev,
        boughtSixthTierUpgrade: true,
        points: prev.points.minus(settings.sixthTierUpgradeCost)
      };
    });
  }
  function sixthUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buySixthUpgrade();
  }
  return (
    <div id="more-tier-upgrades">
      <button id="tier-upgrade-5" onClick={buyFifthUpgrade} onContextMenu={fifthUpgradeContextMenu} className={player.boughtFifthTierUpgrade ? 'bought-upgrade' : ''}>
        <p className="tier-upgrade-text">Tier upgrade 5: {format(settings.fifthTierUpgradeCost)} - <span className="tier-upgrade-effect">Ampliflux upgrade no longer takes ampliflux</span></p>
      </button>
      {player.boughtFifthTierUpgrade && (<button id="tier-upgrade-6" onClick={buySixthUpgrade} onContextMenu={sixthUpgradeContextMenu} className={player.boughtSixthTierUpgrade ? 'bought-upgrade' : ''}>
        <p className="tier-upgrade-text">Tier upgrade 6: {format(settings.sixthTierUpgradeCost)} - <span className="tier-upgrade-effect">Automate ampliflux upgrade</span></p>
      </button>)}
    </div>
  )
}

export default MoreTierUpgrades;