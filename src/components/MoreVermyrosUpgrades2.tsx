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
    <div id="more-vermyros-upgrades-2" className="upgrade-container gap-[10%]">
      <button onClick={buyNinthUpgrade} onContextMenu={ninthUpgradeContextMenu} className={player.boughtNinthVermyrosUpgrade ? 'bought-upgrade' : ''}>
        <p>Vermyros upgrade 9: {format(settings.ninthVermyrosUpgradeCost)} - <span className="text-buyable-once-upgrade-effect">Vermyte upgrade no longer takes vermytes</span></p>
      </button>
      {player.boughtNinthVermyrosUpgrade && (
        <button onClick={buyTenthUpgrade} onContextMenu={tenthUpgradeContextMenu} className={player.boughtTenthVermyrosUpgrade ? 'bought-upgrade' : ''}>
          <p>Vermyros upgrade 10: {format(settings.tenthVermyrosUpgradeCost)} - <span className="text-buyable-once-upgrade-effect">Automate vermyte upgrade</span></p>
        </button>
      )}
    </div>
  )
}

export default MoreVermyrosUpgrades2;