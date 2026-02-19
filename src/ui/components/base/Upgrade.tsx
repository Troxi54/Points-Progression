import { formatCurrencyName } from "@/game/currencies/utils/format";
import { formatNumber } from "@/core/format/number";
import { formatWithPlural } from "@/core/format/plural";
import { usePlayer } from "@ui/hooks/usePlayer/main";
import { getPlayerState } from "@/game/player/store/store";
import { parseValueGetter } from "@/game/player/utils";
import { UpgradeData, UpgradeDataContainer } from "@/game/upgrades/types";
import { applyBoughtUpgrade } from "@/game/upgrades/utils/apply";
import { hasUpgradeSelectionById } from "@/game/upgrades/utils/selector";
import { hasUpgradeSelection } from "@/game/upgrades/utils/selector";
import { hasPreviousUpgrade } from "@/game/upgrades/utils/has";
import { hasUpgrade } from "@/game/upgrades/utils/has";
import { createUpgradeId } from "@/game/upgrades/utils/id";
import { mergeObjects } from "@/core/utils/object";
import { getUpgradeCurrency } from "@/game/upgrades/utils/get";
import cn from "@/core/utils/tailwind";
import StatusText from "./StatusText";
import { CSSProperties } from "react";
import { capitalizeString } from "@/core/utils/string";

type Props = {
  upgradeContainerData: UpgradeDataContainer;
  upgradeData: UpgradeData;
  upgradeNumber: number;
  style?: CSSProperties;
};

function Upgrade({
  upgradeContainerData,
  upgradeData,
  upgradeNumber,
  style,
}: Props) {
  const [containerUsePlayer, upgradeUsePlayer] = [
    upgradeContainerData.usePlayer,
    upgradeData.usePlayer,
  ];

  const containerId = upgradeContainerData.id;
  const containerNameProperty = upgradeContainerData.name;
  const { previousUpgradeId, cost } = upgradeData;

  const shouldSubscribeToPreviousUpgrade =
    previousUpgradeId || upgradeNumber > 1;

  const state = usePlayer(
    (state) => {
      const { mergedPlayer } = state;

      const containerSelector = containerUsePlayer?.(state);
      const upgradeSelector = upgradeUsePlayer?.(state);

      const upgradesSelector = mergeObjects(containerSelector, upgradeSelector);
      const mergedWithPurchase = mergeObjects(
        upgradesSelector,
        hasUpgradeSelection(state, containerId, upgradeNumber),
      );

      const currency = getUpgradeCurrency(upgradeData, upgradeContainerData);
      const currencyValue = mergedPlayer.player[currency];

      const mergedWithOptions = mergeObjects(mergedWithPurchase, {
        hideBoughtUpgrades: mergedPlayer.player.hideBoughtUpgrades,
        canBuy:
          currencyValue.greaterThanOrEqualTo(upgradeData.cost) &&
          hasPreviousUpgrade(
            mergedPlayer,
            containerId,
            upgradeNumber,
            upgradeData,
          ),
      });

      let fullSelector = mergedWithOptions;

      if (shouldSubscribeToPreviousUpgrade) {
        const id =
          previousUpgradeId ?? createUpgradeId(containerId, upgradeNumber - 1);
        fullSelector = mergeObjects(
          fullSelector,
          hasUpgradeSelectionById(state, id),
        );
      }

      return fullSelector;
    },
    { useFormat: true },
  );

  const { player, mergedPlayer } = getPlayerState();

  function buy() {
    const { mergedPlayer, setPlayer } = getPlayerState();

    const bought = applyBoughtUpgrade(
      mergedPlayer,
      containerId,
      upgradeNumber,
      upgradeData,
      upgradeContainerData,
    );
    if (!bought) return;

    setPlayer(bought);
  }

  function contextMenu(e: React.MouseEvent) {
    e.preventDefault();
    buy();
  }

  const isPurchased = hasUpgrade(mergedPlayer, containerId, upgradeNumber);

  const containerName =
    containerNameProperty === "auto" || containerNameProperty === undefined
      ? capitalizeString(containerId)
      : parseValueGetter(containerNameProperty, mergedPlayer);

  const name =
    upgradeData.name === "auto" || upgradeData.name === undefined
      ? `${containerName} Upgrade ${upgradeNumber}`
      : upgradeData.name;
  const description = parseValueGetter(upgradeData.description, mergedPlayer);

  const currency = getUpgradeCurrency(upgradeData, upgradeContainerData);
  const currencyName = formatCurrencyName(currency);
  const fullCost = currencyName
    ? formatWithPlural(cost, currencyName)
    : `${formatNumber(cost)}`;

  const forceShowValue =
    upgradeData.forceShow ?? upgradeContainerData.forceShow ?? false;
  const shouldForceShow = parseValueGetter(forceShowValue, mergedPlayer);

  const shouldShow = shouldForceShow
    ? true
    : hasPreviousUpgrade(player, containerId, upgradeNumber, upgradeData);
  const shouldRender = shouldShow && !(isPurchased && state.hideBoughtUpgrades);

  const costInactive = isPurchased;
  const costSuccess = state.canBuy || costInactive;

  return (
    shouldRender && (
      <button
        className={cn("upgrade", isPurchased && "bought")}
        onClick={buy}
        onContextMenu={contextMenu}
        aria-label={`Buy ${name}`}
        style={style}
      >
        <p className="my-2">
          {name}:{" "}
          <StatusText
            active={costSuccess}
            customEnabledClassName={costInactive ? "" : undefined}
            customNode={fullCost}
          />{" "}
          - <span className="text-upgrade-description">{description}</span>
        </p>
      </button>
    )
  );
}

export default Upgrade;
