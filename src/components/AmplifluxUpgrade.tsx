import { useContext } from "react";
import { playerContext } from "../playerUtils";
import { format } from "../format";
import { buyMaxAmpliflux } from "../Upgrades";



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

  function buyMAX() {
    setPlayer(prev => ({
      ...prev,
      ...buyMaxAmpliflux(prev)
    }));
  }

  return (
    <div id="ampliflux-upgrade-div">
      <button id="ampliflux-upgrade-button" onClick={buyMAX} onContextMenu={buy}>
        <p id="ampliflux-upgrade-cost">Upgrade: {format(player.amplifluxUpgradeCost)} Ampliflux {player.amplifluxUpgradeLvl.greaterThanOrEqualTo(1) && (<span>({format(player.amplifluxUpgradeLvl, 0)})</span>)}</p>
        <p id="ampliflux-upgrade-effect">Effect: {format(player.amplifluxUpgradeEffect)}x ampliflux</p>
      </button>
    </div>
  )
}

export default AmplifluxUpgrade;
