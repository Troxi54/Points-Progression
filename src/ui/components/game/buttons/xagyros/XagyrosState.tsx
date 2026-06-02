import type { ClassName, ClassNameProps } from "@core/types/react";
import type { CurrencyId } from "@game/currencies/types";
import type { XagyrosState } from "@game/features/xagyrosStates/types";
import cn from "@core/utils/tailwind";
import { formatCurrencyEffect } from "@game/currencies/utils/format";
import { getCurrencyData } from "@game/currencies/utils/get";
import { activateXagyrosState } from "@game/features/xagyrosStates/utils/apply";
import {
  getXagyrosStateCurrencyId,
  isXagyrosStateActive,
} from "@game/features/xagyrosStates/utils/get";
import { getPlayerState } from "@game/player/store";
import Button from "@ui/components/base/Button";
import Heading from "@ui/components/base/Heading";
import CurrencyContent from "@ui/components/features/CurrencyContent";

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
    <Button
      className={cn("min-w-[15em] flex-1", className)}
      onClick={() => activate(state)}
    >
      <Heading
        level={3}
        className={cn(textClassName)}
        style={{
          textDecoration: isActive ? "underline" : "none",
        }}
      >
        {title}
      </Heading>
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
    </Button>
  );
}

export default XagyrosStateComponent;
