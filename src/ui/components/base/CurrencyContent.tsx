import { ClassName } from "@/core/types/react";
import { CurrencyId } from "@/game/currencies/types";
import { formatCurrencyNameEmptyless } from "@/game/currencies/utils/format";
import { getCurrencyData } from "@/game/currencies/utils/get";
import { parseNumberFormat } from "@/core/format/number";
import { usePlayer } from "@/ui/hooks/usePlayer";
import { getPlayerState } from "@/game/player/store/store";
import { UsePlayerFn } from "@/ui/hooks/usePlayerTypes";
import { BooleanGetter, ValueGetter } from "@/game/player/types";
import { parseValueGetter } from "@/game/player/utils";
import { mergeObjects, objectEntries } from "@/core/utils/object";
import { plural } from "pluralize";
import { ReactNode } from "react";
import { FormatNumberType } from "@/core/format/types";
import { isDecimal } from "@/core/utils/decimal";
import Decimal from "break_eternity.js";
import { arrayLastIndex, isEmpty } from "@/core/utils/array";

interface EffectNode {
  className?: string;
  works?: BooleanGetter;
  node: ValueGetter<ReactNode>;
}

export interface CurrencyComponentProps {
  children?: ValueGetter<ReactNode>;
  currencyId: CurrencyId;
  usePlayerSelector?: UsePlayerFn;
  passiveGainPriority?: BooleanGetter;
  effectClassName?: ClassName;
  effectNodes?: EffectNode[];
  preEffectChildren?: ValueGetter<ReactNode>;
  textClassName?: ClassName;
  mainTextClassName?: ClassName;
  formatType?: FormatNumberType;
}

function CurrencyContent({
  currencyId,
  usePlayerSelector,
  passiveGainPriority,
  effectClassName,
  effectNodes,
  preEffectChildren,
  textClassName,
  mainTextClassName,
  children,
  formatType
}: CurrencyComponentProps) {
  const currencyData = getCurrencyData(currencyId);
  if (!currencyData) return null;

  const state = usePlayer(
    (state) => {
      const cachedCurrencyData =
        state.mergedPlayer.cachedPlayer.currencies[currencyId];

      const effect = cachedCurrencyData?.effect;

      let currencySelection = {
        currencyValue: state.mergedPlayer.player[currencyId],
        currencyGain: cachedCurrencyData?.gain,
        currencyPassiveGain: cachedCurrencyData?.passiveGain,
        currencyEffect: effect
      };

      if (effect && !isDecimal(effect)) {
        const effectSelection = {} as Partial<
          Record<`currencyEffect_${CurrencyId}`, Decimal>
        >;
        for (const [key, value] of objectEntries(effect)) {
          effectSelection[`currencyEffect_${key}`] = value;
        }

        currencySelection = mergeObjects(currencySelection, effectSelection);
      }

      const finalSelection = mergeObjects(
        currencySelection,
        usePlayerSelector?.(state)
      );

      return finalSelection;
    },
    { useFormat: true }
  );

  const { currencyValue, currencyGain, currencyPassiveGain } = state;

  const { mergedPlayer } = getPlayerState();

  const passiveGainWorks = parseValueGetter(
    currencyData.passiveGainWorks,
    mergedPlayer
  );

  const currencyName = formatCurrencyNameEmptyless(currencyId);
  const currencyNamePlural = plural(currencyName);

  const formattedValue = parseNumberFormat(currencyValue, formatType);

  const passiveGainNodeCondition =
    passiveGainWorks && currencyPassiveGain && currencyPassiveGain.notEquals(0);
  const passiveGainNode =
    passiveGainNodeCondition &&
    ` (+${parseNumberFormat(currencyPassiveGain, formatType)}/s)`;

  const onlyPassiveGain =
    passiveGainPriority === undefined
      ? passiveGainNodeCondition
      : parseValueGetter(passiveGainPriority, mergedPlayer);

  const gainNodeCondition =
    !onlyPassiveGain && currencyGain && currencyGain.notEquals(0);
  const gainNode =
    gainNodeCondition && ` (+${parseNumberFormat(currencyGain, formatType)})`;

  const filteredEffectNodes: EffectNode[] = [];
  if (effectNodes) {
    for (const effect of effectNodes) {
      if (effect.works !== undefined) {
        const works = parseValueGetter(effect.works, mergedPlayer);
        if (!works) continue;
      }

      filteredEffectNodes.push(effect);
    }
  }

  const thereAreEffects = !isEmpty(filteredEffectNodes);
  const processedEffectClassName = effectClassName ?? "text-effect";

  return (
    <span className={textClassName}>
      <span className={mainTextClassName}>
        {currencyNamePlural}: {formattedValue}
        {gainNode}
        {passiveGainNode}
        {parseValueGetter(preEffectChildren, mergedPlayer)}
        {thereAreEffects && " - "}
      </span>
      {thereAreEffects && (
        <span className={processedEffectClassName}>
          Effect:{" "}
          {filteredEffectNodes.map((effect, index) => {
            const node = parseValueGetter(effect.node, mergedPlayer);

            return (
              <span key={index} className={effect.className}>
                {node}
                {filteredEffectNodes.length > 1 &&
                  index < arrayLastIndex(filteredEffectNodes) &&
                  ", "}
              </span>
            );
          })}
        </span>
      )}
      {parseValueGetter(children, mergedPlayer)}
    </span>
  );
}

export default CurrencyContent;
