import { Upgrade } from "../upgrades";
import { format, formatWithPlural } from "../format";
import { usePlayer, usePlayerStore } from "../player/playerStore";
import { settings } from "../player/settings";
import { useRef } from "react";
import { mergePlayer } from "../player/playerUtils";

interface props {
  id: string;
  upgrades: Upgrade[];
  classNames?: string;
}

const currencyNames: Record<string, string> = {
  points: "",
  vermytes: " Vermyte",
  dertoints: " Dertoint",
  mallirtTotalDertoints: " Mallirt Total Dertoint"
};

function UpgradeContainer({ id, upgrades, classNames }: props) {
  const { player, cachedPlayer, setPlayer } = usePlayer((state) => ({
    player: state.player,
    cachedPlayer: state.cachedPlayer,
    setPlayer: state.setPlayer
  }));

  const mergedPlayer = useRef(mergePlayer(player, cachedPlayer));

  function buy(upgrade: Upgrade, previousUpgrade: Upgrade | null = null) {
    const newPlayer = usePlayerStore.getState().player;

    const currency = newPlayer[upgrade.currency];
    const cost = settings[upgrade.cost];

    let boughtPreviousUpgrade = false;
    if (upgrade.previousUpgradeFromAnotherContainerBoughtName) {
      boughtPreviousUpgrade =
        newPlayer[upgrade.previousUpgradeFromAnotherContainerBoughtName];
    } else {
      boughtPreviousUpgrade =
        !previousUpgrade || newPlayer[previousUpgrade.isBoughtName];
    }
    if (
      newPlayer[upgrade.isBoughtName] ||
      currency.lessThan(cost) ||
      !boughtPreviousUpgrade
    )
      return;

    setPlayer({
      [upgrade.isBoughtName]: true,
      [upgrade.currency]: upgrade.takesCurrency(player)
        ? currency.minus(cost)
        : currency
    });
  }

  function contextMenu(
    e: React.MouseEvent,
    upgrade: Upgrade,
    previousUpgrade: Upgrade | null = null
  ) {
    e.preventDefault();
    buy(upgrade, previousUpgrade);
  }

  function getPreviousUpgrade(currentIndex: number) {
    if (currentIndex === 0) return null;
    return upgrades[currentIndex - 1];
  }

  const visibleUpgrades = upgrades.filter(
    (upgrade) =>
      upgrade.show(player) &&
      (!player[upgrade.isBoughtName] || !player.hideBoughtUpgrades)
  );

  return (
    visibleUpgrades.length > 0 && (
      <div id={id} className={"upgrade-container " + classNames}>
        {upgrades.map((upgrade, index) =>
          upgrade.show(player) &&
          (!player[upgrade.isBoughtName] || !player.hideBoughtUpgrades) ? (
            <button
              className={
                (upgrade.visual === "dertoint" ? "dertoint-upgrade" : "") +
                (player[upgrade.isBoughtName] ? " bought-upgrade" : "")
              }
              onClick={() => buy(upgrade, getPreviousUpgrade(index))}
              onContextMenu={(e) =>
                contextMenu(e, upgrade, getPreviousUpgrade(index))
              }
              key={upgrade.id}
            >
              <p>
                {upgrade.name}:{" "}
                {currencyNames[upgrade.currency]
                  ? formatWithPlural(
                      settings[upgrade.cost],
                      currencyNames[upgrade.currency]
                    )
                  : `${format(settings[upgrade.cost])} ${
                      upgrade.currency
                    }`}{" "}
                -{" "}
                <span className="text-buyable-once-upgrade-effect">
                  {typeof upgrade.description === "function"
                    ? upgrade.description(mergedPlayer.current)
                    : upgrade.description}
                </span>
              </p>
            </button>
          ) : null
        )}
      </div>
    )
  );
}

export default UpgradeContainer;
