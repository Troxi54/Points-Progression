import { useContext } from "react";
import { playerContext } from "../playerUtils";
import { format } from "../format";
import { buyMaxVermyte } from "../Upgrades";

function VermyteUpgrade() {
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
      if (prev.vermytes.lessThan(prev.vermytesUpgradeCost) || !prev.everMadeVermyros) return prev;
      return {
        ...prev,
        vermytes: prev.vermytes.minus(prev.vermytesUpgradeCost),
        vermytesUpgradeLvl: prev.vermytesUpgradeLvl.plus(1)
      };
    });
  }

  function buyMAX() {
    setPlayer(prev => ({
      ...prev,
      ...buyMaxVermyte(prev)
    }));
  }

  return (
    <div id="vermyte-upgrade-div">
      <button id="vermyte-upgrade-button" onClick={buyMAX} onContextMenu={buy}>
        <p id="vermyte-upgrade-cost">Upgrade: {format(player.vermytesUpgradeCost)} Vermytes {player.vermytesUpgradeLvl.greaterThanOrEqualTo(1) && (<span>({format(player.vermytesUpgradeLvl, 0)})</span>)}</p>
        <p id="vermyte-upgrade-effect">Effect: {format(player.vermytesUpgradeEffect)}x</p>
      </button>
    </div>
  )
}

export default VermyteUpgrade;