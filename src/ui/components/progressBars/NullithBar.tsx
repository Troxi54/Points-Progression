import ResetLayerProgressBar from "@/ui/components/base/ResetLayerProgressBar";
import { formatCurrencyEffect } from "@/game/currencies/utils/format";
import CurrencyContent from "@/ui/components/base/CurrencyContent";

function NullithBar() {
  return (
    <ResetLayerProgressBar
      resetLayerId="nullith"
      mode="animated"
      animatedBarOptions={{
        gradientAngle: "5deg",
      }}
      progressFillClassName="from-nullith-1 via-nullith-2 to-nullith-1"
      labelParts={() => {
        return [
          <CurrencyContent
            currencyId="madeNullithResets"
            formatType="integerComma"
            effectClassName="text-nullith-effect"
            effectNodes={[
              {
                node: ({ cachedPlayer }) =>
                  formatCurrencyEffect(
                    cachedPlayer,
                    "madeNullithResets",
                    "points",
                  ),
              },
              {
                className: "text-vermyros-effect",
                node: ({ cachedPlayer }) =>
                  formatCurrencyEffect(
                    cachedPlayer,
                    "madeNullithResets",
                    "vermytes",
                  ),
              },
              {
                className: "text-energy-effect",
                node: ({ cachedPlayer }) =>
                  formatCurrencyEffect(
                    cachedPlayer,
                    "madeNullithResets",
                    "energy",
                  ),
              },
            ]}
          />,
        ];
      }}
    />
  );
}

export default NullithBar;
