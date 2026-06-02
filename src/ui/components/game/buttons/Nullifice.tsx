import { formatEffectOnCurrency } from "@core/format/effect";
import { formatNumber } from "@core/format/number";
import {
  handleDecimalInputOnBlur,
  handleDecimalInputOnChange,
} from "@core/utils/input";
import cn from "@core/utils/tailwind";
import {
  formatCurrencyNameEmptylessPlural,
  pluralizeCurrency,
} from "@game/currencies/utils/format";
import { getCurrencyEffectOn } from "@game/currencies/utils/get";
import { triggerNullifice } from "@game/features/nullifice/utils";
import { getPlayerState } from "@game/player/store";
import { hasUpgradeById } from "@game/upgrades/utils/has";
import Button from "@ui/components/base/Button";
import Input from "@ui/components/base/Input";
import CurrencyContent from "@ui/components/features/CurrencyContent";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import { useCallback, useLayoutEffect, useRef } from "react";
import Paragraph from "../../base/Paragraph";

function Nullifice() {
  const state = usePlayerFields(
    {
      player: ["nullionInput"],
      cachedPlayer: ["nullionInputConverted"],
    },
    { useFormat: true },
  );

  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;

    const processed = handleDecimalInputOnChange(input);
    getPlayerState().setPlayer({ nullionInput: processed });
  }, []);

  const onBlur = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;

    const processed = handleDecimalInputOnBlur(input);
    onChange();
    getPlayerState().setPlayer({ nullionInput: processed });
  }, [onChange]);

  useLayoutEffect(() => {
    onBlur();
    onChange();
  }, [onBlur, onChange]);

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    if (input.value !== state.nullionInput) {
      input.value = state.nullionInput;
      handleDecimalInputOnBlur(input);
      handleDecimalInputOnChange(input);
    }
  }, [state.nullionInput]);

  const isPercentage = state.nullionInput.includes("%");

  return (
    <Button
      className={cn(
        "[background-image:var(--nullifice-gradient-bg)]",
        "border-image-gradient [border-image-source:var(--nullifice-gradient-bg)]",
        "hover:[border-image-source:var(--nullifice-gradient)]",
      )}
      onClick={triggerNullifice}
    >
      <Paragraph>
        <span className="nullifice">Nullifice - </span>
        <span className="nullifice-description">
          sacrifice Nullith Resets to get Nullions that boost Nullith Resets.
          Enter the number or percentage of Nullith Resets you want to sacrifice
        </span>
        <br />
        <br />
        <CurrencyContent
          currencyId="nullions"
          mainTextClassName="nullifice"
          effectClassName="nullifice-description"
          formatType="integerComma"
          passiveGainPriority={false}
          effectNodes={[
            {
              node: ({ player, cachedPlayer }) => {
                const effect = getCurrencyEffectOn(
                  cachedPlayer,
                  "nullions",
                  "madeNullithResets",
                );

                return (
                  <>
                    {formatEffectOnCurrency(effect, "madeNullithResets")}
                    {hasUpgradeById(player, "dertoint_2") && (
                      <>, {pluralizeCurrency("madeTierTimes", effect)}</>
                    )}
                    {hasUpgradeById(player, "dertoint_3") && (
                      <>, {pluralizeCurrency("dertoints", effect)}</>
                    )}
                  </>
                );
              },
            },
          ]}
        />
      </Paragraph>
      <span className="nullifice">
        Sacrifice {formatCurrencyNameEmptylessPlural("madeNullithResets")}:{" "}
      </span>
      <div>
        <Input
          id="nullion-input"
          ref={inputRef}
          autoSize
          onClick={(e) => e.stopPropagation()}
          onChange={onChange}
          onBlur={onBlur}
        />
        {isPercentage && (
          <>
            {" "}
            <span className="nullifice-description">
              ({formatNumber(state.nullionInputConverted)})
            </span>
          </>
        )}
      </div>
    </Button>
  );
}

export default Nullifice;
