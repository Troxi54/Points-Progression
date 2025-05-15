import { useContext } from "react";
import { playerContext } from "../playerUtils";
import { format } from "../format";
import { buyMaxCore } from "../Upgrades";



function CoreUpgrade() {
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
      if (prev.cores.lessThan(prev.coreUpgradeCost) || !prev.everMadeCoreReset || prev.isCoreUpgradeMaxed) return prev;
      return {
        ...prev,
        cores: prev.boughtFirstNullithUpgrade ? prev.cores : prev.cores.minus(prev.coreUpgradeCost),
        coreUpgradeLvl: prev.coreUpgradeLvl.plus(1)
      };
    });
  }

  function buyMAX() {
    setPlayer(prev => ({
      ...prev,
      ...buyMaxCore(prev)
    }));
  }

  return (
    <div className="bg-core-bg">
      <button id="core-upgrade-button" onClick={buyMAX} onContextMenu={buy}>
        <p id="core-upgrade-cost">Upgrade: {player.isCoreUpgradeMaxed ? 'Maxed' : <>{format(player.coreUpgradeCost)} Cores</>} {player.coreUpgradeLvl.greaterThanOrEqualTo(1) && (<span>({format(player.coreUpgradeLvl, 0)}{player.coreUpgradeBulk.greaterThanOrEqualTo(1) ? ` + ${format(player.coreUpgradeBulk, 0)}` : ''})</span>)}</p>
        <p className="text-core-upgrade-effect">Effect: x<sup>{format(player.coreUpgradeEffect)}</sup> best points effect</p>
      </button>
    </div>
  )
}

export default CoreUpgrade;
