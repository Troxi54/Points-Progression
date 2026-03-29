import { ClassName, ClassNameProps } from "@core/types/react";
import cn from "@core/utils/tailwind";
import { CurrencyId } from "@game/currencies/types";
import { formatCurrencyEffect } from "@game/currencies/utils/format";
import { getCurrencyData } from "@game/currencies/utils/get";
import { XagyrosState } from "@game/features/xagyrosStates/types";
import { activateXagyrosState } from "@game/features/xagyrosStates/utils/apply";
import {
  getXagyrosStateCurrencyId,
  isXagyrosStateActive,
} from "@game/features/xagyrosStates/utils/get";
import { getPlayerState } from "@game/player/store";
import CurrencyContent from "@ui/components/base/CurrencyContent";

interface Props extends ClassNameProps {
  state: XagyrosState;
  title: string;
  textClassName?: ClassName;
  effectClassName?: ClassName;
}

function XagyrosStateComponent({
  state,
  title,
  className,
  textClassName,
  effectClassName,
}: Props) {
  const currencyId = getXagyrosStateCurrencyId(state);
  const affects = getCurrencyData(currencyId).affects as CurrencyId;

  const { mergedPlayer } = getPlayerState();

  const isActive = isXagyrosStateActive(mergedPlayer, state);

  function activate(state: XagyrosState) {
    const { mergedPlayer, setMergedPlayer } = getPlayerState();

    const activated = activateXagyrosState(mergedPlayer, state);
    if (!activated) return;

    setMergedPlayer(activated);
  }

  return (
    <button
      className={cn("flex-1 min-w-[15em]", className)}
      onClick={() => activate(state)}
    >
      <h2
        className={cn(textClassName)}
        style={{
          textDecoration: isActive ? "underline" : "none",
        }}
      >
        {title}
      </h2>
      <CurrencyContent
        currencyId={currencyId}
        mainTextClassName={textClassName}
        effectClassName={effectClassName}
        effectNodes={[
          {
            node: ({ cachedPlayer }) =>
              formatCurrencyEffect(cachedPlayer, currencyId, affects),
          },
        ]}
      />
    </button>
  );
}

export default XagyrosStateComponent;
