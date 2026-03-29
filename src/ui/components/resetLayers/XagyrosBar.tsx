import { formatNumber } from "@core/format/number";
import CurrencyContent from "../base/CurrencyContent";
import ResetLayerProgressBar from "../base/ProgressBar/ResetLayer";
import StatusText from "../base/StatusText";
import { formatCurrencyEffect } from "@game/currencies/utils/format";

function XagyrosBar() {
  return (
    <ResetLayerProgressBar
      resetLayerId="xagyros"
      mode="animated"
      progressFillClassName="from-xagyros-1 via-xagyros-2 to-xagyros-1"
      labelParts={() => [
        <CurrencyContent
          currencyId="xagytes"
          passiveGainPriority={false}
          customGainNode={(mergedPlayer, gain) => (
            <StatusText
              active={gain.greaterThan(mergedPlayer.player.xagytes)}
              className="[font-weight:unset]"
              customNode={<> ({formatNumber(gain)})</>}
            />
          )}
          effectClassName="text-xagyros-effect"
          effectNodes={[
            {
              node: ({ cachedPlayer }) =>
                formatCurrencyEffect(
                  cachedPlayer,
                  "xagytes",
                  "xagoraDertoints",
                ),
            },
          ]}
        />,
      ]}
    />
  );
}

export default XagyrosBar;
