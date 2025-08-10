import { format, formatWithPlural } from "../format";
import { buyBuyable, buyMaxBuyable } from "../upgrades";
import { usePlayer } from "../player/playerStore";

function AmplifluxUpgrade() {
  const {
    setPlayer,
    setCachedPlayer,
    amplifluxUpgradeCost,
    amplifluxUpgradeBulk,
    amplifluxUpgradeEffect,
    amplifluxUpgradeLvl
  } = usePlayer((state) => ({
    setPlayer: state.setPlayer,
    setCachedPlayer: state.setCachedPlayer,
    ampliflux: state.player.ampliflux,
    amplifluxUpgradeCost: state.cachedPlayer.amplifluxUpgradeCost,
    amplifluxUpgradeBulk: state.cachedPlayer.amplifluxUpgradeBulk,
    amplifluxUpgradeEffect: state.cachedPlayer.amplifluxUpgradeEffect,
    amplifluxUpgradeLvl: state.player.amplifluxUpgradeLvl,
    boughtFifthTierUpgrade: state.player.boughtFifthTierUpgrade
  }));

  function buy(event: React.MouseEvent) {
    event.preventDefault();
    const bought = buyBuyable("ampliflux");
    setPlayer(bought.player);
    setCachedPlayer(bought.cachedPlayer);
  }

  function buyMax() {
    const bought = buyMaxBuyable("ampliflux");
    setPlayer(bought.player);
    setCachedPlayer(bought.cachedPlayer);
  }

  const thereIsABulk = amplifluxUpgradeBulk.greaterThanOrEqualTo(1);

  return (
    <button
      className="buyable group bg-ampliflux-upgrade-bg hover:border-ampliflux-upgrade-hover-border transition-colors-250"
      onClick={buyMax}
      onContextMenu={buy}
    >
      <p className="transition-colors-250 text-ampliflux-upgrade-cost group-hover:text-ampliflux-upgrade-hover-cost">
        Upgrade: {formatWithPlural(amplifluxUpgradeCost, "Ampliflux")}{" "}
        {(amplifluxUpgradeLvl.greaterThanOrEqualTo(1) || thereIsABulk) && (
          <>
            ({format(amplifluxUpgradeLvl, 0)}
            {thereIsABulk ? ` + ${format(amplifluxUpgradeBulk, 0)}` : ""})
          </>
        )}
      </p>
      <p className="text-ampliflux-upgrade-effect">
        Effect: {formatWithPlural(amplifluxUpgradeEffect, "Ampliflux", "x ")}
      </p>
    </button>
  );
}

export default AmplifluxUpgrade;
