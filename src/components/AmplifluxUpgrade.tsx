import { useContext } from "react";
import { Player, playerContext, settings } from "./PlayerContext";
import { format } from "../format";
import { updateAmplifluxUpgradeValues } from "./GameLoop";

export function buyMaxAmpliflux(_: React.MouseEvent | undefined, setPlayer: React.Dispatch<React.SetStateAction<Player>>) {
  setPlayer(prev => {
    if (prev.ampliflux.lessThan(prev.amplifluxUpgradeCost) || !prev.boughtFourthTierUpgrade) return prev;
    const SCALING = settings.amplifluxUpgradeCostScaling;
    const bulk = prev.ampliflux.dividedBy(prev.amplifluxUpgradeCost).log(SCALING).floor();
    const finalCost = prev.amplifluxUpgradeCost.multiply(SCALING.pow(bulk));
    return {
      ...prev,
      ampliflux: prev.boughtFifthTierUpgrade ? prev.ampliflux : prev.ampliflux.minus(finalCost),
      amplifluxUpgradeLvl: prev.amplifluxUpgradeLvl.plus(bulk.plus(1))
    };
  });
  updateAmplifluxUpgradeValues(setPlayer);
}

function AmplifluxUpgrade() {
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
      if (prev.ampliflux.lessThan(prev.amplifluxUpgradeCost) || !prev.boughtFourthTierUpgrade) return prev;
      return {
        ...prev,
        ampliflux: prev.boughtFifthTierUpgrade ? prev.ampliflux : prev.ampliflux.minus(prev.amplifluxUpgradeCost),
        amplifluxUpgradeLvl: prev.amplifluxUpgradeLvl.plus(1)
      };
    });
  }

  return (
    <div id="ampliflux-upgrade-div">
      <button id="ampliflux-upgrade-button" onClick={(e) => buyMaxAmpliflux(e, setPlayer)} onContextMenu={buy}>
        <p id="ampliflux-upgrade-cost">Upgrade: {format(player.amplifluxUpgradeCost)} Ampliflux {player.amplifluxUpgradeLvl.greaterThanOrEqualTo(1) && (<span>({format(player.amplifluxUpgradeLvl, 0)})</span>)}</p>
        <p id="ampliflux-upgrade-effect">Effect: {format(player.amplifluxUpgradeEffect)}x ampliflux</p>
      </button>
    </div>
  )
}

export default AmplifluxUpgrade;
