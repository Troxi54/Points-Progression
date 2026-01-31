import { useLayoutEffect, useRef } from "react";
import { integerFormatWithPlural } from "@/core/format/plural";
import pluralize from "pluralize";
import {
  handleDecimalInputOnBlur,
  handleDecimalInputOnChange
} from "@/core/utils/input";
import { usePlayerFields } from "@/ui/hooks/usePlayer";
import { getPlayerState } from "@/game/player/store/store";
import { hasUpgradeById } from "@/game/upgrades/utils/has";
import { getCurrencyEffectFor } from "@/game/currencies/utils/get";
import { triggerNullifice } from "@/game/features/nullifice/utils";
import cn from "@/core/utils/tailwind";
import CurrencyContent from "@/ui/components/base/CurrencyContent";
import { pluralizeCurrency } from "@/game/currencies/utils/format";
import { formatEffectForCurrency } from "@/core/format/effect";

function Nullifice() {
  const state = usePlayerFields(
    {
      player: ["nullions", "nullionInput"],
      cachedPlayer: ["nullionInputConverted"]
    },
    { useFormat: true }
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => {
    onBlur();
    onChange();
  }, [inputRef.current]);

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

  function onChange() {
    const input = inputRef.current;
    if (!input) return;

    const processed = handleDecimalInputOnChange(input);
    getPlayerState().setPlayer({ nullionInput: processed });
  }

  function onBlur() {
    const input = inputRef.current;
    if (!input) return;

    const processed = handleDecimalInputOnBlur(input);
    onChange();
    getPlayerState().setPlayer({ nullionInput: processed });
  }

  return (
    <button
      className={cn(
        "[background-image:var(--nullifice-gradient-bg)]",
        "border-image-gradient [border-image-source:var(--nullifice-gradient-bg)]",
        "hover:[border-image-source:var(--nullifice-gradient)]"
      )}
      onClick={triggerNullifice}
    >
      <p>
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
                const effect = getCurrencyEffectFor(
                  cachedPlayer,
                  "nullions",
                  "madeNullithResets"
                );

                return (
                  <>
                    {formatEffectForCurrency(effect, "madeNullithResets")}
                    {hasUpgradeById(player, "dertoint_2") && (
                      <>, {pluralizeCurrency("madeTierTimes", effect)}</>
                    )}
                    {hasUpgradeById(player, "dertoint_3") && (
                      <>, {pluralizeCurrency("dertoints", effect)}</>
                    )}
                  </>
                );
              }
            }
          ]}
        />
      </p>

      <span className="nullifice">
        Sacrifice{" "}
        <input
          id="nullion-input"
          ref={inputRef}
          type="text"
          className="auto-input"
          onClick={(e) => e.stopPropagation()}
          onChange={onChange}
          onBlur={onBlur}
        />{" "}
        {isPercentage
          ? `= ${integerFormatWithPlural(
              state.nullionInputConverted,
              "Nullith Reset"
            )}`
          : pluralize("Nullith Reset", +state.nullionInputConverted)}
      </span>
    </button>
  );
}

export default Nullifice;
