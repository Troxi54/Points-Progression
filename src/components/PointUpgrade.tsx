import { format } from "../format";
import { buyBuyable, buyMaxBuyable } from "../upgrades";
import { usePlayer } from "../player/playerStore";

function PointUpgrade() {
  const {
    setPlayer,
    setCachedPlayer,
    upgradeCost,
    upgradeLvl,
    upgradeBulk,
    upgradeEffect
  } = usePlayer((state) => ({
    setPlayer: state.setPlayer,
    setCachedPlayer: state.setCachedPlayer,
    upgradeCost: state.cachedPlayer.upgradeCost,
    upgradeLvl: state.player.upgradeLvl,
    upgradeBulk: state.cachedPlayer.upgradeBulk,
    upgradeEffect: state.cachedPlayer.upgradeEffect
  }));

  function buy(event: React.MouseEvent) {
    event.preventDefault();
    const bought = buyBuyable("point");
    setPlayer(bought.player);
    setCachedPlayer(bought.cachedPlayer);
  }
  function buyMax() {
    const bought = buyMaxBuyable("point");
    setPlayer(bought.player);
    setCachedPlayer(bought.cachedPlayer);
  }

  const thereIsABulk = upgradeBulk.greaterThanOrEqualTo(1);

  return (
    <button
      className="buyable group bg-point-upgrade-bg hover:border-point-upgrade-hover-border transition-colors-250"
      onClick={buyMax}
      onContextMenu={buy}
    >
      <p className="transition-colors-250 text-point-upgrade-cost group-hover:text-point-upgrade-hover-cost">
        Upgrade: {format(upgradeCost)}{" "}
        {(upgradeLvl.greaterThanOrEqualTo(1) || thereIsABulk) && (
          <>
            ({format(upgradeLvl, 0)}
            {thereIsABulk ? ` + ${format(upgradeBulk, 0)}` : ""})
          </>
        )}
      </p>
      <p className="text-point-upgrade-effect">
        Effect: {format(upgradeEffect)}x
      </p>
    </button>
  );
}

export default PointUpgrade;
