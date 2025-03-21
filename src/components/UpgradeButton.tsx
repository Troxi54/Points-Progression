import { useContext } from "react";
import { playerContext } from "../playerUtils";
import { format } from "../format";
import { buyMax } from "../Upgrades";

function UpgradeButton() {
  const context = useContext(playerContext);
  if (!context) {
    return (
      <div>Loading...</div>
    )
  }

  const { player, setPlayer } = context;

  function buy(event: React.MouseEvent) {
    setPlayer(prev => {
      event.preventDefault();
      if (prev.points.lessThan(prev.upgradeCost)) return prev;
      return {
        ...prev,
        points: prev.boughtFirstResetUpgrade ? prev.points : prev.points.minus(prev.upgradeCost),
        upgradeLvl: prev.upgradeLvl.plus(1)
      };
    });
  }
  function buyMAX() {
    setPlayer(prev => ({
      ...prev,
      ...buyMax(prev)
    }));
  }

  return (
    <div id="upgrade-div">
      <button id="upgrade-button" onClick={buyMAX} onContextMenu={buy}>
        <p id="upgrade-cost">Upgrade: {format(player.upgradeCost)} {player.upgradeLvl.greaterThanOrEqualTo(1) && (<span>({format(player.upgradeLvl, 0)}{player.upgradeBulk.greaterThanOrEqualTo(1) ? ` + ${format(player.upgradeBulk, 0)}` : ''})</span>)}</p>
        <p id="upgrade-effect">Effect: {format(player.upgradeEffect)}x</p>
      </button>
    </div>
  )
}

export default UpgradeButton;