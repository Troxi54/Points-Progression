import { format, formatWithPlural } from "../format";
import { buyBuyable, buyMaxBuyable } from "../upgrades";
import { usePlayer } from "../player/playerStore";

function VermyteUpgrade() {
  const {
    setPlayer,
    setCachedPlayer,
    vermytesUpgradeLvl,
    vermytesUpgradeCost,
    vermytesUpgradeBulk,
    vermytesUpgradeEffect
  } = usePlayer((state) => ({
    setPlayer: state.setPlayer,
    setCachedPlayer: state.setCachedPlayer,
    vermytesUpgradeLvl: state.player.vermytesUpgradeLvl,
    vermytesUpgradeCost: state.cachedPlayer.vermytesUpgradeCost,
    vermytesUpgradeBulk: state.cachedPlayer.vermytesUpgradeBulk,
    vermytesUpgradeEffect: state.cachedPlayer.vermytesUpgradeEffect
  }));

  function buy(event: React.MouseEvent) {
    event.preventDefault();
    const bought = buyBuyable("vermyte");
    setPlayer(bought.player);
    setCachedPlayer(bought.cachedPlayer);
  }

  function buyMax() {
    const bought = buyMaxBuyable("vermyte");
    setPlayer(bought.player);
    setCachedPlayer(bought.cachedPlayer);
  }

  const thereIsABulk = vermytesUpgradeBulk.greaterThanOrEqualTo(1);

  return (
    <button
      className="buyable group bg-vermyte-upgrade-bg hover:border-vermyte-upgrade-hover-border transition-colors-250"
      onClick={buyMax}
      onContextMenu={buy}
    >
      <p className="transition-colors-250 text-vermyte-upgrade-cost group-hover:text-vermyte-upgrade-hover-cost">
        Upgrade: {formatWithPlural(vermytesUpgradeCost, "Vermyte")}{" "}
        {(vermytesUpgradeLvl.greaterThanOrEqualTo(1) || thereIsABulk) && (
          <>
            ({format(vermytesUpgradeLvl, 0)}
            {thereIsABulk ? ` + ${format(vermytesUpgradeBulk, 0)}` : ""})
          </>
        )}
      </p>
      <p className="text-vermyte-upgrade-effect">
        Effect: {format(vermytesUpgradeEffect)}x
      </p>
    </button>
  );
}

export default VermyteUpgrade;
