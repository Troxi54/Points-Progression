import type { ClassName, ClassNameProps } from "@core/types/react";
import type { CachedRepeatableUpgrade } from "@game/player/cached/types";
import type { ValueGetter } from "@game/player/types";
import type {
  CachedRepeatableUpgradeSelector,
  RepeatableUpgradeId,
} from "@game/repeatableUpgrades/types";
import type { PlayerSelectorFn } from "@ui/hooks/usePlayer/types";
import type Decimal from "break_eternity.js";
import type { ReactNode } from "react";
import { formatEffect } from "@core/format/effect";
import { integerFormat } from "@core/format/number";
import { formatWithPlural } from "@core/format/plural";
import { mergeObjects } from "@core/utils/object";
import { capitalizeString } from "@core/utils/string";
import cn from "@core/utils/tailwind";
import { formatCurrencyName } from "@game/currencies/utils/format";
import { hasCurrencyName } from "@game/currencies/utils/has";
import { getPlayerState } from "@game/player/store";
import { parseValueGetter } from "@game/player/utils";
import {
  applyRepeatableUpgradeMax,
  applyRepeatableUpgradeSingle,
} from "@game/repeatableUpgrades/utils/apply";
import { getRepeatableUpgradeData } from "@game/repeatableUpgrades/utils/get";
import {
  getCachedRepeatableUpgradePropsSelection,
  getRepeatableUpgradeLevelSelection,
} from "@game/repeatableUpgrades/utils/selector";
import { usePlayer } from "@ui/hooks/usePlayer/main";
import Text from "../base/Text";
import Button from "../base/Button";

interface Props<T extends RepeatableUpgradeId> extends ClassNameProps {
  repeatableUpgradeId: T;
  playerSelector?: PlayerSelectorFn;
  textClassName?: ClassName;
  textChildren?: ValueGetter<ReactNode>;
  effectClassName?: ClassName;
  effectChildren?: (effect: Decimal, affects: string) => React.ReactNode;
}

function RepeatableUpgrade<T extends RepeatableUpgradeId>({
  repeatableUpgradeId,
  playerSelector,
  className,
  textChildren,
  textClassName,
  effectClassName,
  effectChildren,
}: Props<T>) {
  const cachedProperties: (keyof CachedRepeatableUpgrade)[] = [
    "bulk",
    "cost",
    "effect",
    "maxed",
  ] as const;

  const state = usePlayer(
    (state) => {
      const cachedPlayerSelection = getCachedRepeatableUpgradePropsSelection(
        state,
        repeatableUpgradeId,
        cachedProperties,
      );

      const playerSelection = getRepeatableUpgradeLevelSelection(state, [
        repeatableUpgradeId,
      ]);

      const mainSelection = mergeObjects(
        cachedPlayerSelection,
        playerSelection,
      );

      const finalSelection = mergeObjects(
        mainSelection,
        playerSelector?.(state),
      );

      return finalSelection;
    },
    { useFormat: true },
  );

  function getCachedProperty<N extends (typeof cachedProperties)[number]>(
    propertyName: N,
  ) {
    const key: CachedRepeatableUpgradeSelector<T, N> =
      `cachedRepeatableUpgrade_${repeatableUpgradeId}_${propertyName}`;
    return (state as Record<string, any>)[key];
  }

  function buyOnce(event: React.MouseEvent) {
    event.preventDefault();

    const { mergedPlayer, setMergedPlayer } = getPlayerState();
    const purchased = applyRepeatableUpgradeSingle(
      mergedPlayer,
      repeatableUpgradeId,
    );
    setMergedPlayer(purchased);
  }

  function buyMax() {
    const { mergedPlayer, setMergedPlayer } = getPlayerState();
    const purchased = applyRepeatableUpgradeMax(
      mergedPlayer,
      repeatableUpgradeId,
    );
    setMergedPlayer(purchased);
  }

  const { mergedPlayer } = getPlayerState();

  const level = state[`repeatableUpgrade_${repeatableUpgradeId}`];
  const cost = getCachedProperty("cost");
  const isMaxed = getCachedProperty("maxed");
  const effect = getCachedProperty("effect");
  const bulk = getCachedProperty("bulk");

  const upgradeData = getRepeatableUpgradeData(repeatableUpgradeId);

  const name = capitalizeString(repeatableUpgradeId);
  const { currency, affects } = upgradeData;

  const currencyName = formatCurrencyName(currency);
  const fullCost = formatWithPlural(cost, currencyName);

  const isThereABulk = bulk?.greaterThanOrEqualTo(1);
  const shouldLevelRender = level?.greaterThanOrEqualTo(1) || isThereABulk;

  const computedTextChildren = parseValueGetter(textChildren, mergedPlayer);

  const affectText = hasCurrencyName(affects)
    ? formatCurrencyName(affects)
    : affects;

  const effectNode =
    effectChildren === undefined
      ? formatEffect(effect, affectText)
      : effectChildren(effect, affectText);

  return (
    <Button
      className={cn("transition-colors duration-250", className)}
      onClick={buyMax}
      onContextMenu={buyOnce}
      aria-label={`Buy ${name} Upgrade`}
    >
      <Text
        className={cn(
          "transition-colors duration-250",
          textClassName,
        )}
      >
        Upgrade: {isMaxed ? "Maxed" : fullCost}
        {shouldLevelRender && (
          <>
            {" "}
            ({integerFormat(level)}
            {isThereABulk && ` + ${integerFormat(bulk)}`})
          </>
        )}
        {computedTextChildren}
      </Text>
      <Text className={cn("mt-0", effectClassName)}>Effect: {effectNode}</Text>
    </Button>
  );
}

export default RepeatableUpgrade;
