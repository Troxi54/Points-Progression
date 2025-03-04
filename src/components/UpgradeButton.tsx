import { useContext } from "react";
import { playerContext, settings } from "./PlayerContext";
import { format } from "../format";

function UpgradeButton() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player, setPlayer } = context;

  function buyMax() {
    setPlayer(prev => {
      if (prev.points < prev.upgradeCost) return prev;
      const SCALING = settings.upgradeScaling;
      const bulk = Math.floor(Math.log10(prev.points / prev.upgradeCost) / Math.log10(SCALING));
      const finalCost = prev.upgradeCost * SCALING ** bulk;
      return {
        ...prev,
        points: prev.points - finalCost,
        upgradeLvl: prev.upgradeLvl + bulk + 1
      };
    });
    
  }

  function buy(event: React.MouseEvent) {
    setPlayer(prev => {
      event.preventDefault();
      if (prev.points < prev.upgradeCost) return prev;
      return {
        ...prev,
        points: prev.points - prev.upgradeCost,
        upgradeLvl: prev.upgradeLvl + 1
      };
    });
  }

  return (
    <div id="upgrade-div">
      <button id="upgrade-button" onClick={buyMax} onContextMenu={buy}>
        <p id="upgrade-cost">Upgrade: {format(player.upgradeCost, 'auto')} <span style={{display: player.upgradeLvl >= 1 ? '' : 'none'}}>({format(player.upgradeLvl, 0)})</span></p>
        <p id="upgrade-effect">Effect: {format(player.upgradeEffect, 'auto')}x</p>
      </button>
    </div>
  )
}

export default UpgradeButton;