import { useLayoutEffect, useRef } from "react";
import {
  formatWithPlural,
  integerFormat,
  integerFormatWithPlural
} from "@/format";
import { usePlayer, usePlayerStore } from "@player/playerStore";
import { convertNullithResetsIntoNullions } from "@/playerActions";
import pluralize from "pluralize";
import {
  handleDecimalInputOnBlur,
  handleDecimalInputOnChange
} from "@utils/inputUtils";

function onBlur(input: React.FocusEvent<HTMLInputElement> | HTMLInputElement) {
  let processedInput;

  if (input instanceof HTMLInputElement)
    processedInput = handleDecimalInputOnBlur(input);
  else processedInput = handleDecimalInputOnBlur(input.currentTarget);
  onChange(input);

  const { setPlayer } = usePlayerStore.getState();
  setPlayer({
    nullionInput: processedInput
  });
}

function onChange(
  input: React.ChangeEvent<HTMLInputElement> | HTMLInputElement
) {
  let processedInput;

  if (input instanceof HTMLInputElement)
    processedInput = handleDecimalInputOnChange(input);
  else processedInput = handleDecimalInputOnChange(input.currentTarget);

  const { setPlayer } = usePlayerStore.getState();
  setPlayer({
    nullionInput: processedInput
  });
}

function Nullifice() {
  const {
    nullions,
    nullionGain,
    nullionEffect,
    nullionInput,
    nullionInputConverted,
    boughtSecondDertointUpgrade,
    boughtThirdDertointUpgrade
  } = usePlayer((state) => ({
    nullions: state.player.nullions,
    nullionGain: state.cachedPlayer.nullionGain,
    nullionEffect: state.cachedPlayer.nullionEffect,
    nullionInput: state.player.nullionInput,
    nullionInputConverted: state.cachedPlayer.nullionInputConverted,
    boughtSecondDertointUpgrade: state.player.boughtSecondDertointUpgrade,
    boughtThirdDertointUpgrade: state.player.boughtThirdDertointUpgrade
  }));

  const inputRef = useRef<HTMLInputElement>(null);

  const nullionInputRef = useRef<string>(nullionInput);

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.value = nullionInputRef.current;
      onBlur(inputRef.current);
      onChange(inputRef.current);
    }
  }, [inputRef]);

  const isPercentage = nullionInput.includes("%");

  const tierResetString = pluralize("Tier Reset", +nullionEffect);
  const dertointString = pluralize("Dertoint", +nullionEffect);

  return (
    <button
      className="bg-linear-to-r from-nullifice-bg-1 to-nullifice-bg-2 border-image-gradient [border-image-source:var(--nullifice-gradient-bg)] hover:[border-image-source:var(--nullifice-gradient)]"
      onClick={convertNullithResetsIntoNullions}
      aria-label="Convert Nullith Resets into Nullions"
    >
      <p>
        <span className="nullifice">Nullifice - </span>
        <span className="nullifice-description">
          sacrifice Nullith Resets to get Nullions that boost Nullith Resets.
          Enter the number or percentage of Nullith Resets you want to sacrifice
        </span>
        <br />

        <br />
        <span className="nullifice">
          Nullions: {integerFormat(nullions)} -{" "}
        </span>
        <span className="nullifice-description">
          Effect: {formatWithPlural(nullionEffect, "Nullith Reset", "x ")}
          {boughtThirdDertointUpgrade
            ? `, ${tierResetString} and ${dertointString}`
            : boughtSecondDertointUpgrade
            ? ` and ${tierResetString}`
            : ""}
        </span>
      </p>
      <span className="nullifice">
        Sacrifice {isPercentage && "("}
        <input
          id="nullifice-input"
          ref={inputRef}
          type="text"
          onClick={(e) => e.stopPropagation()}
          onBlur={onBlur}
          onChange={onChange}
          aria-label="Enter Nullith Resets to sacrifice"
        />{" "}
        {isPercentage
          ? `= ${integerFormatWithPlural(
              nullionInputConverted,
              "Nullith Reset"
            )}) `
          : `${pluralize("Nullith Reset", +nullionInputConverted)}`}{" "}
        for {integerFormatWithPlural(nullionGain, "Nullion")}
      </span>
    </button>
  );
}

export default Nullifice;
