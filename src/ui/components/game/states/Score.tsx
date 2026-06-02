import { formatNumber } from "@core/format/number";
import { getCurrencyEffectOn } from "@game/currencies/utils/get";
import StatusText from "@ui/components/base/StatusText";
import Currency from "@ui/components/features/Currency";

function Score() {
  return (
    <Currency
      currencyId="score"
      effectClassName="text-level-effect"
      passiveGainPriority={false}
      customGainNode={(mergedPlayer, gain) => (
        <>
          <StatusText
            active={gain.greaterThan(mergedPlayer.player.score)}
            className="[font-weight:unset]"
            customNode={<> ({formatNumber(gain)})</>}
          />
        </>
      )}
      effectNodes={[
        {
          node: ({ cachedPlayer }) => (
            <>
              generates XP equal to{" "}
              {formatNumber(
                getCurrencyEffectOn(cachedPlayer, "score", "XP").multiply(100),
              )}
              % of Score
            </>
          ),
        },
      ]}
    />
  );
}

export default Score;
