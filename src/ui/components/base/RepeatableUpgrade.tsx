import { hasCurrencyName } from "@game/currencies/utils/has";
import { formatCurrencyName } from "@game/currencies/utils/format";
import { integerFormat } from "@core/format/number";
import { formatWithPlural } from "@core/format/plural";
import { usePlayer } from "@ui/hooks/usePlayer/main";
import { getPlayerState } from "@game/player/store";
import { CachedRepeatableUpgrade } from "@game/player/cached/types";
import {
  CachedRepeatableUpgradeSelector,
  RepeatableUpgradeId,
} from "@game/repeatableUpgrades/types";
import {
  applyRepeatableUpgradeMax,
  applyRepeatableUpgradeSingle,
} from "@game/repeatableUpgrades/utils/apply";
import { getCachedRepeatableUpgradePropsSelection } from "@game/repeatableUpgrades/utils/selector";
import { getRepeatableUpgradeLevelSelection } from "@game/repeatableUpgrades/utils/selector";
import { getRepeatableUpgradeData } from "@game/repeatableUpgrades/utils/get";
import { mergeObjects } from "@core/utils/object";
import Decimal from "break_eternity.js";
import { formatEffect } from "@core/format/effect";
import cn from "@core/utils/tailwind";
import { ClassName, ClassNameProps } from "@core/types/react";
import { capitalizeString } from "@core/utils/string";
import { ReactNode } from "react";
import { ValueGetter } from "@game/player/types";
import { parseValueGetter } from "@game/player/utils";
import { UsePlayerFn } from "@ui/hooks/usePlayer/types";

interface Props<T extends RepeatableUpgradeId> extends ClassNameProps {
  repeatableUpgradeId: T;
  usePlayerSelector?: UsePlayerFn;
  textClassName?: ClassName;
  textChildren?: ValueGetter<ReactNode>;
  effectClassName?: ClassName;
  effectChildren?: (effect: Decimal, affects: string) => React.ReactNode;
}

function RepeatableUpgrade<T extends RepeatableUpgradeId>({
  repeatableUpgradeId,
  usePlayerSelector,
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
      const cachedPlayerSelector = getCachedRepeatableUpgradePropsSelection(
        state,
        repeatableUpgradeId,
        cachedProperties,
      );

      const playerSelector = getRepeatableUpgradeLevelSelection(state, [
        repeatableUpgradeId,
      ]);

      const mainSelection = mergeObjects(cachedPlayerSelector, playerSelector);

      const finalSelection = mergeObjects(
        mainSelection,
        usePlayerSelector?.(state),
      );

      return finalSelection;
    },
    { useFormat: true },
  );

  function useCachedProperty<N extends (typeof cachedProperties)[number]>(
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
  const cost = useCachedProperty("cost");
  const isMaxed = useCachedProperty("maxed");
  const effect = useCachedProperty("effect");
  const bulk = useCachedProperty("bulk");

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
    <button
      className={cn("transition-colors-250", className)}
      onClick={buyMax}
      onContextMenu={buyOnce}
      aria-label={`Buy ${name} Upgrade`}
    >
      <p className={cn("transition-colors-250", textClassName)}>
        Upgrade: {isMaxed ? "Maxed" : fullCost}
        {shouldLevelRender && (
          <>
            {" "}
            ({integerFormat(level)}
            {isThereABulk && ` + ${integerFormat(bulk)}`})
          </>
        )}
        {computedTextChildren}
      </p>
      <p className={cn("mt-0", effectClassName)}>Effect: {effectNode}</p>
    </button>
  );
}

export default RepeatableUpgrade;
