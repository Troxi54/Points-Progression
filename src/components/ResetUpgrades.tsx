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
      if (prev.points < settings.resetFirstUpgradeCost || player.boughtFirstResetUpgrade) return prev;
      return {
        ...prev,
        boughtFirstResetUpgrade: true,
        points: prev.points - settings.resetFirstUpgradeCost
      };
    });
  }
  function firstUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buyFirstUpgrade();
  }
  function buySecondUpgrade() {
    setPlayer(prev => {
      if (prev.points < settings.resetSecondUpgradeCost || player.boughtSecondResetUpgrade) return prev;
      return {
        ...prev,
        boughtSecondResetUpgrade: true,
        points: prev.points - settings.resetSecondUpgradeCost
      };
    });
  }
  function secondUpgradeContextMenu(event: React.MouseEvent) {
    event.preventDefault();
    buySecondUpgrade();
  }
  return (
    <div id="reset-upgrades" style={{display: player.everMadeRun ? '' : 'none'}}>
      <button id="reset-upgrade-1" onClick={buyFirstUpgrade} onContextMenu={firstUpgradeContextMenu} className={player.boughtFirstResetUpgrade ? 'bought-upgrade' : ''}>
        <p className="reset-upgrade-text">Reset upgrade 1: {format(settings.resetFirstUpgradeCost)} - <span className="effect">Upgrade no longer take points</span></p>
      </button>
      <button id="reset-upgrade-1" style={{display: player.boughtFirstResetUpgrade ? '' : 'none'}} onClick={buySecondUpgrade} onContextMenu={secondUpgradeContextMenu} className={player.boughtSecondResetUpgrade ? 'bought-upgrade' : ''}>
        <p className="reset-upgrade-text">Reset upgrade 2: {format(settings.resetSecondUpgradeCost)} - <span className="effect">Automate upgrade</span></p>
      </button>
    </div>
  )
}

export default ResetUpgrades;