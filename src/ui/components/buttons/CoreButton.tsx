import { formatWithPlural } from "@/core/format/plural";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import coreConfig from "@/game/features/cores/config";
import { getCachedCurrencyPropSelection } from "@/game/currencies/utils/selector";
import { convertEnergyIntoCores } from "@/game/features/cores/utils";
import { formatCurrency } from "@/game/currencies/utils/format";

function CoreButton() {
  const state = usePlayerFields(
    {
      player: ["everReachedCores"],
    },
    {
      additionalSelectors: (state) =>
        getCachedCurrencyPropSelection(state, "cores", "gain"),
      useFormat: true,
    },
  );

  return (
    <button
      id="cores-button"
      className="bg-core-bg"
      onClick={convertEnergyIntoCores}
      aria-label="Convert energy into cores"
    >
      <p id="cores-info">
        {state.everReachedCores ? (
          <>
            <span className="text-core-description">
              Converts energy into cores and resets energy reactors
            </span>
            <br />
            Gain {formatWithPlural(state.cachedCurrency_cores_gain, "Core")}
          </>
        ) : (
          <>
            You need {formatCurrency(coreConfig.unlocksAt, "energy")} for this
          </>
        )}
      </p>
    </button>
  );
}

export default CoreButton;
