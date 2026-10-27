import type {
  UpgradeConfig,
  UpgradeContainerConfig,
} from "@game/upgrades/types";
import type { CSSProperties } from "react";
import { formatNumber } from "@core/format/number";
import { formatWithPlural } from "@core/format/plural";
import { mergeObjects } from "@core/utils/object";
import { capitalizeString } from "@core/utils/string";
import cn from "@core/utils/tailwind";
import { formatCurrencyName } from "@game/currencies/utils/format";
import { getPlayerState } from "@game/player/store";
import { parseValueGetter } from "@game/player/utils";
import { buyUpgrade } from "@game/upgrades/utils/buy";
import { getUpgradeCurrency } from "@game/upgrades/utils/get";
import { hasPreviousUpgrade, hasUpgrade } from "@game/upgrades/utils/has";
import { createUpgradeId } from "@game/upgrades/utils/id";
import {
  hasUpgradeSelection,
  hasUpgradeSelectionById,
} from "@game/upgrades/utils/selector";
import { usePlayer } from "@ui/hooks/usePlayer/main";
import Button from "../base/Button";
import Paragraph from "../base/Paragraph";
import StatusText from "../base/StatusText";

interface Props {
  containerConfig: UpgradeContainerConfig;
  config: UpgradeConfig;
  upgradeNumber: number;
  style?: CSSProperties;
}

function Upgrade({ containerConfig, config, upgradeNumber, style }: Props) {
  const [containerUsePlayer, upgradeUsePlayer] = [
    containerConfig.playerSelector,
    config.playerSelector,
  ];

  const containerId = containerConfig.id;
  const containerNameProperty = containerConfig.name;
  const { previousUpgradeId, cost } = config;

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

      const currency = getUpgradeCurrency(config, containerConfig);
      const currencyValue = mergedPlayer.player[currency];

      const mergedWithOptions = mergeObjects(mergedWithPurchase, {
        hideBoughtUpgrades: mergedPlayer.player.hideBoughtUpgrades,
        canBuy:
          currencyValue.greaterThanOrEqualTo(config.cost) &&
          hasPreviousUpgrade(mergedPlayer, containerId, upgradeNumber, config),
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

    const bought = buyUpgrade(mergedPlayer, containerId, upgradeNumber);
    if (!bought) return;

    setPlayer(bought);
  }

  const isPurchased = hasUpgrade(mergedPlayer, containerId, upgradeNumber);

  const containerName =
    containerNameProperty === "auto" || containerNameProperty === undefined
      ? capitalizeString(containerId)
      : parseValueGetter(containerNameProperty, mergedPlayer);

  const name =
    config.name === "auto" || config.name === undefined
      ? `${containerName} Upgrade ${upgradeNumber}`
      : config.name;
  const description = parseValueGetter(config.description, mergedPlayer);

  const currency = getUpgradeCurrency(config, containerConfig);
  const currencyName = formatCurrencyName(currency);
  const fullCost = currencyName
    ? formatWithPlural(cost, currencyName)
    : `${formatNumber(cost)}`;

  const forceShowValue = config.forceShow ?? containerConfig.forceShow ?? false;
  const shouldForceShow = parseValueGetter(forceShowValue, mergedPlayer);

  const shouldShow = shouldForceShow
    ? true
    : hasPreviousUpgrade(player, containerId, upgradeNumber, config);
  const shouldRender = shouldShow && !(isPurchased && state.hideBoughtUpgrades);

  const costInactive = isPurchased;
  const costSuccess = state.canBuy || costInactive;

  if (!shouldRender) return null;

  return (
    <Button
      className={cn(
        "bg-button-bg max-w-[50em] min-w-[15em] flex-1 rounded-[0.25em] transition-[border-color,background-color]",
        isPurchased &&
          "bg-button-bought cursor-auto select-text hover:border-transparent",
      )}
      disabled={isPurchased}
      onClick={buy}
      aria-label={`Buy ${name}`}
      style={style}
    >
      <Paragraph className="my-2">
        {name}:{" "}
        <StatusText
          active={costSuccess}
          customEnabledClassName={costInactive ? "" : undefined}
          customNode={fullCost}
        />{" "}
        - <span className="text-upgrade-description">{description}</span>
      </Paragraph>
    </Button>
  );
}

export default Upgrade;
