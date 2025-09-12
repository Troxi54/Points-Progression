import { format, formatWithPlural } from "@/format";
import { buyBuyable, buyMaxBuyable } from "@/upgrades";
import { usePlayer } from "@player/playerStore";

function CoreUpgrade() {
  const {
    setPlayer,
    setCachedPlayer,
    isCoreUpgradeMaxed,
    coreUpgradeCost,
    coreUpgradeBulk,
    coreUpgradeEffect,
    coreUpgradeLvl
  } = usePlayer((state) => ({
    setPlayer: state.setPlayer,
    setCachedPlayer: state.setCachedPlayer,
    isCoreUpgradeMaxed: state.cachedPlayer.isCoreUpgradeMaxed,
    coreUpgradeCost: state.cachedPlayer.coreUpgradeCost,
    coreUpgradeBulk: state.cachedPlayer.coreUpgradeBulk,
    coreUpgradeEffect: state.cachedPlayer.coreUpgradeEffect,
    coreUpgradeLvl: state.player.coreUpgradeLvl
  }));

  function buy(event: React.MouseEvent) {
    event.preventDefault();
    const bought = buyBuyable("core");
    setPlayer(bought.player);
    setCachedPlayer(bought.cachedPlayer);
  }

  function buyMax() {
    const bought = buyMaxBuyable("core");
    setPlayer(bought.player);
    setCachedPlayer(bought.cachedPlayer);
  }

  const thereIsABulk = coreUpgradeBulk.greaterThanOrEqualTo(1);

  return (
    <button
      className="buyable bg-core-bg"
      onClick={buyMax}
      onContextMenu={buy}
      aria-label="Buy Core upgrade"
    >
      <p>
        Upgrade:{" "}
        {isCoreUpgradeMaxed ? (
          "Maxed"
        ) : (
          <>{formatWithPlural(coreUpgradeCost, "Core")}</>
        )}{" "}
        {(coreUpgradeLvl.greaterThanOrEqualTo(1) || thereIsABulk) && (
          <span>
            ({format(coreUpgradeLvl, 0)}
            {thereIsABulk ? ` + ${format(coreUpgradeBulk, 0)}` : ""})
          </span>
        )}
      </p>
      <p className="text-core-upgrade-effect">
        Effect: x<sup>{format(coreUpgradeEffect)}</sup> best points effect
      </p>
    </button>
  );
}

export default CoreUpgrade;
