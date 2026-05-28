import { formatLeftTime } from "@core/format/time";
import { calculateProgress } from "@core/utils/progress";
import { calculateTimeForRequirement } from "@core/utils/time";
import { formatCurrency } from "@game/currencies/utils/format";
import { getCachedCurrencyPropSelection } from "@game/currencies/utils/selector";
import { usePlayerFields } from "@ui/hooks/usePlayer/main";
import CurrencyContent from "../base/CurrencyContent";
import ProgressBar from "../base/ProgressBar";

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
    ></ProgressBar>
  );
}

export default XPState;
