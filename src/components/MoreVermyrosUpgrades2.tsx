import { useContext } from "react";
import { playerContext, settings } from "../playerUtils";
import { format } from "../format";

function MoreVermyrosUpgrades2() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player, setPlayer } = context;
  function buyNinthUpgrade() {
    setPlayer(prev => {
      if (prev.points.lessThan(settings.ninthVermyrosUpgradeCost) || player.boughtNinthVermyrosUpgrade) return prev;
      return {
        ...prev,
        boughtNinthVermyrosUpgrade: true,
        points: prev.points.minus(settings.ninthVermyrosUpgradeCost)
      };
    });
  }
  function ninthUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buyNinthUpgrade();
  }
  function buyTenthUpgrade() {
    setPlayer(prev => {
      if (prev.points.lessThan(settings.tenthVermyrosUpgradeCost) || player.boughtTenthVermyrosUpgrade) return prev;
      return {
        ...prev,
        boughtTenthVermyrosUpgrade: true,
        points: prev.points.minus(settings.tenthVermyrosUpgradeCost)
      };
    });
  }
  function tenthUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buyTenthUpgrade();
  }
  return (
    <div id="more-vermyros-upgrades-2">
      <button id="vermyros-upgrade-9" onClick={buyNinthUpgrade} onContextMenu={ninthUpgradeContextMenu} className={player.boughtNinthVermyrosUpgrade ? 'bought-upgrade' : ''}>
        <p className="vermyros-upgrade-text">Vermyros upgrade 9: {format(settings.ninthVermyrosUpgradeCost)} - <span className="vermyros-upgrade-effect">Vermyte upgrade no longer takes vermytes</span></p>
      </button>
      {player.boughtNinthVermyrosUpgrade && (
        <button id="vermyros-upgrade-10" onClick={buyTenthUpgrade} onContextMenu={tenthUpgradeContextMenu} className={player.boughtTenthVermyrosUpgrade ? 'bought-upgrade' : ''}>
          <p className="vermyros-upgrade-text">Vermyros upgrade 10: {format(settings.tenthVermyrosUpgradeCost)} - <span className="vermyros-upgrade-effect">Automate vermyte upgrade</span></p>
        </button>
      )}
    </div>
  )
}

export default MoreVermyrosUpgrades2;