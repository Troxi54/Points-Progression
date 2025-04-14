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
        vermytes: prev.boughtNinthVermyrosUpgrade ? prev.vermytes : prev.vermytes.minus(prev.vermytesUpgradeCost),
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
    <div className="bg-vermyte-upgrade-bg">
      <button className="group hover:border-vermyte-upgrade-hover-border transition-colors-250" onClick={buyMAX} onContextMenu={buy}>
        <p className="transition-colors-250 text-vermyte-upgrade-cost group-hover:text-vermyte-upgrade-hover-cost">Upgrade: {format(player.vermytesUpgradeCost)} Vermytes {player.vermytesUpgradeLvl.greaterThanOrEqualTo(1) && (<>({format(player.vermytesUpgradeLvl, 0)}{player.vermytesUpgradeBulk.greaterThanOrEqualTo(1) ? ` + ${format(player.vermytesUpgradeBulk, 0)}` : ''})</>)}</p>
        <p className="text-vermyte-upgrade-effect">Effect: {format(player.vermytesUpgradeEffect)}x</p>
      </button>
    </div>
  )
}

export default VermyteUpgrade;