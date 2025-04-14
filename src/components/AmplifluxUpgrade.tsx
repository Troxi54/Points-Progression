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
    <div className="bg-ampliflux-upgrade-bg">
      <button className="group hover:border-ampliflux-upgrade-hover-border transition-colors-250" onClick={buyMAX} onContextMenu={buy}>
        <p className="transition-colors-250 text-ampliflux-upgrade-cost group-hover:text-ampliflux-upgrade-hover-cost">Upgrade: {format(player.amplifluxUpgradeCost)} Ampliflux {player.amplifluxUpgradeLvl.greaterThanOrEqualTo(1) && (<>({format(player.amplifluxUpgradeLvl, 0)}{player.amplifluxUpgradeBulk.greaterThanOrEqualTo(1) ? ` + ${format(player.amplifluxUpgradeBulk, 0)}` : ''})</>)}</p>
        <p className="text-ampliflux-upgrade-effect">Effect: {format(player.amplifluxUpgradeEffect)}x ampliflux</p>
      </button>
    </div>
  )
}

export default AmplifluxUpgrade;
