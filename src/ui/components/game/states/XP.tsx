import { formatLeftTime } from "@core/format/time";
import { calculateProgress } from "@core/utils/progress";
import { calculateTimeForRequirement } from "@core/utils/time";
import { formatCurrency } from "@game/currencies/utils/format";
import { getCachedCurrencyPropSelection } from "@game/currencies/utils/selector";
import CurrencyContent from "@ui/components/base/CurrencyContent";
import ProgressBar from "@ui/components/base/ProgressBar";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";

function XPState() {
  const { XP, cachedCurrency_XP_gain, XPForThisLevel, XPForNextLevel } =
    usePlayerFields(
      {
        player: ["XP"],
        cachedPlayer: ["XPForThisLevel", "XPForNextLevel"],
      },
      {
        useFormat: true,
        additionalSelectors: ({ mergedPlayer }) =>
          getCachedCurrencyPropSelection(mergedPlayer, "XP", "gain"),
      },
    );

  const progress = calculateProgress(
    XP.minus(XPForThisLevel),
    XPForNextLevel.minus(XPForThisLevel),
  );

  const leftTime = calculateTimeForRequirement(
    XP,
    cachedCurrency_XP_gain,
    XPForNextLevel,
  );

  return (
    <ProgressBar
      progress={progress}
      progressFillClassName="bg-xp-bar"
      labelParts={[
        <CurrencyContent currencyId="XP" />,
        <span className="text-text-muted">
          For next level:{" "}
          <span className="text-level-effect">
            {formatCurrency(XPForNextLevel, "XP")}
          </span>{" "}
          - {formatLeftTime(leftTime)}
        </span>,
      ]}
    />
  );
}

export default XPState;
