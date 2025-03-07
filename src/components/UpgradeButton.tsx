import { useContext } from "react";
import { Player, playerContext, settings } from "./PlayerContext";
import { format } from "../format";
import { updateUpgradeValues } from "./GameLoop";

export function buyMax(_: React.MouseEvent | undefined, setPlayer: React.Dispatch<React.SetStateAction<Player>>) {
  setPlayer(prev => {
    if (prev.points.lessThan(prev.upgradeCost)) return prev;
    const SCALING = settings.upgradeScaling;
    const bulk = prev.points.dividedBy(prev.upgradeCost).log(SCALING).floor();
    const finalCost = prev.upgradeCost.multiply(SCALING.pow(bulk));
    return {
      ...prev,
      points: prev.boughtFirstResetUpgrade ? prev.points : prev.points.minus(finalCost),
      upgradeLvl: prev.upgradeLvl.plus(bulk.plus(1))
    };
  });
  updateUpgradeValues(setPlayer);
}

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

  return (
    <div id="upgrade-div">
      <button id="upgrade-button" onClick={(e) => buyMax(e, setPlayer)} onContextMenu={buy}>
        <p id="upgrade-cost">Upgrade: {format(player.upgradeCost)} {player.upgradeLvl.greaterThanOrEqualTo(1) && (<span>({format(player.upgradeLvl, 0)})</span>)}</p>
        <p id="upgrade-effect">Effect: {format(player.upgradeEffect)}x</p>
      </button>
    </div>
  )
}

export default UpgradeButton;