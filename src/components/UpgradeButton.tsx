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
      if (prev.points.lessThan(prev.upgradeCost) || prev.enteredAmplivault) return prev;
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
    <div className="bg-point-upgrade-bg">
      <button className="group hover:border-point-upgrade-hover-border transition-colors-250" onClick={buyMAX} onContextMenu={buy}>
        <p className="transition-colors-250 text-point-upgrade-cost group-hover:text-point-upgrade-hover-cost">Upgrade: {format(player.upgradeCost)} {player.upgradeLvl.greaterThanOrEqualTo(1) && <>({format(player.upgradeLvl, 0)}{player.upgradeBulk.greaterThanOrEqualTo(1) ? ` + ${format(player.upgradeBulk, 0)}` : ''})</>}</p>
        <p className="text-point-upgrade-effect">Effect: {format(player.upgradeEffect)}x</p>
      </button>
    </div>
  )
}

export default UpgradeButton;