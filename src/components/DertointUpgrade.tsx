import { format } from "@/format";
import { buyBuyable, buyMaxBuyable } from "@/upgrades";
import { usePlayer } from "@player/playerStore";

function DertointUpgrade() {
  const {
    setPlayer,
    setCachedPlayer,
    dertointUpgradeCost,
    dertointUpgradeLvl,
    dertointUpgradeBulk,
    dertointUpgradeEffect
  } = usePlayer((state) => ({
    setPlayer: state.setPlayer,
    setCachedPlayer: state.setCachedPlayer,
    dertointUpgradeCost: state.cachedPlayer.dertointUpgradeCost,
    dertointUpgradeLvl: state.player.dertointUpgradeLvl,
    dertointUpgradeBulk: state.cachedPlayer.dertointUpgradeBulk,
    dertointUpgradeEffect: state.cachedPlayer.dertointUpgradeEffect
  }));

  function buy(event: React.MouseEvent) {
    event.preventDefault();
    const bought = buyBuyable("dertoint");
    setPlayer(bought.player);
    setCachedPlayer(bought.cachedPlayer);
  }
  function buyMax() {
    const bought = buyMaxBuyable("dertoint");
    setPlayer(bought.player);
    setCachedPlayer(bought.cachedPlayer);
  }

  const thereIsABulk = dertointUpgradeBulk.greaterThanOrEqualTo(1);

  return (
    <button
      className="buyable group bg-linear-to-r from-sliph-bg-1 to-sliph-bg-2 border-image-gradient [border-image-source:var(--sliph-gradient-bg)] hover:[border-image-source:var(--sliph-gradient)] transition-colors-250"
      onClick={buyMax}
      onContextMenu={buy}
      aria-label="Buy Dertoint upgrade"
    >
      <p className="w-fit sliph">
        Upgrade: {format(dertointUpgradeCost)} Dertoints{" "}
        {(dertointUpgradeLvl.greaterThanOrEqualTo(1) || thereIsABulk) && (
          <>
            ({format(dertointUpgradeLvl, 0)}
            {thereIsABulk ? ` + ${format(dertointUpgradeBulk, 0)}` : ""})
          </>
        )}
      </p>
      <p className="text-gradient bg-linear-to-r from-dertoint-upgrade-effect-1 to-dertoint-upgrade-effect-2">
        Effect: {format(dertointUpgradeEffect)}x Dertoints
      </p>
    </button>
  );
}

export default DertointUpgrade;
