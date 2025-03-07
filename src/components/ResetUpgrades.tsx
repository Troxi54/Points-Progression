import { useContext } from "react";
import { playerContext, settings } from "./PlayerContext";
import { format } from "../format";

function ResetUpgrades() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player, setPlayer } = context;
  function buyFirstUpgrade() {
    setPlayer(prev => {
      if (prev.points.lessThan(settings.resetFirstUpgradeCost) || player.boughtFirstResetUpgrade) return prev;
      return {
        ...prev,
        boughtFirstResetUpgrade: true,
        points: prev.boughtFirstTierUpgrade ? prev.points : prev.points.minus(settings.resetFirstUpgradeCost)
      };
    });
  }
  function firstUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buyFirstUpgrade();
  }
  function buySecondUpgrade() {
    setPlayer(prev => {
      if (prev.points.lessThan(settings.resetSecondUpgradeCost) || player.boughtSecondResetUpgrade) return prev;
      return {
        ...prev,
        boughtSecondResetUpgrade: true,
        points: prev.boughtFirstTierUpgrade ? prev.points : prev.points.minus(settings.resetSecondUpgradeCost)
      };
    });
  }
  function secondUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buySecondUpgrade();
  }
  return (
    <div id="reset-upgrades">
      <button id="reset-upgrade-1" onClick={buyFirstUpgrade} onContextMenu={firstUpgradeContextMenu} className={player.boughtFirstResetUpgrade ? 'bought-upgrade' : ''}>
        <p className="reset-upgrade-text">Reset upgrade 1: {format(settings.resetFirstUpgradeCost)} - <span className="reset-upgrade-effect">Upgrade no longer takes points</span></p>
      </button>
      {(player.boughtFirstResetUpgrade || player.everMadeTier) && (<button id="reset-upgrade-1" onClick={buySecondUpgrade} onContextMenu={secondUpgradeContextMenu} className={player.boughtSecondResetUpgrade ? 'bought-upgrade' : ''}>
        <p className="reset-upgrade-text">Reset upgrade 2: {format(settings.resetSecondUpgradeCost)} - <span className="reset-upgrade-effect">Automate upgrade</span></p>
      </button>)}
    </div>
  )
}

export default ResetUpgrades;