import { useContext } from "react";
import { Upgrade } from "../Upgrades";
import { playerContext } from "../playerUtils";
import { format } from "../format";
import { settings } from './../playerUtils';

interface props {
  id: string,
  upgrades: Upgrade[],
  classNames?: string 
}

function UpgradeContainer({id, upgrades, classNames}: props) {
  const context = useContext(playerContext);
    if (!context) {
      return (
        <div>Loading...</div>
      )
    }
  
  const { player, setPlayer } = context;

  function buy(upgrade: Upgrade) {
    setPlayer(prev => {
      if (prev[upgrade.isBoughtName] || prev[upgrade.currency].lessThan(settings[upgrade.cost])) return prev;
      return {
        ...prev,
        [upgrade.isBoughtName]: true,
        [upgrade.currency]: upgrade.takesCurrency(player) ? prev[upgrade.currency].minus(settings[upgrade.cost]) : prev[upgrade.currency]
      }
    });
  }

  function contextMenu(e: React.MouseEvent, upgrade: Upgrade) {
    e.preventDefault();
    buy(upgrade);
  }

  const visibleUpgrades = upgrades.filter(upgrade => upgrade.show(player) && (!player[upgrade.isBoughtName] || !player.hideBoughtUpgrades));
  return visibleUpgrades.length > 0 && (
      <div id={id} className={'upgrade-container ' + classNames}>
        {upgrades.map(upgrade => (
          upgrade.show(player) && (!player[upgrade.isBoughtName] || !player.hideBoughtUpgrades) ?
          <button className={player[upgrade.isBoughtName] ? 'bought-upgrade' : ''} onClick={() => buy(upgrade)} onContextMenu={(e) => contextMenu(e, upgrade)} key={upgrade.id}>
            <p>{upgrade.name}: {format(settings[upgrade.cost])} - <span className="text-buyable-once-upgrade-effect">{upgrade.description}</span></p>
          </button> : null
        ))}
      </div>
    );
}

export default UpgradeContainer;