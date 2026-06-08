import { formatWithPlural } from "@core/format/plural";
import { formatCurrency } from "@game/currencies/utils/format";
import { getCachedCurrencyPropSelection } from "@game/currencies/utils/selector";
import coreConfig from "@game/features/cores/config";
import { convertEnergyIntoCores } from "@game/features/cores/utils";
import Button from "@ui/components/base/Button";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import Paragraph from "../../base/Paragraph";

function CoreButton() {
  const state = usePlayerFields(
    {
      player: ["everReachedCores"],
    },
    {
      selector: (state) =>
        getCachedCurrencyPropSelection(state, "cores", "gain"),
      useFormat: true,
    },
  );

  return (
    <Button
      id="cores-button"
      className="bg-core-bg"
      onClick={convertEnergyIntoCores}
      aria-label="Convert energy into cores"
    >
      <Paragraph id="cores-info">
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
      </Paragraph>
    </Button>
  );
}

export default CoreButton;
